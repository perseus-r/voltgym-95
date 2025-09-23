import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, User, Bell, Globe, Download, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSettings } from "@/components/LanguageSettings";
import { ProgressEngine } from "@/services/ProgressEngine";

export function UserSettings() {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    progressUpdates: true,
    socialUpdates: false,
    weeklyReports: true
  });
  const [privacy, setPrivacy] = useState({
    shareProgress: false,
    publicProfile: false,
    dataCollection: true,
    analytics: false
  });

  const handleSave = () => {
    localStorage.setItem('bora_notifications', JSON.stringify(notifications));
    localStorage.setItem('bora_privacy', JSON.stringify(privacy));
    alert('✅ Configurações salvas com sucesso!');
  };

  const handleExportData = () => {
    const userId = user?.id || 'user';
    const userData = {
      // Dados pessoais do usuário
      userHistory: localStorage.getItem(`fitai_history_v1_user_${userId}`),
      userConfig: localStorage.getItem(`fitai_config_user_${userId}`),
      userXP: localStorage.getItem(`user_xp_${userId}`),
      plans: localStorage.getItem('bora_plans_v1'),
      planExercises: localStorage.getItem('bora_plan_exercises_v1'),
      notifications: localStorage.getItem('bora_notifications'),
      privacy: localStorage.getItem('bora_privacy'),
      exportDate: new Date().toISOString(),
      userId: userId
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meus_dados_bora_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSignOut = async () => {
    if (confirm('Deseja realmente sair da sua conta?')) {
      await signOut();
    }
  };

  // Dados do perfil do usuário
  const currentXP = ProgressEngine.currentXP();
  const currentLevel = ProgressEngine.currentLevel();
  const totalWorkouts = JSON.parse(localStorage.getItem(`fitai_history_v1_user_${user?.id}`) || '[]').length;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-accent/20">
            <Settings className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-txt">⚙️ Suas Configurações</h1>
            <p className="text-txt-2">Personalize sua experiência no BORA</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">👤 Perfil</TabsTrigger>
          <TabsTrigger value="notifications">🔔 Notificações</TabsTrigger>
          <TabsTrigger value="language">🌍 Idioma</TabsTrigger>
          <TabsTrigger value="data">📱 Meus Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-accent" />
                <h4 className="font-semibold text-txt">Informações do Perfil</h4>
              </div>
              
              {/* User Info */}
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="text-accent font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nível:</span>
                  <Badge className="bg-accent/20 text-accent">Nível {currentLevel}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>XP Total:</span>
                  <span className="text-accent font-semibold">{currentXP.toLocaleString()} XP</span>
                </div>
                <div className="flex justify-between">
                  <span>Treinos Completos:</span>
                  <span className="text-txt">{totalWorkouts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Membro desde:</span>
                  <span className="text-txt-3">
                    {new Date(user?.created_at || new Date()).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </span>
                </div>
              </div>

              <hr className="border-line mb-4" />
              
              <h5 className="font-semibold text-txt mb-3">Configurações de Privacidade</h5>
              <div className="space-y-3">
                {Object.entries(privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">
                        {key === 'shareProgress' && 'Compartilhar meu progresso'}
                        {key === 'publicProfile' && 'Perfil público'}
                        {key === 'dataCollection' && 'Permitir coleta de dados'}
                        {key === 'analytics' && 'Dados de uso anônimo'}
                      </span>
                      <p className="text-xs text-txt-3">
                        {key === 'shareProgress' && 'Permitir que outros vejam meus treinos'}
                        {key === 'publicProfile' && 'Tornar meu perfil visível publicamente'}
                        {key === 'dataCollection' && 'Ajudar a melhorar o app'}
                        {key === 'analytics' && 'Estatísticas anônimas para melhorias'}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setPrivacy({...privacy, [key]: e.target.checked})}
                      className="accent-accent scale-110"
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Sign Out */}
            <Card className="p-4 border-red-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-txt">Sair da Conta</h5>
                  <p className="text-sm text-txt-3">Encerrar sua sessão neste dispositivo</p>
                </div>
                <Button onClick={handleSignOut} variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-accent" />
              <h4 className="font-semibold text-txt">Preferências de Notificação</h4>
            </div>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">
                      {key === 'workoutReminders' && '🏋️ Lembretes de treino'}
                      {key === 'progressUpdates' && '📈 Atualizações de progresso'}
                      {key === 'socialUpdates' && '👥 Atividades da comunidade'}
                      {key === 'weeklyReports' && '📊 Relatórios semanais'}
                    </span>
                    <p className="text-xs text-txt-3">
                      {key === 'workoutReminders' && 'Receba lembretes para não perder seus treinos'}
                      {key === 'progressUpdates' && 'Notificações sobre conquistas e marcos'}
                      {key === 'socialUpdates' && 'Curtidas, comentários e novos seguidores'}
                      {key === 'weeklyReports' && 'Resumo semanal do seu progresso'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                    className="accent-accent scale-110"
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-accent" />
              <h4 className="font-semibold text-txt">Configurações de Idioma</h4>
            </div>
            <LanguageSettings />
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-5 h-5 text-accent" />
              <h4 className="font-semibold text-txt">Seus Dados</h4>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <h5 className="font-medium text-accent mb-2">📦 Exportar Meus Dados</h5>
                <p className="text-sm text-txt-2 mb-3">
                  Baixe uma cópia de todos os seus dados pessoais: treinos, progresso, configurações e planos.
                </p>
                <Button onClick={handleExportData} className="w-full bg-accent/20 text-accent hover:bg-accent/30 border border-accent/30">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Meus Dados
                </Button>
              </div>

              <div className="p-4 bg-surface/50 rounded-lg border border-line/30">
                <h5 className="font-medium text-txt mb-2">📋 Informações dos Dados</h5>
                <div className="text-sm space-y-1 text-txt-3">
                  <p>• Histórico de treinos: {totalWorkouts} registros</p>
                  <p>• XP acumulado: {currentXP.toLocaleString()} pontos</p>
                  <p>• Planos salvos: {JSON.parse(localStorage.getItem('bora_plans_v1') || '[]').length} planos</p>
                  <p>• Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 pt-4 border-t border-line">
        <Button onClick={handleSave} className="w-full btn-premium text-lg py-3">
          💾 Salvar Todas as Configurações
        </Button>
      </div>
    </div>
  );
}