import React, { useEffect, useRef } from 'react';

interface ScrollAnimationManagerProps {
  children: React.ReactNode;
}

export const ScrollAnimationManager: React.FC<ScrollAnimationManagerProps> = ({ children }) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Respeitar prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      return;
    }

    // Criar IntersectionObserver para performance otimizada
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          
          if (entry.isIntersecting) {
            // Aplicar animação baseada no atributo data-animate
            const animationType = element.getAttribute('data-animate');
            const delay = element.getAttribute('data-animate-delay') || '0';
            const duration = element.getAttribute('data-animate-duration') || '600';
            
            if (animationType) {
              // Adicionar will-change para otimização
              element.style.willChange = 'transform, opacity';
              
              // Aplicar delay se especificado
              setTimeout(() => {
                element.classList.add('animate-in');
                element.classList.add(`animate-${animationType}`);
                
                // Remover will-change após animação para performance
                setTimeout(() => {
                  element.style.willChange = 'auto';
                }, parseInt(duration));
              }, parseInt(delay));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '20px 0px -10% 0px'
      }
    );

    // Observar todos os elementos com data-animate
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => {
      if (observerRef.current) {
        observerRef.current.observe(el);
        
        // Estado inicial (invisível)
        const element = el as HTMLElement;
        const animationType = element.getAttribute('data-animate');
        
        if (animationType) {
          element.style.opacity = '0';
          
          // Configurar transformações iniciais baseadas no tipo
          switch (animationType) {
            case 'fade':
              element.style.transform = 'translateY(20px)';
              break;
            case 'slide-up':
              element.style.transform = 'translateY(40px)';
              break;
            case 'slide-left':
              element.style.transform = 'translateX(-40px)';
              break;
            case 'slide-right':
              element.style.transform = 'translateX(40px)';
              break;
            case 'zoom':
              element.style.transform = 'scale(0.8)';
              break;
            case 'blur-in':
              element.style.filter = 'blur(10px)';
              break;
          }
        }
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Adicionar estilos CSS dinâmicos
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Animações de entrada performáticas */
      .animate-in {
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .animate-fade {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      
      .animate-slide-up {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      
      .animate-slide-left {
        opacity: 1 !important;
        transform: translateX(0) !important;
      }
      
      .animate-slide-right {
        opacity: 1 !important;
        transform: translateX(0) !important;
      }
      
      .animate-zoom {
        opacity: 1 !important;
        transform: scale(1) !important;
      }
      
      .animate-blur-in {
        opacity: 1 !important;
        filter: blur(0) !important;
      }
      
      /* Microinterações para botões */
      .btn-microinteraction {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateZ(0);
      }
      
      .btn-microinteraction:hover {
        transform: translateY(-2px) scale(1.02);
      }
      
      .btn-microinteraction:active {
        transform: translateY(0) scale(0.98);
      }
      
      /* Header discreto ao rolar */
      .header-scroll {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .header-scrolled {
        backdrop-filter: blur(20px);
        background: rgba(11, 16, 32, 0.95);
        border-bottom: 1px solid rgba(123, 220, 255, 0.1);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return <>{children}</>;
};

export default ScrollAnimationManager;