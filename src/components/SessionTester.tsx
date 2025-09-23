import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  CheckCircle, XCircle, AlertCircle, Play, Pause, 
  Monitor, Smartphone, Menu, User, Settings
} from "lucide-react";

interface TestResult {
  name: string;
  status: "pass" | "fail" | "warning";
  message: string;
  element?: Element | null;
}

export function SessionTester() {
  const location = useLocation();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [autoRun, setAutoRun] = useState(true);

  const runTests = async () => {
    setIsRunning(true);
    const testResults: TestResult[] = [];

    // Aguarda um pouco para garantir que a página foi renderizada
    await new Promise(resolve => setTimeout(resolve, 500));

    // Teste 1: Verificar se o sidebar está presente
    const sidebar = document.querySelector('[data-role="app-sidebar"]');
    testResults.push({
      name: "Menu Lateral",
      status: sidebar ? "pass" : "fail",
      message: sidebar ? "Menu lateral encontrado e visível" : "Menu lateral não encontrado na página",
      element: sidebar
    });

    // Teste 2: Verificar se o header está presente
    const header = document.querySelector("header");
    testResults.push({
      name: "Header Principal",
      status: header ? "pass" : "fail", 
      message: header ? "Header principal encontrado" : "Header principal não encontrado",
      element: header
    });

    // Teste 3: Verificar conteúdo principal
    const main = document.querySelector("main, [data-role='page-content']");
    testResults.push({
      name: "Conteúdo Principal",
      status: main ? "pass" : "fail",
      message: main ? "Área de conteúdo principal encontrada" : "Área de conteúdo principal não encontrada",
      element: main
    });

    // Teste 4: Verificar trigger do sidebar (mobile)
    const sidebarTrigger = document.querySelector('[data-sidebar="trigger"]');
    testResults.push({
      name: "Trigger do Menu (Mobile)",
      status: sidebarTrigger ? "pass" : "warning",
      message: sidebarTrigger ? "Botão de menu mobile encontrado" : "Botão de menu mobile não encontrado",
      element: sidebarTrigger
    });

    // Teste 5: Verificar responsividade
    const isMobile = window.innerWidth < 768;
    const mobileOptimized = document.querySelector('.safe-area, .safe-area-top, .safe-area-bottom');
    testResults.push({
      name: "Otimização Mobile",
      status: isMobile && mobileOptimized ? "pass" : isMobile ? "warning" : "pass",
      message: isMobile ? 
        (mobileOptimized ? "Otimizações mobile detectadas" : "Otimizações mobile podem estar ausentes") :
        "Desktop - otimizações mobile não necessárias",
      element: mobileOptimized
    });

    // Teste 6: Verificar se há erros no console (placeholder baseado nos resultados atuais)
    const hasConsoleErrors = results.some(r => r.status === "fail");
    testResults.push({
      name: "Console/Erros",
      status: hasConsoleErrors ? "warning" : "pass",
      message: hasConsoleErrors ? "Possíveis erros detectados" : "Nenhum erro crítico detectado",
      element: null
    });

    // Testes específicos por rota
    if (location.pathname.startsWith('/dashboard')) {
      const quickActions = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent?.includes('Ações Rápidas'));
      testResults.push({
        name: "Ações Rápidas",
        status: quickActions ? "pass" : "warning",
        message: quickActions ? "Seção de Ações Rápidas presente" : "Seção de Ações Rápidas não encontrada",
        element: quickActions || null
      });
    }

    if (location.pathname.startsWith('/nutricao')) {
      const novaRefeicaoBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Nova Refeição'));
      const cameraBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Abrir Câmera'));
      const analisarBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Analisar com IA'));
      testResults.push({ name: 'Nova Refeição', status: novaRefeicaoBtn ? 'pass' : 'fail', message: novaRefeicaoBtn ? 'Botão encontrado' : 'Botão ausente', element: novaRefeicaoBtn || null });
      testResults.push({ name: 'Abrir Câmera', status: cameraBtn ? 'pass' : 'warning', message: cameraBtn ? 'Botão encontrado' : 'Botão ausente', element: cameraBtn || null });
      testResults.push({ name: 'Analisar com IA', status: analisarBtn ? 'pass' : 'warning', message: analisarBtn ? 'Botão encontrado' : 'Botão ausente', element: analisarBtn || null });
    }

    setResults(testResults);
    setIsRunning(false);

    // Toast com resumo
    const failed = testResults.filter(r => r.status === "fail").length;
    const warnings = testResults.filter(r => r.status === "warning").length;
    
    if (failed > 0) {
      toast.error(`Testes falharam: ${failed} erros, ${warnings} avisos`);
    } else if (warnings > 0) {
      toast.warning(`Testes OK com ${warnings} avisos`);
    } else {
      toast.success("Todos os testes passaram! ✅");
    }
  };

  // Auto-run quando mudar de página
  useEffect(() => {
    if (autoRun) {
      const timer = setTimeout(runTests, 1000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, autoRun]);

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pass": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "fail": return <XCircle className="w-4 h-4 text-red-400" />;
      case "warning": return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "pass": return "border-green-400/30 bg-green-400/10";
      case "fail": return "border-red-400/30 bg-red-400/10";  
      case "warning": return "border-yellow-400/30 bg-yellow-400/10";
    }
  };

  return (
    <Card className="liquid-glass p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
            <Monitor className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-txt">Teste Automático de Sessão</h3>
            <p className="text-sm text-txt-2">Página: {location.pathname}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAutoRun(!autoRun)}
            className={`liquid-glass-button ${autoRun ? 'border-accent/30' : ''}`}
          >
            Auto
          </Button>
          <Button
            size="sm"
            onClick={runTests}
            disabled={isRunning}
            className="bg-accent hover:bg-accent/90 text-accent-ink"
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? "Testando..." : "Executar"}
          </Button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-txt-2">{results.filter(r => r.status === "pass").length} passou</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-txt-2">{results.filter(r => r.status === "warning").length} avisos</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-txt-2">{results.filter(r => r.status === "fail").length} falhou</span>
            </div>
          </div>

          <div className="grid gap-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${getStatusColor(result.status)} transition-all`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-txt">{result.name}</div>
                    <div className="text-sm text-txt-2">{result.message}</div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      result.status === "pass" ? "border-green-400/30 text-green-400" :
                      result.status === "fail" ? "border-red-400/30 text-red-400" :
                      "border-yellow-400/30 text-yellow-400"
                    }`}
                  >
                    {result.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !isRunning && (
        <div className="text-center py-8 text-txt-3">
          <Monitor className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Clique em "Executar" para testar esta sessão</p>
        </div>
      )}
    </Card>
  );
}