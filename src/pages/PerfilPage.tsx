import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Camera, 
  Shield, 
  Crown,
  Star,
  Trophy,
  Zap,
  Target,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Ruler,
  Weight
} from 'lucide-react';
import { AvatarUpload } from '@/components/AvatarUpload';
import { UserProfileUpload } from '@/components/UserProfileUpload';
import VerifiedBadge from '@/components/VerifiedBadge';
import { VoltCard } from '@/components/VoltCard';

interface Profile {
  display_name: string;
  phone: string;
  experience_level: string;
  goal: string;
  workout_location: string;
  age: number;
  weight: number;
  height: number;
  avatar_url: string | null;
  verified: boolean;
  current_xp: number;
  total_workouts: number;
  streak_days: number;
}

export default function PerfilPage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    display_name: 'Usuário VOLT',
    phone: '',
    experience_level: 'intermediario',
    goal: 'massa',
    workout_location: 'academia',
    age: 25,
    weight: 70,
    height: 175,
    avatar_url: null,
    verified: false,
    current_xp: 0,
    total_workouts: 0,
    streak_days: 0
  });
  const [loading, setLoading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile({
          display_name: data.display_name || 'Usuário VOLT',
          phone: data.phone || '',
          experience_level: data.experience_level || 'intermediario',
          goal: data.goal || 'massa',
          workout_location: data.workout_location || 'academia',
          age: data.age || 25,
          weight: data.weight || 70,
          height: data.height || 175,
          avatar_url: data.avatar_url,
          verified: data.verified || false,
          current_xp: data.current_xp || 0,
          total_workouts: data.total_workouts || 0,
          streak_days: data.streak_days || 0
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: profile.display_name,
          phone: profile.phone,
          experience_level: profile.experience_level,
          goal: profile.goal,
          workout_location: profile.workout_location,
          age: profile.age,
          weight: profile.weight,
          height: profile.height,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  const getExperienceLevel = (level: string) => {
    switch (level) {
      case 'iniciante': return { label: 'Iniciante', icon: Star, color: 'text-green-400' };
      case 'intermediario': return { label: 'Intermediário', icon: Trophy, color: 'text-yellow-400' };
      case 'avancado': return { label: 'Avançado', icon: Crown, color: 'text-purple-400' };
      default: return { label: 'Intermediário', icon: Trophy, color: 'text-yellow-400' };
    }
  };

  const getGoalInfo = (goal: string) => {
    switch (goal) {
      case 'massa': return { label: 'Ganho de Massa', icon: Target, color: 'text-blue-400' };
      case 'definicao': return { label: 'Definição', icon: Zap, color: 'text-red-400' };
      case 'forca': return { label: 'Força', icon: Shield, color: 'text-orange-400' };
      case 'resistencia': return { label: 'Resistência', icon: Star, color: 'text-green-400' };
      default: return { label: 'Ganho de Massa', icon: Target, color: 'text-blue-400' };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <VoltCard className="p-8 text-center max-w-md">
          <User className="w-16 h-16 text-accent mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Acesso Negado</h1>
          <p className="text-text-2">Faça login para acessar seu perfil.</p>
        </VoltCard>
      </div>
    );
  }

  const experienceInfo = getExperienceLevel(profile.experience_level);
  const goalInfo = getGoalInfo(profile.goal);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container-custom max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <User className="w-8 h-8 text-accent" />
          <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Pessoais */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <VoltCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <User className="w-6 h-6 text-accent" />
                    <h2 className="text-xl font-bold text-white">Informações Pessoais</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-accent hover:bg-accent/10"
                  >
                    {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display_name" className="text-text-2">Nome</Label>
                    <Input
                      id="display_name"
                      value={profile.display_name}
                      onChange={(e) => setProfile({...profile, display_name: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1 bg-surface/50 border-line/30"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-text-2">Telefone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1 bg-surface/50 border-line/30"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="age" className="text-text-2">Idade</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || 25})}
                      disabled={!isEditing}
                      className="mt-1 bg-surface/50 border-line/30"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-text-2">Email</Label>
                    <Input
                      value={user.email || ''}
                      disabled
                      className="mt-1 bg-surface/30 border-line/20 text-text-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="weight" className="text-text-2">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={profile.weight}
                      onChange={(e) => setProfile({...profile, weight: parseFloat(e.target.value) || 70})}
                      disabled={!isEditing}
                      className="mt-1 bg-surface/50 border-line/30"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="height" className="text-text-2">Altura (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={profile.height}
                      onChange={(e) => setProfile({...profile, height: parseInt(e.target.value) || 175})}
                      disabled={!isEditing}
                      className="mt-1 bg-surface/50 border-line/30"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 mt-6">
                    <Button 
                      onClick={saveProfile} 
                      disabled={loading}
                      className="flex-1 bg-accent text-accent-ink hover:bg-accent/90"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      className="flex-1 border-line/30"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </VoltCard>
            </motion.div>

            {/* Preferências de Treino */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <VoltCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-accent" />
                  <h2 className="text-xl font-bold text-white">Preferências de Treino</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience_level" className="text-text-2">Nível de Experiência</Label>
                    <Select
                      value={profile.experience_level}
                      onValueChange={(value) => setProfile({...profile, experience_level: value})}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="mt-1 bg-surface/50 border-line/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iniciante">Iniciante</SelectItem>
                        <SelectItem value="intermediario">Intermediário</SelectItem>
                        <SelectItem value="avancado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="goal" className="text-text-2">Objetivo Principal</Label>
                    <Select
                      value={profile.goal}
                      onValueChange={(value) => setProfile({...profile, goal: value})}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="mt-1 bg-surface/50 border-line/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="massa">Ganho de Massa</SelectItem>
                        <SelectItem value="definicao">Definição</SelectItem>
                        <SelectItem value="forca">Força</SelectItem>
                        <SelectItem value="resistencia">Resistência</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="workout_location" className="text-text-2">Local de Treino</Label>
                    <Select
                      value={profile.workout_location}
                      onValueChange={(value) => setProfile({...profile, workout_location: value})}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="mt-1 bg-surface/50 border-line/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academia">Academia</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="parque">Parque</SelectItem>
                        <SelectItem value="hibrido">Híbrido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </VoltCard>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar e Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <VoltCard className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mx-auto overflow-hidden">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-accent" />
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowUploadDialog(true)}
                    className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full border-2 border-background bg-accent text-accent-ink hover:bg-accent/90"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white">{profile.display_name}</h3>
                  {profile.verified && <VerifiedBadge size="md" />}
                </div>
                
                <p className="text-text-2 text-sm mb-4">{user.email}</p>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center gap-2">
                    <experienceInfo.icon className={`w-4 h-4 ${experienceInfo.color}`} />
                    <Badge variant="outline" className="border-accent/30 text-accent">
                      {experienceInfo.label}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <goalInfo.icon className={`w-4 h-4 ${goalInfo.color}`} />
                    <Badge variant="outline" className="border-accent/30 text-accent">
                      {goalInfo.label}
                    </Badge>
                  </div>
                </div>
              </VoltCard>
            </motion.div>

            {/* Estatísticas */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <VoltCard className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Estatísticas
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-text-2">XP</span>
                    </div>
                    <span className="text-white font-bold">{profile.current_xp}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-blue-400" />
                      <span className="text-text-2">Treinos</span>
                    </div>
                    <span className="text-white font-bold">{profile.total_workouts}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-red-400" />
                      <span className="text-text-2">Streak</span>
                    </div>
                    <span className="text-white font-bold">{profile.streak_days} dias</span>
                  </div>
                </div>
              </VoltCard>
            </motion.div>

            {/* Verificação */}
            {!profile.verified && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <VoltCard className="p-6">
                  <div className="text-center">
                    <Shield className="w-12 h-12 text-accent mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Verificação</h3>
                    <p className="text-text-2 text-sm mb-4">
                      Verifique sua conta para ter acesso a recursos exclusivos
                    </p>
                    <Badge variant="outline" className="border-yellow-400/30 text-yellow-400">
                      Não Verificado
                    </Badge>
                  </div>
                </VoltCard>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog de Upload */}
      {showUploadDialog && (
        <UserProfileUpload onClose={() => setShowUploadDialog(false)} />
      )}
    </div>
  );
}