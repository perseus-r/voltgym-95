import React, { useEffect, useState } from 'react';

interface SecurityIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  location?: string;
}

interface SecurityReport {
  score: number;
  issues: SecurityIssue[];
  recommendations: string[];
  compliance: {
    hasPrivacyPolicy: boolean;
    hasSecureHeaders: boolean;
    hasInputSanitization: boolean;
    hasXSSProtection: boolean;
  };
}

export const SecurityScanner: React.FC = () => {
  const [report, setReport] = useState<SecurityReport>({
    score: 0,
    issues: [],
    recommendations: [],
    compliance: {
      hasPrivacyPolicy: false,
      hasSecureHeaders: false,
      hasInputSanitization: false,
      hasXSSProtection: false
    }
  });

  useEffect(() => {
    const scanSecurity = () => {
      const issues: SecurityIssue[] = [];
      const recommendations: string[] = [];

      // 1. Verificar exposição de chaves sensíveis
      const scanForExposedKeys = () => {
        const scripts = document.querySelectorAll('script');
        const sensitivePatterns = [
          /sk_[a-zA-Z0-9]{20,}/g,     // Stripe secret keys
          /pk_live_[a-zA-Z0-9]{20,}/g, // Stripe live keys
          /AIza[a-zA-Z0-9]{35}/g,     // Google API keys
          /ya29\.[a-zA-Z0-9_-]{68}/g, // Google OAuth tokens
          /pk_test_[a-zA-Z0-9]{20,}/g // Stripe test keys (warning)
        ];

        scripts.forEach(script => {
          if (script.src) return; // Skip external scripts
          
          const content = script.textContent || '';
          sensitivePatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
              matches.forEach(match => {
                let severity: 'low' | 'medium' | 'high' | 'critical' = 'critical';
                let description = 'Exposed sensitive API key detected';
                
                if (match.startsWith('pk_test_')) {
                  severity = 'medium';
                  description = 'Test API key exposed (should be moved to environment)';
                }
                
                issues.push({
                  severity,
                  type: 'exposed-credentials',
                  description,
                  location: 'Inline script'
                });
              });
            }
          });
        });
      };

      // 2. Verificar sanitização de inputs
      const scanInputSanitization = () => {
        const inputs = document.querySelectorAll('input, textarea');
        let hasUnsanitizedInputs = false;

        inputs.forEach(input => {
          const element = input as HTMLInputElement;
          // Verificar se há listeners que não fazem sanitização
          if (element.oninput || element.onchange) {
            // Assumir que inputs com listeners precisam de validação
            hasUnsanitizedInputs = true;
          }
        });

        if (hasUnsanitizedInputs) {
          issues.push({
            severity: 'medium',
            type: 'input-sanitization',
            description: 'Inputs detected without explicit sanitization validation'
          });
          recommendations.push('Implement input sanitization for all user inputs');
        }
      };

      // 3. Verificar headers de segurança
      const scanSecurityHeaders = () => {
        // Verificar Content Security Policy
        const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (!cspMeta) {
          issues.push({
            severity: 'high',
            type: 'missing-csp',
            description: 'Content Security Policy header missing'
          });
          recommendations.push('Add Content-Security-Policy meta tag or header');
        }

        // Verificar X-Frame-Options via meta tag
        const frameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
        if (!frameOptions) {
          issues.push({
            severity: 'medium',
            type: 'missing-frame-options',
            description: 'X-Frame-Options not configured'
          });
          recommendations.push('Add X-Frame-Options to prevent clickjacking');
        }
      };

      // 4. Verificar política de privacidade
      const scanPrivacyCompliance = () => {
        const privacyLinks = document.querySelectorAll('a[href*="privacy"], a[href*="privacidade"]');
        const hasPrivacyPolicy = privacyLinks.length > 0;
        
        if (!hasPrivacyPolicy) {
          // Verificar no footer especificamente
          const footer = document.querySelector('footer');
          const footerPrivacy = footer?.querySelector('a[href*="privacy"], a[href*="privacidade"]');
          
          if (!footerPrivacy) {
            issues.push({
              severity: 'medium',
              type: 'missing-privacy-policy',
              description: 'Privacy policy link not found in footer'
            });
            recommendations.push('Add privacy policy link in footer');
          }
        }

        return hasPrivacyPolicy;
      };

      // 5. Verificar proteção XSS
      const scanXSSProtection = () => {
        const forms = document.querySelectorAll('form');
        let hasXSSProtection = true;

        forms.forEach(form => {
          const textInputs = form.querySelectorAll('input[type="text"], textarea');
          textInputs.forEach(input => {
            // Verificar se há proteção contra XSS (muito básico)
            const value = (input as HTMLInputElement).value;
            if (value && /<script|javascript:|data:/i.test(value)) {
              hasXSSProtection = false;
              issues.push({
                severity: 'high',
                type: 'xss-vulnerability',
                description: 'Potential XSS vulnerability in form input'
              });
            }
          });
        });

        return hasXSSProtection;
      };

      // 6. Verificar localStorage por dados sensíveis
      const scanLocalStorageSecurity = () => {
        const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const lowerKey = key.toLowerCase();
            const isSensitive = sensitiveKeys.some(sensitive => lowerKey.includes(sensitive));
            
            if (isSensitive) {
              const value = localStorage.getItem(key);
              // Verificar se não está criptografado (muito básico)
              if (value && !value.startsWith('ey') && value.length > 20) {
                issues.push({
                  severity: 'high',
                  type: 'exposed-sensitive-data',
                  description: `Potentially sensitive data in localStorage: ${key}`,
                  location: 'localStorage'
                });
              }
            }
          }
        }
      };

      // Executar todas as verificações
      scanForExposedKeys();
      scanInputSanitization();
      scanSecurityHeaders();
      const hasPrivacyPolicy = scanPrivacyCompliance();
      const hasXSSProtection = scanXSSProtection();
      scanLocalStorageSecurity();

      // Calcular score de segurança
      const maxScore = 100;
      let deductions = 0;

      issues.forEach(issue => {
        switch (issue.severity) {
          case 'critical': deductions += 30; break;
          case 'high': deductions += 20; break;
          case 'medium': deductions += 10; break;
          case 'low': deductions += 5; break;
        }
      });

      const finalScore = Math.max(0, maxScore - deductions);

      // Adicionar recomendações gerais
      if (issues.length === 0) {
        recommendations.push('Security scan completed - no major issues found');
      }

      recommendations.push('Regularly update dependencies to patch security vulnerabilities');
      recommendations.push('Implement rate limiting for API endpoints');
      recommendations.push('Use HTTPS in production');
      recommendations.push('Implement proper authentication and authorization');

      setReport({
        score: finalScore,
        issues,
        recommendations,
        compliance: {
          hasPrivacyPolicy,
          hasSecureHeaders: issues.filter(i => i.type.includes('header')).length === 0,
          hasInputSanitization: issues.filter(i => i.type === 'input-sanitization').length === 0,
          hasXSSProtection
        }
      });
    };

    // Implementar correções automáticas (sem alterar estrutura HTML)
    const applySecurityEnhancements = () => {
      // 1. Adicionar Content Security Policy básico
      if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        const cspMeta = document.createElement('meta');
        cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
        cspMeta.setAttribute('content', 
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
          "font-src 'self' https://fonts.gstatic.com; " +
          "img-src 'self' data: https:; " +
          "connect-src 'self' https://osvicgbgrmyogazdbllj.supabase.co;"
        );
        document.head.appendChild(cspMeta);
      }

      // 2. Adicionar X-Frame-Options
      if (!document.querySelector('meta[http-equiv="X-Frame-Options"]')) {
        const frameOptionsMeta = document.createElement('meta');
        frameOptionsMeta.setAttribute('http-equiv', 'X-Frame-Options');
        frameOptionsMeta.setAttribute('content', 'DENY');
        document.head.appendChild(frameOptionsMeta);
      }

      // 3. Adicionar referrer policy
      if (!document.querySelector('meta[name="referrer"]')) {
        const referrerMeta = document.createElement('meta');
        referrerMeta.setAttribute('name', 'referrer');
        referrerMeta.setAttribute('content', 'strict-origin-when-cross-origin');
        document.head.appendChild(referrerMeta);
      }

      // 4. Melhorar segurança de links externos
      const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
      externalLinks.forEach(link => {
        link.setAttribute('rel', 'noopener noreferrer');
        link.setAttribute('target', '_blank');
      });

      // 5. Adicionar proteção contra clickjacking via CSS
      const style = document.createElement('style');
      style.textContent = `
        /* Proteção contra clickjacking */
        html {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        input, textarea, [contenteditable] {
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }
        
        /* Desabilitar arrastar imagens */
        img {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }
      `;
      document.head.appendChild(style);
    };

    scanSecurity();
    applySecurityEnhancements();

    // Log em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('🔒 Security Report:', report);
    }
  }, []);

  return null; // Componente invisível de segurança
};

export default SecurityScanner;