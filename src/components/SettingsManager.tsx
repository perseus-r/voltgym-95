import { useState } from "react";
import { Settings, Bell, Vibrate, Moon, Sun, Volume2, VolumeX, Shield, Database, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface SettingsManagerProps {
  onClose?: () => void;
}

export function SettingsManager({ onClose }: SettingsManagerProps) {
  const { user, signOut } = useAuth();
  
  // Estados das configurações
  const [settings, setSettings] = useState({
    notifications: true,
    vibration: true,
    darkMode: true,
    sound: true,
    autoSave: true,
    dataSync: true,
    language: 'pt-BR',
    restTimerDefault: '90',
    workoutReminders: true,
    progressSharing: false
  });

  const handleSettingChange = (key: keyof typeof settings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Salvar no localStorage
    localStorage.setItem(`volt_setting_${key}`, value.toString());
    
    toast.success("Configuração atualizada", {
      description: `${key} foi ${value ? 'ativado' : 'desativado'}`
    });
  };

  const handleExportData = () => {
    try {
      const userData = {
        user: user?.email,
        settings,
        exportDate: new Date().toISOString(),
        workoutHistory: localStorage.getItem('bora_hist_v1'),
        userProgress: localStorage.getItem(`user_xp_${user?.id}`)
      };
      
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `volt-fitness-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Dados exportados com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar dados");
    }
  };

  const handleClearData = () => {
    if (confirm("Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.")) {
      try {
        // Limpar dados específicos do usuário
        const keysToRemove = Object.keys(localStorage).filter(key => 
          key.includes('bora_') || 
          key.includes('user_') || 
          key.includes('volt_') ||
          key.includes('workout_')
        );
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        toast.success("Dados limpos com sucesso!");
      } catch (error) {
        toast.error("Erro ao limpar dados");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso!");
      onClose?.();
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-bold text-txt">Configurações</h2>
      </div>

      {/* Notificações */}
      <Card className="liquid-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-txt">
            <Bell className="w-5 h-5 text-accent" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="text-txt-2">Notificações push</Label>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(value) => handleSettingChange('notifications', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="workoutReminders" className="text-txt-2">Lembretes de treino</Label>
            <Switch
              id="workoutReminders"
              checked={settings.workoutReminders}
              onCheckedChange={(value) => handleSettingChange('workoutReminders', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="vibration" className="text-txt-2">Vibração</Label>
            <Switch
              id="vibration"
              checked={settings.vibration}
              onCheckedChange={(value) => handleSettingChange('vibration', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Interface */}
      <Card className="liquid-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-txt">
            <Moon className="w-5 h-5 text-accent" />
            Interface
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="darkMode" className="text-txt-2">Modo escuro</Label>
            <Switch
              id="darkMode"
              checked={settings.darkMode}
              onCheckedChange={(value) => handleSettingChange('darkMode', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="sound" className="text-txt-2">Efeitos sonoros</Label>
            <Switch
              id="sound"
              checked={settings.sound}
              onCheckedChange={(value) => handleSettingChange('sound', value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-txt-2">Idioma</Label>
            <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
              <SelectTrigger className="bg-input-bg border-input-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">🇧🇷 Português (Brasil)</SelectItem>
                <SelectItem value="en-US">🇺🇸 English (US)</SelectItem>
                <SelectItem value="es-ES">🇪🇸 Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Treinos */}
      <Card className="liquid-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-txt">
            <Shield className="w-5 h-5 text-accent" />
            Treinos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="autoSave" className="text-txt-2">Salvamento automático</Label>
            <Switch
              id="autoSave"
              checked={settings.autoSave}
              onCheckedChange={(value) => handleSettingChange('autoSave', value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-txt-2">Timer padrão (segundos)</Label>
            <Select value={settings.restTimerDefault} onValueChange={(value) => handleSettingChange('restTimerDefault', value)}>
              <SelectTrigger className="bg-input-bg border-input-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">60 segundos</SelectItem>
                <SelectItem value="90">90 segundos</SelectItem>
                <SelectItem value="120">120 segundos</SelectItem>
                <SelectItem value="180">180 segundos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="progressSharing" className="text-txt-2">Compartilhar progresso</Label>
            <Switch
              id="progressSharing"
              checked={settings.progressSharing}
              onCheckedChange={(value) => handleSettingChange('progressSharing', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dados */}
      <Card className="liquid-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-txt">
            <Database className="w-5 h-5 text-accent" />
            Gerenciar Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dataSync" className="text-txt-2">Sincronização na nuvem</Label>
            <Switch
              id="dataSync"
              checked={settings.dataSync}
              onCheckedChange={(value) => handleSettingChange('dataSync', value)}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="w-full liquid-glass-button"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Dados
            </Button>
            
            <Button
              onClick={handleClearData}
              variant="outline"
              className="w-full liquid-glass-button hover:bg-error/10 hover:border-error/30"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Dados Locais
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações da Conta */}
      <Card className="liquid-glass">
        <CardHeader>
          <CardTitle className="text-txt">Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="w-4 h-4" />
            <AlertDescription className="text-txt-2">
              Logado como: <strong>{user?.email}</strong>
            </AlertDescription>
          </Alert>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full liquid-glass-button hover:bg-error/10 hover:border-error/30"
          >
            Fazer Logout
          </Button>
        </CardContent>
      </Card>

      {/* Botão de Fechar */}
      {onClose && (
        <div className="flex justify-center pt-4">
          <Button onClick={onClose} className="px-8">
            Fechar Configurações
          </Button>
        </div>
      )}
    </div>
  );
}