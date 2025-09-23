import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  CheckCircle, XCircle, AlertTriangle, ArrowRight, 
  Monitor, Layout, Menu, User, Bot, TrendingUp
} from "lucide-react";

interface PageTest {
  path: string;  
  name: string;
  icon: any;
  tested: boolean;
  status: "pass" | "fail" | "warning" | "pending";
  issues: string[];
}

const TEST_PAGES: PageTest[] = [
  { path: "/dashboard", name: "Dashboard", icon: Layout, tested: false, status: "pending", issues: [] },
  { path: "/treinos", name: "Treinos", icon: User, tested: false, status: "pending", issues: [] },
  { path: "/ia-coach", name: "IA Coach", icon: Bot, tested: false, status: "pending", issues: [] },
  { path: "/progresso", name: "Progresso", icon: TrendingUp, tested: false, status: "pending", issues: [] },
  { path: "/nutricao", name: "Nutrição", icon: User, tested: false, status: "pending", issues: [] },
  { path: "/settings", name: "Configurações", icon: User, tested: false, status: "pending", issues: [] },
];

export function AllPagesTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pages, setPages] = useState<PageTest[]>(TEST_PAGES);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const testPage = async (page: PageTest): Promise<PageTest> => {
    return new Promise((resolve) => {
      // Navegar para a página
      navigate(page.path);
      
      // Aguardar um pouco para carregar
      setTimeout(() => {
        const issues: string[] = [];
        
        // Teste 1: Sidebar presente
        const sidebar = document.querySelector('[data-role="app-sidebar"]');
        if (!sidebar) issues.push("Menu lateral não encontrado");
        
        // Teste 2: Header presente  
        const header = document.querySelector("header");
        if (!header) issues.push("Header não encontrado");
        
        // Teste 3: Conteúdo principal
        const main = document.querySelector("main, [data-role='page-content']");
        if (!main) issues.push("Conteúdo principal não encontrado");
        
        // Teste 4: Trigger do menu (mobile)
        const trigger = document.querySelector('[data-sidebar="trigger"]');
        if (!trigger) issues.push("Botão do menu mobile não encontrado");
        
        const status = issues.length === 0 ? "pass" : 
                      issues.length <= 2 ? "warning" : "fail";
        
        resolve({
          ...page,
          tested: true,
          status,
          issues
        });
      }, 2000);
    });
  };

  const runAllTests = async () => {
    setIsRunning(true);
    const updatedPages: PageTest[] = [];
    
    for (let i = 0; i < pages.length; i++) {
      setCurrentTestIndex(i);
      toast.info(`Testando ${pages[i].name}...`);
      
      const testedPage = await testPage(pages[i]);
      updatedPages.push(testedPage);
      
      // Atualizar estado intermediário
      setPages([...updatedPages, ...pages.slice(i + 1)]);
    }
    
    setIsRunning(false);
    setCurrentTestIndex(-1);
    
    // Resumo final
    const passed = updatedPages.filter(p => p.status === "pass").length;
    const warnings = updatedPages.filter(p => p.status === "warning").length;
    const failed = updatedPages.filter(p => p.status === "fail").length;
    
    toast.success(`Testes concluídos: ${passed} ✅ | ${warnings} ⚠️ | ${failed} ❌`);
  };

  const getStatusIcon = (status: PageTest["status"]) => {
    switch (status) {
      case "pass": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "fail": return <XCircle className="w-4 h-4 text-red-400" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <Monitor className="w-4 h-4 text-txt-3" />;
    }
  };

  const getStatusColor = (status: PageTest["status"]) => {
    switch (status) {
      case "pass": return "border-green-400/30 bg-green-400/10";
      case "fail": return "border-red-400/30 bg-red-400/10";
      case "warning": return "border-yellow-400/30 bg-yellow-400/10";
      default: return "border-txt-3/30 bg-txt-3/5";
    }
  };

  return (
    <Card className="liquid-glass p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
            <Monitor className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-txt">Teste Completo - Todas as Páginas</h3>
            <p className="text-sm text-txt-2">Verificação automática do menu lateral em todas as sessões</p>
          </div>
        </div>
        
        <Button
          onClick={runAllTests}
          disabled={isRunning}
          className="bg-accent hover:bg-accent/90 text-accent-ink"
        >
          {isRunning ? "Testando..." : "Iniciar Teste Completo"}
        </Button>
      </div>

      {/* Progresso dos testes */}
      {isRunning && (
        <div className="mb-6 p-4 rounded-lg bg-accent/10 border border-accent/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
              <span className="text-xs font-bold text-accent-ink">{currentTestIndex + 1}</span>
            </div>
            <span className="font-medium text-txt">
              Testando: {pages[currentTestIndex]?.name}
            </span>
          </div>
          <div className="w-full bg-surface rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentTestIndex + 1) / pages.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Lista de páginas e resultados */}
      <div className="space-y-3">
        {pages.map((page, index) => {
          const IconComponent = page.icon;
          return (
            <div
              key={page.path}
              className={`p-4 rounded-lg border transition-all ${getStatusColor(page.status)} ${
                currentTestIndex === index ? 'ring-2 ring-accent/50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 text-txt-2" />
                  <div>
                    <div className="font-medium text-txt">{page.name}</div>
                    <div className="text-sm text-txt-3">{page.path}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {getStatusIcon(page.status)}
                  
                  {page.tested && page.issues.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {page.issues.length} problemas
                    </Badge>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(page.path)}
                    className="liquid-glass-button"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Lista de problemas encontrados */}
              {page.tested && page.issues.length > 0 && (
                <div className="mt-3 pt-3 border-t border-current/20">
                  <div className="text-sm text-txt-2">Problemas encontrados:</div>
                  <ul className="mt-1 space-y-1">
                    {page.issues.map((issue, idx) => (
                      <li key={idx} className="text-xs text-txt-3 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-current opacity-50" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resumo dos resultados */}
      {pages.some(p => p.tested) && (
        <div className="mt-6 pt-6 border-t border-line/20">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">
                {pages.filter(p => p.status === "pass").length}
              </div>
              <div className="text-xs text-txt-3">Passaram</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {pages.filter(p => p.status === "warning").length}
              </div>
              <div className="text-xs text-txt-3">Avisos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">
                {pages.filter(p => p.status === "fail").length}
              </div>
              <div className="text-xs text-txt-3">Falharam</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-txt">
                {pages.filter(p => !p.tested).length}
              </div>
              <div className="text-xs text-txt-3">Pendentes</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}