import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Camera, 
  Mic, 
  Download, 
  Wifi,
  WifiOff,
  Bell,
  MapPin,
  Activity,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export function MobileAppFeatures() {
  const [isNative, setIsNative] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [permissions, setPermissions] = useState<any>({});

  useEffect(() => {
    // Check if running as native app
    setIsNative(Capacitor.isNativePlatform());
    
    // Configure native features if available
    if (Capacitor.isNativePlatform()) {
      initializeNativeFeatures();
    }
  }, []);

  const initializeNativeFeatures = async () => {
    try {
      // Configure status bar - simplified for compatibility
      if (Capacitor.isNativePlatform()) {
        console.log('Native app initialized');
      }
      
      // Hide splash screen after initialization
      await SplashScreen.hide();
      
    } catch (error) {
      console.log('Native features not available:', error);
    }
  };

  const nativeFeatures = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Análise de Movimento IA",
      description: "Use a câmera para análise biomecânica em tempo real",
      available: isNative,
      color: "text-purple-400"
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Coach de Voz Inteligente",
      description: "Comandos de voz para navegação hands-free durante treinos",
      available: isNative,
      color: "text-green-400"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Notificações Inteligentes",
      description: "Lembretes personalizados e motivação baseada em IA",
      available: isNative,
      color: "text-orange-400"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Treinos Baseados em Localização",
      description: "Adaptação automática baseada em altitude e clima local",
      available: isNative,
      color: "text-blue-400"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Integração com Health Apps",
      description: "Sincronização com Apple Health e Google Fit",
      available: isNative,
      color: "text-red-400"
    },
    {
      icon: <WifiOff className="w-8 h-8" />,
      title: "Modo Offline Completo",
      description: "Todos os recursos disponíveis sem conexão",
      available: true,
      color: "text-cyan-400"
    }
  ];

  const downloadLinks = [
    {
      platform: "iOS",
      icon: "🍎",
      url: "#",
      version: "v2.1.0",
      size: "47 MB"
    },
    {
      platform: "Android",
      icon: "🤖",
      url: "#", 
      version: "v2.1.0",
      size: "52 MB"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Status Banner */}
      <Card className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>
                {isNative ? 'Executando como App Nativo' : 'Versão Web - Faça o Download do App'}
              </h3>
              <p style={{ color: 'var(--text-2)' }}>
                {isNative 
                  ? 'Aproveitando recursos nativos do dispositivo para máxima performance'
                  : 'Para a melhor experiência, baixe nosso aplicativo nativo'
                }
              </p>
            </div>
          </div>
          <Badge className={`${isNative ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
            {isNative ? 'App Nativo' : 'Versão Web'}
          </Badge>
        </div>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nativeFeatures.map((feature, index) => (
          <Card key={index} className={`p-6 transition-all duration-300 hover:scale-105 ${
            feature.available 
              ? 'bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-cyan-400/50' 
              : 'bg-gray-800/30 border-gray-600/30 opacity-60'
          }`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                feature.available 
                  ? 'bg-gradient-to-r from-cyan-400/20 to-blue-400/20' 
                  : 'bg-gray-600/20'
              }`}>
                <div className={feature.available ? feature.color : 'text-gray-500'}>
                  {feature.icon}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold" style={{ color: 'var(--text-1)' }}>
                  {feature.title}
                </h4>
                <Badge className={`text-xs ${
                  feature.available 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }`}>
                  {feature.available ? 'Disponível' : 'App Nativo Apenas'}
                </Badge>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
              {feature.description}
            </p>
          </Card>
        ))}
      </div>

      {/* Download Section */}
      {!isNative && (
        <div className="grid md:grid-cols-2 gap-6">
          {downloadLinks.map((link, index) => (
            <Card key={index} className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{link.icon}</div>
                <div>
                  <h4 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>
                    Download para {link.platform}
                  </h4>
                  <p style={{ color: 'var(--text-2)' }}>
                    {link.version} • {link.size}
                  </p>
                </div>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl hover:scale-105 transition-all duration-300">
                <Download className="w-5 h-5 mr-2" />
                Baixar App {link.platform}
              </Button>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <Shield className="w-4 h-4 mx-auto mb-1 text-green-400" />
                  <span style={{ color: 'var(--text-2)' }}>Seguro</span>
                </div>
                <div>
                  <Zap className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
                  <span style={{ color: 'var(--text-2)' }}>Rápido</span>
                </div>
                <div>
                  <Globe className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                  <span style={{ color: 'var(--text-2)' }}>Global</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Technical Specs */}
      <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50">
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-1)' }}>
          Especificações Técnicas do App
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="font-semibold text-cyan-400 mb-2">Compatibilidade</h4>
            <ul className="text-sm space-y-1" style={{ color: 'var(--text-2)' }}>
              <li>• iOS 12.0 ou superior</li>
              <li>• Android 8.0 ou superior</li>
              <li>• Tablet otimizado</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-400 mb-2">Performance</h4>
            <ul className="text-sm space-y-1" style={{ color: 'var(--text-2)' }}>
              <li>• Inicialização em menos de 2s</li>
              <li>• Animações a 60fps</li>
              <li>• Baixo consumo bateria</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-400 mb-2">Armazenamento</h4>
            <ul className="text-sm space-y-1" style={{ color: 'var(--text-2)' }}>
              <li>• Cache inteligente</li>
              <li>• Sincronização nuvem</li>
              <li>• Backup automático</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-orange-400 mb-2">Segurança</h4>
            <ul className="text-sm space-y-1" style={{ color: 'var(--text-2)' }}>
              <li>• Criptografia E2E</li>
              <li>• Biometria integrada</li>
              <li>• LGPD compliance</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}