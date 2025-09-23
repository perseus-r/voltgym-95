import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Edit, Save, X } from "lucide-react";
import { AvatarUpload } from "./AvatarUpload";

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
}

export function UserProfile() {
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
    avatar_url: null
  });
  const [loading, setLoading] = useState(false);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
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
          avatar_url: data.avatar_url
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

  return (
    <Dialog onOpenChange={(open) => {
      if (open) {
        loadProfile();
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-accent" />
            Perfil do Usuário
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Foto de Perfil */}
          <Card className="p-4">
            <h3 className="font-semibold text-txt mb-4 text-center">Foto de Perfil</h3>
            <AvatarUpload 
              currentAvatarUrl={profile.avatar_url}
              onAvatarUpdate={(newUrl) => setProfile({...profile, avatar_url: newUrl})}
            />
          </Card>

          {/* Informações básicas */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-txt">Informações Básicas</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="display_name">Nome</Label>
                <Input
                  id="display_name"
                  value={profile.display_name}
                  onChange={(e) => setProfile({...profile, display_name: e.target.value})}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || 25})}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profile.weight}
                    onChange={(e) => setProfile({...profile, weight: parseInt(e.target.value) || 70})}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile({...profile, height: parseInt(e.target.value) || 175})}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Preferências de treino */}
          <Card className="p-4">
            <h3 className="font-semibold text-txt mb-3">Preferências de Treino</h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="experience_level">Nível de Experiência</Label>
                <Select
                  value={profile.experience_level}
                  onValueChange={(value) => setProfile({...profile, experience_level: value})}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
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
                <Label htmlFor="goal">Objetivo Principal</Label>
                <Select
                  value={profile.goal}
                  onValueChange={(value) => setProfile({...profile, goal: value})}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
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
              
              <div>
                <Label htmlFor="workout_location">Local de Treino</Label>
                <Select
                  value={profile.workout_location}
                  onValueChange={(value) => setProfile({...profile, workout_location: value})}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
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
          </Card>

          {isEditing && (
            <div className="flex gap-3">
              <Button 
                onClick={saveProfile} 
                disabled={loading}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}