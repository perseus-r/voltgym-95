import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Shield, CheckCircle, Upload, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfileUploadProps {
  onClose?: () => void;
}

export function UserProfileUpload({ onClose }: UserProfileUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você deve selecionar uma imagem para fazer upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('user_id', user?.id);

      if (updateError) {
        throw updateError;
      }

      toast.success('Foto do perfil atualizada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const requestVerification = async () => {
    try {
      // Simulate verification request
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsVerified(true);
      
      // Update profile verification status
      await supabase
        .from('profiles')
        .update({ verified: true } as any)
        .eq('user_id', user?.id);

      toast.success('Conta verificada com sucesso!');
    } catch (error) {
      toast.error('Erro ao verificar conta');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <Card className="w-full max-w-md p-6 bg-gradient-to-b from-surface to-card border border-line shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <User className="w-4 h-4 text-accent" />
            </div>
            <h2 className="text-xl font-bold text-text">Perfil do Usuário</h2>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-txt-2 hover:text-text"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Avatar Upload Section */}
          <div className="text-center">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 border-4 border-accent/30">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                    <User className="w-10 h-10 text-accent" />
                  </div>
                )}
              </Avatar>
              
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-accent text-black rounded-full flex items-center justify-center cursor-pointer hover:bg-accent/80 transition-colors shadow-lg">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {uploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-accent"
              >
                Fazendo upload...
              </motion.div>
            )}
          </div>

          {/* User Info */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text font-medium">
                    {user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Usuário'}
                  </p>
                  <p className="text-txt-2 text-sm">{user?.email}</p>
                </div>
                {isVerified && (
                  <Badge className="bg-accent/20 text-accent border-accent/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verificado
                  </Badge>
                )}
              </div>
            </div>

            {/* Verification Section */}
            {!isVerified && (
              <div className="p-4 rounded-lg border border-accent/20 bg-accent/5">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-accent" />
                  <div>
                    <h3 className="font-medium text-text">Verificação de Conta</h3>
                    <p className="text-sm text-txt-2">Torne-se um membro verificado</p>
                  </div>
                </div>
                
                <Button
                  onClick={requestVerification}
                  className="w-full bg-accent text-black hover:bg-accent/80"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Solicitar Verificação
                </Button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-text">0</div>
                <div className="text-xs text-txt-2">Treinos</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-text">0</div>
                <div className="text-xs text-txt-2">Sequência</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-lg font-bold text-text">0</div>
                <div className="text-xs text-txt-2">XP</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}