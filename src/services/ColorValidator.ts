/**
 * Validador de Cores e Contraste
 * Garante acessibilidade e consistência visual
 */

interface ColorIssue {
  element: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

class ColorValidator {
  private issues: ColorIssue[] = [];

  // Verificar contraste de cores
  checkContrast(background: string, foreground: string): number {
    const bgLuminance = this.getLuminance(background);
    const fgLuminance = this.getLuminance(foreground);
    
    const lighter = Math.max(bgLuminance, fgLuminance);
    const darker = Math.min(bgLuminance, fgLuminance);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  private getLuminance(color: string): number {
    const rgb = this.hexToRgb(color);
    if (!rgb) return 0;
    
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private hexToRgb(hex: string): {r: number, g: number, b: number} | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Validar cores do sistema
  validateSystemColors(): ColorIssue[] {
    this.issues = [];
    
    // Verificar variáveis CSS principais
    const rootStyles = getComputedStyle(document.documentElement);
    
    // Verificar contraste de texto principal
    const bgColor = rootStyles.getPropertyValue('--bg').trim();
    const textColor = rootStyles.getPropertyValue('--txt').trim();
    
    if (bgColor && textColor) {
      const contrast = this.checkContrast(
        this.hslToHex(bgColor), 
        this.hslToHex(textColor)
      );
      
      if (contrast < 4.5) {
        this.issues.push({
          element: 'Texto principal',
          issue: `Contraste baixo: ${contrast.toFixed(2)}:1`,
          severity: contrast < 3 ? 'high' : 'medium',
          suggestion: 'Aumentar contraste entre texto e fundo'
        });
      }
    }

    // Verificar cores de acento
    this.validateAccentColors(rootStyles);
    
    // Verificar cores de status
    this.validateStatusColors(rootStyles);

    return this.issues;
  }

  private validateAccentColors(styles: CSSStyleDeclaration) {
    const accentColor = styles.getPropertyValue('--accent').trim();
    const bgColor = styles.getPropertyValue('--bg').trim();
    
    if (accentColor && bgColor) {
      const contrast = this.checkContrast(
        this.hslToHex(bgColor),
        this.hslToHex(accentColor)
      );
      
      if (contrast < 3) {
        this.issues.push({
          element: 'Cor de acento',
          issue: `Contraste insuficiente com fundo: ${contrast.toFixed(2)}:1`,
          severity: 'medium',
          suggestion: 'Tornar cor de acento mais vibrante ou escura'
        });
      }
    }
  }

  private validateStatusColors(styles: CSSStyleDeclaration) {
    const statusColors = ['--success', '--warning', '--error'];
    const bgColor = styles.getPropertyValue('--bg').trim();
    
    statusColors.forEach(colorVar => {
      const color = styles.getPropertyValue(colorVar).trim();
      if (color && bgColor) {
        const contrast = this.checkContrast(
          this.hslToHex(bgColor),
          this.hslToHex(color)
        );
        
        if (contrast < 3) {
          this.issues.push({
            element: `Cor de status (${colorVar})`,
            issue: `Baixa visibilidade: ${contrast.toFixed(2)}:1`,
            severity: 'medium',
            suggestion: 'Ajustar saturação e luminosidade'
          });
        }
      }
    });
  }

  private hslToHex(hsl: string): string {
    // Converter HSL para hex para cálculos de contraste
    const match = hsl.match(/(\d+\.?\d*)\s+(\d+\.?\d*)%\s+(\d+\.?\d*)%/);
    if (!match) return '#000000';
    
    const h = parseInt(match[1]) / 360;
    const s = parseInt(match[2]) / 100;
    const l = parseInt(match[3]) / 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    
    let r, g, b;
    
    if (0 <= h && h < 1/6) {
      r = c; g = x; b = 0;
    } else if (1/6 <= h && h < 2/6) {
      r = x; g = c; b = 0;
    } else if (2/6 <= h && h < 3/6) {
      r = 0; g = c; b = x;
    } else if (3/6 <= h && h < 4/6) {
      r = 0; g = x; b = c;
    } else if (4/6 <= h && h < 5/6) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  // Auto-corrigir problemas de cor
  autoFixColorIssues(): boolean {
    const issues = this.validateSystemColors();
    let hasFixed = false;

    issues.forEach(issue => {
      if (issue.severity === 'high') {
        // Aplicar correções automáticas para problemas críticos
        this.applyColorFix(issue);
        hasFixed = true;
      }
    });

    return hasFixed;
  }

  private applyColorFix(issue: ColorIssue) {
    // Aplicar correções CSS dinâmicas
    const style = document.createElement('style');
    style.id = 'color-validator-fixes';
    
    let fixCSS = '';
    
    if (issue.element === 'Texto principal') {
      fixCSS = `
        :root {
          --txt: 225 100% 95% !important;
          --txt-2: 225 100% 85% !important;
        }
      `;
    }
    
    if (fixCSS) {
      style.textContent = fixCSS;
      document.head.appendChild(style);
      console.log(`ColorValidator: Aplicada correção para ${issue.element}`);
    }
  }

  getIssues(): ColorIssue[] {
    return this.issues;
  }
}

export const colorValidator = new ColorValidator();
export default ColorValidator;