import { useState } from "react";
import { Settings, Download, Share2, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiConfig } from "@/components/ApiConfig";
import { ExportService } from "@/services/ExportService";
import { useVibration } from "@/hooks/useVibration";
import { useSubscription } from "@/hooks/useSubscription";

export function TopBar() {
  const [showConfig, setShowConfig] = useState(false);
  const { vibrateClick } = useVibration();
  const { isPremium } = useSubscription();

  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    const data = ExportService.generateWorkoutReport();
    
    switch (format) {
      case 'csv':
        ExportService.downloadCSV(data);
        break;
      case 'json':
        ExportService.downloadJSON(data);
        break;
      case 'pdf':
        await ExportService.downloadPDF(data);
        break;
    }
    
    vibrateClick();
  };

  return (
    <header className="flex items-center justify-between py-6 relative">
      {/* Logo Section with Liquid Glass */}
      <div className="flex items-center gap-4">
        <div className="relative liquid-glass-button liquid-ripple p-3">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center relative z-10">
            <span className="text-2xl font-bold text-accent-ink">B</span>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-gradient flex items-center gap-2">
            BORA
            {isPremium && (
              <CheckCircle className="w-6 h-6 text-purple-400" fill="currentColor" />
            )}
          </h1>
          <p className="text-sm text-txt-3">Treinos Inteligentes</p>
        </div>
      </div>

      {/* Action Buttons with Enhanced Liquid Glass */}
      <div className="flex items-center gap-3">
        <div className="liquid-glass-menu p-2 flex items-center gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="liquid-glass-button p-3 hover:bg-white/10 transition-all group relative"
            title="Exportar Relatório"
          >
            <Download className="w-5 h-5 text-txt-2 group-hover:text-accent transition-colors" />
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Exportar
            </div>
          </button>
          
          <button
            onClick={() => navigator.share?.({ 
              title: 'BORA - Treinos Inteligentes',
              text: 'Confira meu progresso no BORA!',
              url: window.location.href
            })}
            className="liquid-glass-button p-3 hover:bg-white/10 transition-all group relative"
            title="Compartilhar"
          >
            <Share2 className="w-5 h-5 text-txt-2 group-hover:text-accent transition-colors" />
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Compartilhar
            </div>
          </button>

          <button
            onClick={() => {
              setShowConfig(true);
              vibrateClick();
            }}
            className="liquid-glass-button p-3 hover:bg-white/10 transition-all group relative"
            title="Configurações"
          >
            <Settings className="w-5 h-5 text-txt-2 group-hover:text-accent transition-colors" />
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Configurações
            </div>
          </button>
        </div>

        {/* User Avatar with Liquid Glass */}
        <div className="liquid-glass-button p-1">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <User className="w-5 h-5 text-accent-ink" />
          </div>
        </div>
      </div>

      {/* Enhanced Config Modal with Liquid Glass */}
      {showConfig && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="liquid-glass-menu p-8 max-w-md w-full animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-txt">⚙️ Configurações</h3>
              <button
                onClick={() => setShowConfig(false)}
                className="liquid-glass-button p-2 hover:bg-white/10 transition-all"
              >
                <span className="text-lg">✕</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="liquid-glass p-4 space-y-3">
                <h4 className="font-medium text-txt-2">Exportar Dados</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleExport('csv')}
                    className="liquid-glass-button p-3 text-sm hover:bg-accent/10"
                  >
                    📊 CSV
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="liquid-glass-button p-3 text-sm hover:bg-accent/10"
                  >
                    📄 JSON
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="liquid-glass-button p-3 text-sm hover:bg-accent/10"
                  >
                    📑 PDF
                  </button>
                </div>
              </div>
              
              <div className="liquid-glass p-4">
                <h4 className="font-medium text-txt-2 mb-3">Preferências</h4>
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-txt-3">Notificações</span>
                    <div className="liquid-glass-button p-1">
                      <div className="w-10 h-5 bg-accent rounded-full"></div>
                    </div>
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-txt-3">Vibração</span>
                    <div className="liquid-glass-button p-1">
                      <div className="w-10 h-5 bg-surface rounded-full"></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowConfig(false)}
                className="flex-1 liquid-glass-button p-3 text-txt-2 hover:bg-white/10 transition-all"
              >
                Fechar
              </button>
              <button
                onClick={() => setShowConfig(false)}
                className="flex-1 liquid-glass-button p-3 bg-accent/20 text-accent hover:bg-accent/30 transition-all"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}