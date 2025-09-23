/**
 * Serviço de Otimização de Fontes
 * Garante carregamento otimizado e fallbacks adequados
 */

class FontOptimizer {
  private loadedFonts: Set<string> = new Set();
  private fontLoadPromises: Map<string, Promise<void>> = new Map();

  constructor() {
    this.initializeFontLoading();
  }

  private initializeFontLoading() {
    // Verificar se as fontes principais estão carregadas
    this.ensureFontLoaded('Inter');
    this.ensureFontLoaded('JetBrains Mono');
    
    // Preload critical fonts
    this.preloadCriticalFonts();
  }

  private async ensureFontLoaded(fontFamily: string): Promise<void> {
    if (this.loadedFonts.has(fontFamily)) {
      return;
    }

    if (this.fontLoadPromises.has(fontFamily)) {
      return this.fontLoadPromises.get(fontFamily)!;
    }

    const loadPromise = this.loadFont(fontFamily);
    this.fontLoadPromises.set(fontFamily, loadPromise);
    
    try {
      await loadPromise;
      this.loadedFonts.add(fontFamily);
    } catch (error) {
      console.warn(`Fonte ${fontFamily} falhou ao carregar, usando fallback`);
      this.applyFontFallback(fontFamily);
    }

    return loadPromise;
  }

  private async loadFont(fontFamily: string): Promise<void> {
    if ('fonts' in document) {
      try {
        await document.fonts.load(`16px ${fontFamily}`);
        await document.fonts.load(`600px ${fontFamily}`); // Bold variant
      } catch (error) {
        throw new Error(`Falha ao carregar fonte: ${fontFamily}`);
      }
    }
  }

  private preloadCriticalFonts() {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';
    document.head.appendChild(link);
  }

  private applyFontFallback(fontFamily: string) {
    const style = document.createElement('style');
    let fallbackRule = '';

    switch (fontFamily) {
      case 'Inter':
        fallbackRule = `
          .font-sans, body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', sans-serif !important;
          }
        `;
        break;
      case 'JetBrains Mono':
        fallbackRule = `
          .font-mono {
            font-family: 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', monospace !important;
          }
        `;
        break;
    }

    style.textContent = fallbackRule;
    document.head.appendChild(style);
  }

  // Método público para verificar se uma fonte está carregada
  isFontLoaded(fontFamily: string): boolean {
    return this.loadedFonts.has(fontFamily);
  }

  // Método para otimizar performance de texto
  optimizeTextRendering() {
    const style = document.createElement('style');
    style.textContent = `
      * {
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: "liga" 1, "kern" 1;
      }
      
      .text-performance-critical {
        will-change: contents;
        contain: layout style;
      }
    `;
    document.head.appendChild(style);
  }

  // Detectar e corrigir problemas de fonte automaticamente
  runFontDiagnostics(): boolean {
    let hasIssues = false;

    // Verificar se fonts estão sendo renderizadas corretamente
    const testElement = document.createElement('div');
    testElement.style.fontFamily = 'Inter, sans-serif';
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    testElement.textContent = 'Test';
    document.body.appendChild(testElement);

    const computedStyle = window.getComputedStyle(testElement);
    if (!computedStyle.fontFamily.includes('Inter')) {
      console.warn('FontOptimizer: Inter não está sendo aplicada corretamente');
      this.applyFontFallback('Inter');
      hasIssues = true;
    }

    document.body.removeChild(testElement);
    return hasIssues;
  }
}

export const fontOptimizer = new FontOptimizer();
export default FontOptimizer;