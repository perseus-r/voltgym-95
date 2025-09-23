import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';

interface ResponsiveMetrics {
  viewportWidth: number;
  viewportHeight: number;
  isTouch: boolean;
  connectionType: string;
  devicePixelRatio: number;
}

export const ResponsiveOptimizer: React.FC = () => {
  const isMobile = useIsMobile();
  const mobileOpts = useMobileOptimizations();
  const [metrics, setMetrics] = useState<ResponsiveMetrics>({
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    isTouch: 'ontouchstart' in window,
    connectionType: (navigator as any).connection?.effectiveType || 'unknown',
    devicePixelRatio: window.devicePixelRatio
  });

  useEffect(() => {
    // Otimizações específicas para diferentes tamanhos de tela
    const applyViewportOptimizations = () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      
      if (isMobile) {
        // Configuração otimizada para mobile
        if (viewport) {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
          );
        }
        
        // Adicionar classes responsive aos elementos existentes
        document.body.classList.add('mobile-optimized', 'touch-device');
        
        // Otimizar touch targets - adicionar classe sem alterar estrutura
        const clickableElements = document.querySelectorAll('button, [role="button"], a, input, select, textarea');
        clickableElements.forEach(el => {
          const element = el as HTMLElement;
          if (!element.dataset.touchOptimized) {
            element.classList.add('touch-target-optimized');
            element.dataset.touchOptimized = 'true';
          }
        });
      }
      
      // Otimizações específicas para telas pequenas (320-428px)
      if (metrics.viewportWidth <= 428) {
        document.body.classList.add('small-mobile');
        
        // Verificar e ajustar elementos que podem estar cortados
        const cards = document.querySelectorAll('[class*="card"], [class*="glass"]');
        cards.forEach(card => {
          const element = card as HTMLElement;
          element.classList.add('mobile-card-optimized');
        });
      }
      
      // Otimizações para tablets
      if (metrics.viewportWidth > 768 && metrics.viewportWidth <= 1024) {
        document.body.classList.add('tablet-optimized');
      }
    };

    // Otimizações de performance baseadas na conexão
    const applyConnectionOptimizations = () => {
      if (metrics.connectionType === 'slow-2g' || metrics.connectionType === '2g') {
        document.body.classList.add('slow-connection');
        
        // Reduzir animações em conexões lentas
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        document.documentElement.style.setProperty('--animation-complexity', 'minimal');
      }
    };

    // Verificação de elementos problemáticos
    const auditResponsiveIssues = () => {
      const issues: string[] = [];
      
      // Verificar overflow horizontal
      if (document.body.scrollWidth > document.body.clientWidth) {
        issues.push('Horizontal overflow detected');
        document.body.classList.add('fix-horizontal-overflow');
      }
      
      // Verificar elementos muito pequenos para touch
      const smallButtons = document.querySelectorAll('button, [role="button"]');
      smallButtons.forEach(btn => {
        const element = btn as HTMLElement;
        const rect = element.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
          element.classList.add('touch-target-small');
          issues.push(`Small touch target: ${element.tagName}`);
        }
      });
      
      // Verificar texto muito pequeno
      const textElements = document.querySelectorAll('p, span, div, a');
      textElements.forEach(text => {
        const element = text as HTMLElement;
        const computedStyle = window.getComputedStyle(element);
        const fontSize = parseFloat(computedStyle.fontSize);
        if (fontSize < 14 && isMobile) {
          element.classList.add('text-too-small');
          issues.push('Text too small for mobile');
        }
      });
      
      if (process.env.NODE_ENV === 'development' && issues.length > 0) {
        console.warn('📱 Responsive issues detected:', issues);
      }
    };

    applyViewportOptimizations();
    applyConnectionOptimizations();
    auditResponsiveIssues();

    // Monitorar mudanças de orientação e redimensionamento
    const handleResize = () => {
      setMetrics(prev => ({
        ...prev,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      }));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 100);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile, metrics.viewportWidth, metrics.connectionType]);

  // Adicionar estilos responsivos dinâmicos
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Touch target optimization */
      .touch-target-optimized {
        min-height: 44px;
        min-width: 44px;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }
      
      .touch-target-small {
        padding: 8px 12px;
        min-height: 44px;
        min-width: 44px;
      }
      
      /* Mobile card optimizations */
      .mobile-card-optimized {
        margin: 0.75rem 0.5rem;
        border-radius: 12px;
      }
      
      /* Text size fixes */
      .text-too-small {
        font-size: 14px !important;
        line-height: 1.4 !important;
      }
      
      /* Horizontal overflow fixes */
      .fix-horizontal-overflow {
        overflow-x: hidden;
      }
      
      .fix-horizontal-overflow * {
        max-width: 100%;
        box-sizing: border-box;
      }
      
      /* Small mobile optimizations (320-428px) */
      .small-mobile .container-custom {
        padding: 0 0.5rem;
      }
      
      .small-mobile .glass-card {
        margin: 0.5rem 0;
        padding: 0.75rem;
      }
      
      .small-mobile .text-2xl {
        font-size: 1.25rem !important;
      }
      
      .small-mobile .text-xl {
        font-size: 1.125rem !important;
      }
      
      /* Slow connection optimizations */
      .slow-connection * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
      }
      
      .slow-connection .gpu-accelerated {
        transform: none;
        will-change: auto;
      }
      
      /* Tablet optimizations */
      .tablet-optimized .container-custom {
        max-width: 768px;
        padding: 0 2rem;
      }
      
      /* Enhanced mobile grid system */
      @media (max-width: 320px) {
        .grid {
          grid-template-columns: 1fr !important;
          gap: 0.5rem !important;
        }
      }
      
      @media (min-width: 321px) and (max-width: 428px) {
        .grid-cols-2 {
          grid-template-columns: 1fr 1fr !important;
          gap: 0.75rem !important;
        }
      }
      
      /* Focus improvements for mobile */
      @media (max-width: 768px) {
        button:focus-visible, 
        [role="button"]:focus-visible,
        input:focus-visible,
        select:focus-visible,
        textarea:focus-visible {
          outline: 3px solid hsl(var(--accent));
          outline-offset: 2px;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null; // Componente invisível de otimização
};

export default ResponsiveOptimizer;