import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Wifi, 
  Database, 
  Smartphone, 
  Server,
  Shield,
  Zap,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { performanceMonitor } from "@/services/PerformanceMonitor";
import { systemHealthCheck } from "@/services/SystemHealthCheck";

interface SystemTest {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'passed' | 'failed' | 'pending';
  details?: string;
  icon: React.ReactNode;
}

interface SystemTesterProps {
  isAdmin?: boolean;
}

export function SystemTester({ isAdmin = false }: SystemTesterProps) {
  const [tests, setTests] = useState<SystemTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  // Verificar se é administrador
  if (!isAdmin) {
    return (
      <div className="liquid-glass p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <Shield className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-txt mb-2">Acesso Restrito</h2>
        <p className="text-txt-2">Esta funcionalidade está disponível apenas para administradores.</p>
        
        {/* User Actions Overview */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-txt">📱 Ações Disponíveis para Usuários</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="liquid-glass p-4">
              <h4 className="font-semibold text-accent mb-2">🏋️ Treinos</h4>
              <ul className="text-sm text-txt-2 space-y-1">
                <li>• Iniciar treino do dia</li>
                <li>• Registrar cargas e RPE</li>
                <li>• Completar exercícios</li>
                <li>• Ver histórico pessoal</li>
              </ul>
            </div>
            <div className="liquid-glass p-4">
              <h4 className="font-semibold text-accent mb-2">📊 Progresso</h4>
              <ul className="text-sm text-txt-2 space-y-1">
                <li>• Visualizar estatísticas</li>
                <li>• Acompanhar streak</li>
                <li>• Ver recordes pessoais</li>
                <li>• Análise de consistency</li>
              </ul>
            </div>
            <div className="liquid-glass p-4">
              <h4 className="font-semibold text-accent mb-2">👤 Perfil</h4>
              <ul className="text-sm text-txt-2 space-y-1">
                <li>• Editar informações pessoais</li>
                <li>• Configurar metas</li>
                <li>• Gerenciar XP e level</li>
                <li>• Configurações do app</li>
              </ul>
            </div>
            <div className="liquid-glass p-4">
              <h4 className="font-semibold text-accent mb-2">🛒 Shop</h4>
              <ul className="text-sm text-txt-2 space-y-1">
                <li>• Comprar com XP</li>
                <li>• Produtos físicos (bloqueado)</li>
                <li>• Itens digitais premium</li>
                <li>• Acompanhar pedidos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const initialTests: SystemTest[] = [
    {
      id: 'auth',
      name: 'Autenticação',
      description: 'Verificar sistema de login e sessões',
      status: 'pending',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 'database',
      name: 'Banco de Dados',
      description: 'Conexão e queries do Supabase',
      status: 'pending',
      icon: <Database className="w-5 h-5" />
    },
    {
      id: 'storage',
      name: 'Armazenamento Local',
      description: 'LocalStorage e persistência de dados',
      status: 'pending',
      icon: <Smartphone className="w-5 h-5" />
    },
    {
      id: 'api',
      name: 'API Externa',
      description: 'Endpoints de treinos e dados',
      status: 'pending',
      icon: <Server className="w-5 h-5" />
    },
    {
      id: 'performance',
      name: 'Performance',
      description: 'Tempos de carregamento e responsividade',
      status: 'pending',
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'connectivity',
      name: 'Conectividade',
      description: 'Rede e disponibilidade de serviços',
      status: 'pending',
      icon: <Wifi className="w-5 h-5" />
    }
  ];

  useEffect(() => {
    setTests(initialTests);
  }, []);

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    const updatedTests = [...initialTests];
    
    for (let i = 0; i < updatedTests.length; i++) {
      const test = updatedTests[i];
      test.status = 'running';
      setTests([...updatedTests]);
      
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        const result = await executeTest(test.id);
        test.status = result.passed ? 'passed' : 'failed';
        test.details = result.details;
      } catch (error) {
        test.status = 'failed';
        test.details = error instanceof Error ? error.message : 'Erro desconhecido';
      }
      
      setProgress(((i + 1) / updatedTests.length) * 100);
      setTests([...updatedTests]);
    }
    
    setIsRunning(false);
    
    const passed = updatedTests.filter(t => t.status === 'passed').length;
    const total = updatedTests.length;
    
    if (passed === total) {
      toast.success(`🎉 Todos os ${total} testes passaram! Sistema pronto para produção.`);
    } else {
      toast.warning(`⚠️ ${passed}/${total} testes passaram. Verifique os problemas identificados.`);
    }
  };

  const executeTest = async (testId: string): Promise<{ passed: boolean; details: string }> => {
    switch (testId) {
      case 'auth':
        try {
          const userId = localStorage.getItem('currentUserId');
          if (!userId) {
            return { passed: false, details: 'Usuário não autenticado' };
          }
          return { passed: true, details: `Usuário autenticado: ${userId.slice(0, 8)}...` };
        } catch (error) {
          return { passed: false, details: 'Erro na verificação de autenticação' };
        }

      case 'database':
        try {
          const response = await fetch('https://osvicgbgrmyogazdbllj.supabase.co/rest/v1/', {
            headers: {
              'Content-Type': 'application/json',
            }
          });
          return { 
            passed: response.ok, 
            details: response.ok ? 'Conexão estabelecida' : `HTTP ${response.status}` 
          };
        } catch (error) {
          return { passed: false, details: 'Falha na conexão com o banco' };
        }

      case 'storage':
        try {
          const testKey = 'system_test';
          const testValue = 'test_data';
          localStorage.setItem(testKey, testValue);
          const retrieved = localStorage.getItem(testKey);
          localStorage.removeItem(testKey);
          
          return {
            passed: retrieved === testValue,
            details: retrieved === testValue ? 'LocalStorage funcionando' : 'Falha no LocalStorage'
          };
        } catch (error) {
          return { passed: false, details: 'LocalStorage não disponível' };
        }

      case 'api':
        try {
          const response = await fetch('https://osvicgbgrmyogazdbllj.supabase.co/functions/v1/workouts-api-proxy/health');
          return {
            passed: response.ok,
            details: response.ok ? 'API respondendo' : 'API indisponível'
          };
        } catch (error) {
          return { passed: false, details: 'Falha na conexão com API' };
        }

      case 'performance':
        try {
          const metrics = performanceMonitor.getMetrics();
          const avgTime = metrics.length > 0 ? 
            metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length : 0;
          
          return {
            passed: avgTime < 500,
            details: `Tempo médio: ${avgTime.toFixed(2)}ms`
          };
        } catch (error) {
          return { passed: false, details: 'Erro na análise de performance' };
        }

      case 'connectivity':
        try {
          const healthResult = await systemHealthCheck.runHealthCheck();
          const healthyChecks = Object.values(healthResult.checks).filter(Boolean).length;
          const totalChecks = Object.keys(healthResult.checks).length;
          
          return {
            passed: healthResult.status === 'healthy',
            details: `${healthyChecks}/${totalChecks} serviços ativos`
          };
        } catch (error) {
          return { passed: false, details: 'Falha na verificação de conectividade' };
        }

      default:
        return { passed: false, details: 'Teste não implementado' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Passou</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Falhou</Badge>;
      case 'running':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Executando</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Pendente</Badge>;
    }
  };

  const passedTests = tests.filter(t => t.status === 'passed').length;
  const totalTests = tests.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="liquid-glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-txt flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
                Teste do Sistema
              </CardTitle>
              <p className="text-txt-2 mt-2">
                Verificação completa de funcionalidades para garantir qualidade
              </p>
            </div>
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              className="bg-accent hover:bg-accent/90 text-accent-ink"
              size="lg"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Executar Testes
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {isRunning && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-txt-2">Progresso dos testes</span>
                <span className="text-sm text-accent font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">{passedTests}</div>
              <div className="text-sm text-txt-2">Testes Aprovados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-txt mb-1">{totalTests}</div>
              <div className="text-sm text-txt-2">Total de Testes</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-1 ${successRate === 100 ? 'text-green-400' : successRate >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                {Math.round(successRate)}%
              </div>
              <div className="text-sm text-txt-2">Taxa de Sucesso</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="grid gap-4">
        {tests.map((test) => (
          <Card key={test.id} className="liquid-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-surface/50">
                    {test.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-txt text-lg">{test.name}</h3>
                    <p className="text-txt-2 text-sm">{test.description}</p>
                    {test.details && (
                      <p className="text-txt-3 text-xs mt-1">{test.details}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  {getStatusBadge(test.status)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Actions Overview */}
      {!isRunning && tests.some(t => t.status !== 'pending') && isAdmin && (
        <Card className="liquid-glass border-2 border-accent/30">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-txt mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-accent" />
              🛠️ Ações de Administrador
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-accent mb-3">👥 Gestão de Usuários</h4>
                <ul className="text-sm text-txt-2 space-y-2">
                  <li>• Ver todos os perfis de usuários</li>
                  <li>• Modificar levels e XP</li>
                  <li>• Banir/desbanir usuários</li>
                  <li>• Reset de senhas</li>
                  <li>• Logs de atividade</li>
                  <li>• Estatísticas globais</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-accent mb-3">🏋️ Gestão de Treinos</h4>
                <ul className="text-sm text-txt-2 space-y-2">
                  <li>• Criar templates públicos</li>
                  <li>• Moderar exercícios</li>
                  <li>• Analytics de uso</li>
                  <li>• Configurar dificuldades</li>
                  <li>• Aprovar/rejeitar exercícios</li>
                  <li>• Backup de dados</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-accent mb-3">🛒 Gestão de Shop</h4>
                <ul className="text-sm text-txt-2 space-y-2">
                  <li>• Adicionar/remover produtos</li>
                  <li>• Configurar preços XP/BRL</li>
                  <li>• Gerenciar estoque</li>
                  <li>• Relatórios de vendas</li>
                  <li>• Configurar promoções</li>
                  <li>• Gateway de pagamento</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Status Summary */}
      {!isRunning && tests.some(t => t.status !== 'pending') && (
        <Card className={`liquid-glass border-2 ${successRate === 100 ? 'border-green-500/30' : successRate >= 80 ? 'border-yellow-500/30' : 'border-red-500/30'}`}>
          <CardContent className="p-6">
            <div className="text-center">
              <div className={`text-6xl mb-4 ${successRate === 100 ? 'text-green-400' : successRate >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                {successRate === 100 ? '✅' : successRate >= 80 ? '⚠️' : '❌'}
              </div>
              <h3 className="text-2xl font-bold text-txt mb-2">
                {successRate === 100 ? 'Sistema Aprovado!' : 
                 successRate >= 80 ? 'Sistema Funcional' : 
                 'Sistema com Problemas'}
              </h3>
              <p className="text-txt-2">
                {successRate === 100 ? 'Todos os testes passaram. O sistema está pronto para uso em produção.' :
                 successRate >= 80 ? 'A maioria dos testes passou. Há pequenos problemas que devem ser corrigidos.' :
                 'Vários testes falharam. O sistema requer correções antes do uso.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}