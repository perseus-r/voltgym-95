import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getConfig, setConfig } from "@/lib/storage";
import { Settings, User, Bell, Shield, Database, Smartphone, Cloud } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSettings } from "@/components/LanguageSettings";

export function InlineSettings() {
  const { user } = useAuth();
  const [config, setConfigState] = useState(getConfig());
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
    analytics: true
  });

  const handleSave = () => {
    setConfig(config);
    localStorage.setItem('bora_notifications', JSON.stringify(notifications));
    localStorage.setItem('bora_privacy', JSON.stringify(privacy));
  };

  const handleTest = async () => {
    try {
      const response = await fetch(`${config.apiBase}/workout/today?user_id=${config.userId}`);
      const data = await response.json();
      alert('✅ API Test Success: ' + JSON.stringify(data, null, 2));
    } catch (error) {
      alert('❌ API Test Failed: ' + error);
    }
  };

  const handleResetData = () => {
    if (confirm('⚠️ Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      // Remover dados antigos (deprecated)
      localStorage.removeItem('bora_hist_v1');
      localStorage.removeItem('bora_profile');
      localStorage.removeItem('bora_progress');
      
      // Remover dados específicos do usuário se logado
      if (user) {
        const userHistoryKey = `fitai_history_v1_user_${user.id}`;
        const userConfigKey = `fitai_config_user_${user.id}`;
        const userXPKey = `user_xp_${user.id}`;
        localStorage.removeItem(userHistoryKey);
        localStorage.removeItem(userConfigKey);
        localStorage.removeItem(userXPKey);
      }
      
      alert('✅ Dados resetados com sucesso!');
    }
  };

  const handleExportData = () => {
    const userData = {
      history: localStorage.getItem('bora_hist_v1'),
      profile: localStorage.getItem('bora_profile'),
      progress: localStorage.getItem('bora_progress'),
      config: localStorage.getItem('bora_config'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bora_fitness_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="api" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="api">🔗 API</TabsTrigger>
          <TabsTrigger value="profile">👤 Perfil</TabsTrigger>
          <TabsTrigger value="notifications">🔔 Notificações</TabsTrigger>
          <TabsTrigger value="language">🌍 Idioma</TabsTrigger>
          <TabsTrigger value="data">💾 Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-4">
          <div className="space-y-4">
             <div>
               <Label htmlFor="apiBase">API Base URL</Label>
               <Input
                 id="apiBase"
                 value={config.apiBase}
                 onChange={(e) => setConfigState(prev => ({ ...prev, apiBase: e.target.value }))}
                 placeholder="/api"
                 className="mt-1"
               />
               <p className="text-xs text-txt-3 mt-1">URL base para conectar com a API de treinos</p>
             </div>
             
             <div>
               <Label htmlFor="userId">User ID</Label>
               <Input
                 id="userId"
                 value={config.userId}
                 onChange={(e) => setConfigState(prev => ({ ...prev, userId: e.target.value }))}
                 placeholder="demo"
                 className="mt-1"
               />
               <p className="text-xs text-txt-3 mt-1">Identificador único do usuário no sistema</p>
             </div>

            <div className="flex gap-3">
              <Button onClick={handleTest} variant="outline" className="flex-1">
                <Database className="w-4 h-4 mr-2" />
                Testar Conexão
              </Button>
            </div>

            <Card className="p-4 bg-accent/10 border-accent/20">
              <h4 className="font-semibold text-accent mb-2">Status da API</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Conexão:</span>
                  <Badge className="bg-green-500/20 text-green-400">Ativa</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Última sincronização:</span>
                  <span className="text-txt-3">2 min atrás</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-accent" />
                <h4 className="font-semibold text-txt">Informações do Perfil</h4>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Nível:</span>
                  <Badge className="bg-accent/20 text-accent">Soldado</Badge>
                </div>
                <div className="flex justify-between">
                  <span>XP Total:</span>
                  <span className="text-accent font-semibold">1,247 XP</span>
                </div>
                <div className="flex justify-between">
                  <span>Treinos Completos:</span>
                  <span className="text-txt">47</span>
                </div>
                <div className="flex justify-between">
                  <span>Membro desde:</span>
                  <span className="text-txt-3">Janeiro 2024</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold text-txt mb-3">Configurações de Privacidade</h4>
              <div className="space-y-3">
                {Object.entries(privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">
                      {key === 'shareProgress' && 'Compartilhar progresso'}
                      {key === 'publicProfile' && 'Perfil público'}
                      {key === 'dataCollection' && 'Coleta de dados'}
                      {key === 'analytics' && 'Analytics'}
                    </span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setPrivacy({...privacy, [key]: e.target.checked})}
                      className="accent-accent"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-accent" />
              <h4 className="font-semibold text-txt">Notificações</h4>
            </div>
            <div className="space-y-3">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">
                      {key === 'workoutReminders' && 'Lembretes de treino'}
                      {key === 'progressUpdates' && 'Atualizações de progresso'}
                      {key === 'socialUpdates' && 'Atualizações sociais'}
                      {key === 'weeklyReports' && 'Relatórios semanais'}
                    </span>
                    <p className="text-xs text-txt-3">
                      {key === 'workoutReminders' && 'Receba lembretes para não perder treinos'}
                      {key === 'progressUpdates' && 'Notificações sobre conquistas e marcos'}
                      {key === 'socialUpdates' && 'Atividades da comunidade'}
                      {key === 'weeklyReports' && 'Resumo semanal do seu progresso'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                    className="accent-accent"
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="space-y-4">
          <LanguageSettings />
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-accent" />
              <h4 className="font-semibold text-txt">Gerenciamento de Dados</h4>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button onClick={handleExportData} variant="outline" className="flex items-center gap-2">
                  <Cloud className="w-4 h-4" />
                  Exportar Dados
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Sincronizar
                </Button>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h5 className="font-semibold text-red-400 mb-2">Zona de Perigo</h5>
                <p className="text-sm text-txt-2 mb-3">
                  Esta ação irá remover permanentemente todos os seus dados de treino, progresso e conquistas.
                </p>
                <Button 
                  onClick={handleResetData} 
                  variant="destructive" 
                  className="w-full"
                >
                  Resetar Todos os Dados
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 pt-4 border-t border-line">
        <Button onClick={handleSave} className="w-full btn-premium">
          💾 Salvar Configurações
        </Button>
      </div>
    </div>
  );
}