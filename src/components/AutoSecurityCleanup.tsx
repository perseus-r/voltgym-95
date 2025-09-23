import React, { useEffect } from 'react';
import { clearSharedData } from '@/lib/storage';
import { autoSecurityService } from '@/services/AutoSecurityService';
import { fontOptimizer } from '@/services/FontOptimizer';
import { colorValidator } from '@/services/ColorValidator';

const AutoSecurityCleanup: React.FC = () => {
  useEffect(() => {
    // Executar limpeza de segurança e otimizações automáticas na inicialização
    const initializeSystemOptimizations = async () => {
      try {
        // Limpeza de dados sensíveis
        clearSharedData();
        
        // Verificações automáticas de segurança
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Otimizar fontes
        fontOptimizer.runFontDiagnostics();
        
        // Validar cores e contraste
        const colorIssues = colorValidator.validateSystemColors();
        if (colorIssues.some(issue => issue.severity === 'high')) {
          colorValidator.autoFixColorIssues();
        }
        
        // Personalização automática baseada no usuário (se disponível)
        const userData = localStorage.getItem('user-profile');
        if (userData) {
          try {
            const profile = JSON.parse(userData);
            await autoSecurityService.personalizeForUser(profile);
          } catch (e) {
            // Silencioso se não conseguir parsear
          }
        }
        
      } catch (error) {
        console.warn('AutoSecurityCleanup: Erro nas otimizações automáticas:', error);
      }
    };

    initializeSystemOptimizations();
  }, []);

  return null; // Componente invisível
};

export default AutoSecurityCleanup;