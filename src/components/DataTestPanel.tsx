// Data Test Panel - Test all data persistence functionality
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  TestTube, 
  Database, 
  CheckCircle, 
  XCircle, 
  Save,
  History,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { unifiedDataService } from '@/services/UnifiedDataService';
import { useAuth } from '@/contexts/AuthContext';

export function DataTestPanel() {
  const { user } = useAuth();
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>({});

  const runAllTests = async () => {
    if (!user) {
      toast.error('Usuário não logado - faça login primeiro');
      return;
    }

    setTesting(true);
    const results: any = {};
    
    try {
      // Test 1: Database Connection
      console.log('🧪 Testing database connection...');
      const dbConnection = await unifiedDataService.testConnection();
      results.dbConnection = dbConnection;
      
      // Test 2: Save Test Workout
      console.log('🧪 Testing workout save...');
      const testWorkout = {
        user_id: user.id,
        name: 'Teste de Conexão',
        focus: 'Teste Sistema',
        duration_minutes: 30,
        exercises: [
          {
            name: 'Teste Push-up',
            sets: 3,
            reps: 10,
            weight: 0,
            rpe: 8,
            notes: 'Teste de salvamento'
          },
          {
            name: 'Teste Squat',
            sets: 3,
            reps: 15,
            weight: 50,
            rpe: 7,
            notes: 'Segundo exercício teste'
          }
        ]
      };
      
      const saveResult = await unifiedDataService.saveWorkout(testWorkout);
      results.saveWorkout = saveResult;
      
      // Test 3: Load Workout History  
      console.log('🧪 Testing history load...');
      const history = await unifiedDataService.getWorkoutHistory(5);
      results.loadHistory = history.length > 0;
      results.historyCount = history.length;
      
      // Test 4: Get User Stats
      console.log('🧪 Testing user stats...');
      const stats = await unifiedDataService.getUserStats();
      results.getUserStats = stats.totalWorkouts >= 0; // Should always be >= 0
      results.stats = stats;
      
      // Test 5: localStorage functionality
      console.log('🧪 Testing localStorage...');
      const testData = { test: 'data', timestamp: Date.now() };
      localStorage.setItem('bora_test', JSON.stringify(testData));
      const retrieved = localStorage.getItem('bora_test');
      results.localStorage = retrieved !== null;
      if (retrieved) {
        localStorage.removeItem('bora_test');
      }
      
      console.log('✅ All tests completed:', results);
      
    } catch (error) {
      console.error('❌ Test error:', error);
      results.error = error.message;
    } finally {
      setTestResults(results);
      setTesting(false);
    }
  };

  const clearTestData = () => {
    // Clear localStorage test data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('bora_v2_') || key.includes('test')) {
        localStorage.removeItem(key);
      }
    });
    
    setTestResults({});
    toast.success('Dados de teste limpos');
  };

  const TestResult = ({ label, status, details }: { 
    label: string; 
    status: boolean | undefined; 
    details?: any 
  }) => (
    <div className="flex items-center justify-between p-2 border border-border/50 rounded">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {details && (
          <span className="text-xs text-muted-foreground">
            {typeof details === 'object' ? JSON.stringify(details) : details}
          </span>
        )}
        {status === true ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : status === false ? (
          <XCircle className="w-4 h-4 text-red-500" />
        ) : (
          <div className="w-4 h-4 bg-muted rounded-full" />
        )}
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Painel de Testes - Persistência de Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Controls */}
        <div className="flex gap-2">
          <Button 
            onClick={runAllTests}
            disabled={testing || !user}
            className="flex-1"
          >
            {testing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <TestTube className="w-4 h-4 mr-2" />
            )}
            {testing ? 'Testando...' : 'Executar Todos os Testes'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={clearTestData}
            disabled={testing}
          >
            Limpar Dados
          </Button>
        </div>

        {!user && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-amber-600">
              ⚠️ Faça login para executar os testes de persistência
            </p>
          </div>
        )}

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Resultados dos Testes:</h4>
            
            <TestResult 
              label="Conexão com Banco" 
              status={testResults.dbConnection}
              details={testResults.dbConnection ? 'OK' : 'FALHA'}
            />
            
            <TestResult 
              label="Salvar Treino" 
              status={testResults.saveWorkout}
              details={testResults.saveWorkout ? 'Salvo' : 'Erro'}
            />
            
            <TestResult 
              label="Carregar Histórico" 
              status={testResults.loadHistory}
              details={`${testResults.historyCount || 0} treinos`}
            />
            
            <TestResult 
              label="Estatísticas do Usuário" 
              status={testResults.getUserStats}
              details={testResults.stats ? 
                `${testResults.stats.totalWorkouts} treinos, ${testResults.stats.currentXP} XP` : 
                'N/A'
              }
            />
            
            <TestResult 
              label="LocalStorage" 
              status={testResults.localStorage}
              details={testResults.localStorage ? 'Funcionando' : 'Falha'}
            />

            {testResults.error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-600">
                  ❌ Erro: {testResults.error}
                </p>
              </div>
            )}
          </div>
        )}

        {/* System Status */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span>Status do Sistema:</span>
            <Badge variant={user ? 'default' : 'secondary'}>
              {user ? '🟢 Online' : '🔴 Offline'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}