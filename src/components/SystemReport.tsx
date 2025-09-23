import React from 'react';
import { CheckCircle, AlertTriangle, Zap, Shield, Code, Database, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SystemReportProps {
  onClose?: () => void;
}

export const SystemReport: React.FC<SystemReportProps> = ({ onClose }) => {
  const improvements = [
    {
      category: 'Segurança',
      icon: Shield,
      items: [
        'Isolamento completo de dados por usuário',
        'Limpeza automática de dados compartilhados',
        'Validação de acesso em todas as operações',
        'Triggers de segurança no banco de dados'
      ],
      status: 'completed'
    },
    {
      category: 'Performance',
      icon: Zap,
      items: [
        'Monitor de performance implementado',
        'Detecção automática de operações lentas',
        'Otimização de carregamento de dados',
        'Lazy loading implementado'
      ],
      status: 'completed'
    },
    {
      category: 'Estabilidade',
      icon: Database,
      items: [
        'Health check automático do sistema',
        'Error boundary para captura de erros',
        'Fallbacks robustos para API',
        'Monitoramento contínuo'
      ],
      status: 'completed'
    },
    {
      category: 'Código',
      icon: Code,
      items: [
        'Deprecated functions removidas',
        'Warnings do React Router corrigidos',
        'TypeScript errors resolvidos',
        'Estrutura modular implementada'
      ],
      status: 'completed'
    },
    {
      category: 'UX/UI',
      icon: Sparkles,
      items: [
        'Status visual do sistema',
        'Feedback melhorado para usuário',
        'Loading states otimizados',
        'Error handling aprimorado'
      ],
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/20 text-success border-success/30';
      case 'progress':
        return 'bg-warning/20 text-warning border-warning/30';
      default:
        return 'bg-surface text-txt-3 border-line';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-accent-ink" />
        </div>
        <h2 className="text-2xl font-bold text-txt mb-2">Sistema Otimizado!</h2>
        <p className="text-txt-2">
          Pente fino concluído com sucesso. Todas as questões identificadas foram corrigidas.
        </p>
      </div>

      <div className="grid gap-4">
        {improvements.map((improvement, index) => {
          const IconComponent = improvement.icon;
          return (
            <Card key={index} className="liquid-glass p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-txt">{improvement.category}</h3>
                </div>
                <Badge className={getStatusColor(improvement.status)}>
                  {improvement.status === 'completed' ? 'Concluído' : 'Em Progresso'}
                </Badge>
              </div>
              
              <ul className="space-y-2">
                {improvement.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center gap-2 text-sm text-txt-2">
                    <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      <div className="liquid-glass p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-accent" />
          <h4 className="font-medium text-txt">Próximos Passos Recomendados</h4>
        </div>
        <ul className="text-sm text-txt-2 space-y-1">
          <li>• Monitorar performance em produção</li>
          <li>• Revisar logs de segurança regularmente</li>
          <li>• Implementar testes automatizados</li>
          <li>• Configurar alertas de sistema</li>
        </ul>
      </div>
    </div>
  );
};