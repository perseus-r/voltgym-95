import React, { useState, useRef } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  onAvatarUpdate: (newAvatarUrl: string) => void;
}

export function AvatarUpload({ currentAvatarUrl, onAvatarUpdate }: AvatarUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo 2MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas imagens.');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;

    setUploading(true);
    try {
      console.log('🔄 Iniciando upload do avatar...');
      
      // Deletar avatar anterior se existir
      if (currentAvatarUrl && currentAvatarUrl.includes('supabase')) {
        try {
          const urlParts = currentAvatarUrl.split('/');
          const fileName = urlParts[urlParts.length - 1];
          const oldPath = `${user.id}/${fileName}`;
          
          console.log('🗑️ Removendo avatar anterior:', oldPath);
          await supabase.storage
            .from('avatars')
            .remove([oldPath]);
        } catch (removeError) {
          console.warn('⚠️ Erro ao remover avatar anterior:', removeError);
        }
      }

      // Upload novo avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('📤 Fazendo upload para:', filePath);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false // Sempre criar novo arquivo
        });

      if (uploadError) {
        console.error('❌ Erro no upload:', uploadError);
        throw uploadError;
      }

      console.log('✅ Upload realizado:', uploadData);

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const newAvatarUrl = urlData.publicUrl;
      console.log('🔗 URL pública gerada:', newAvatarUrl);

      // Atualizar perfil no banco - usar upsert para garantir que funcione
      const { data: profileData, error: updateError } = await supabase
        .from('profiles')
        .upsert({ 
          user_id: user.id,
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString(),
          display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Usuário VOLT'
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (updateError) {
        console.error('❌ Erro ao atualizar perfil:', updateError);
        throw updateError;
      }

      console.log('✅ Perfil atualizado:', profileData);

      onAvatarUpdate(newAvatarUrl);
      setPreviewUrl(null);
      toast.success('Foto de perfil atualizada!');

    } catch (error) {
      console.error('❌ Erro completo no upload:', error);
      toast.error('Erro ao atualizar foto de perfil. Tente novamente.');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!user || !currentAvatarUrl) return;

    setUploading(true);
    try {
      // Deletar do storage
      const oldPath = currentAvatarUrl.split('/').pop();
      if (oldPath) {
        await supabase.storage
          .from('avatars')
          .remove([`${user.id}/${oldPath}`]);
      }

      // Atualizar perfil
      const { error } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      onAvatarUpdate('');
      toast.success('Foto de perfil removida');

    } catch (error) {
      console.error('Erro ao remover avatar:', error);
      toast.error('Erro ao remover foto de perfil');
    } finally {
      setUploading(false);
    }
  };

  const currentUrl = previewUrl || currentAvatarUrl;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Display */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden ring-2 ring-accent/30">
          {currentUrl ? (
            <img 
              src={currentUrl} 
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-accent" />
          )}
        </div>

        {/* Remove Button */}
        {currentAvatarUrl && !uploading && (
          <button
            onClick={removeAvatar}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        )}

        {/* Loading Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex gap-2">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          {currentAvatarUrl ? 'Alterar' : 'Adicionar'} Foto
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Info */}
      <p className="text-xs text-txt-3 text-center max-w-xs">
        Sua foto aparecerá nos comentários da comunidade. Máximo 2MB.
      </p>
    </div>
  );
}