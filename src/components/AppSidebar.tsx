import { useState } from "react";
import { BarChart3, Dumbbell, User, TrendingUp, Zap, Users, ShoppingBag, Home, Settings, LogOut, Bot } from "lucide-react";
import { WorkoutSpreadsheet } from "./WorkoutSpreadsheet";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useMobileExperience } from '@/hooks/useMobileExperience';
import { useLocation, useNavigate } from 'react-router-dom';

const sidebarItems = [
  { 
    title: "Dashboard", 
    icon: Home, 
    id: "dashboard",
    path: "/dashboard",
    description: "Visão geral dos treinos" 
  },
  { 
    title: "Treinos", 
    icon: Dumbbell, 
    id: "treinos",
    path: "/treinos",
    description: "Seus treinos diários" 
  },
  { 
    title: "Nutrição", 
    icon: Bot, 
    id: "nutricao",
    path: "/nutricao",
    description: "Dashboard nutricional premium" 
  },
  { 
    title: "IA Coach", 
    icon: Bot, 
    id: "ia-coach",
    path: "/ia-coach",
    description: "Assistente inteligente" 
  },
  { 
    title: "Progresso", 
    icon: TrendingUp, 
    id: "progresso",
    path: "/progresso",
    description: "Acompanhe sua evolução" 
  },
  { 
    title: "Premium", 
    icon: Zap, 
    id: "premium-features",
    path: "/premium",
    description: "Funcionalidades exclusivas" 
  },
  { 
    title: "Exercícios", 
    icon: Dumbbell, 
    id: "exercises",
    path: "/exercicios",
    description: "Biblioteca de exercícios" 
  },
  { 
    title: "Comunidade", 
    icon: Users, 
    id: "community",
    path: "/comunidade",
    description: "Rede social fitness" 
  },
  { 
    title: "Loja", 
    icon: ShoppingBag, 
    id: "shop",
    path: "/loja",
    description: "Produtos e suplementos" 
  },
];

const adminItems = [
  { 
    title: "Painel Admin", 
    icon: Settings, 
    id: "admin-panel",
    description: "Gerenciar sistema" 
  }
];

const bottomItems = [
  { 
    title: "Configurações", 
    icon: Settings, 
    id: "settings",
    description: "Preferências do sistema" 
  },
  { 
    title: "Sair", 
    icon: LogOut, 
    id: "logout",
    description: "Fazer logout" 
  },
];

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isAdmin?: boolean;
}

export function AppSidebar({ activeView, onViewChange, isAdmin = false }: AppSidebarProps) {
  const { state, setOpen, setOpenMobile } = useSidebar();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, isTouch, orientation } = useMobileExperience();
  const collapsed = state === "collapsed";

  // Fecha o menu no mobile após navegação
  const closeSidebarAfterAction = () => {
    if (isMobile) {
      try { setOpenMobile(false); } catch {}
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "icon"}
      side="left"
      className="border-r border-line/20"
      data-role="app-sidebar"
    >
      <SidebarContent className="bg-surface/95 backdrop-blur-xl flex flex-col">
        {/* Header elegante - mobile otimizado */}
        <div className="p-3 border-b border-line/20 bg-gradient-to-r from-surface to-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-lg">
              <Zap className="w-4 h-4 text-accent-ink" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-txt bg-gradient-to-r from-txt to-accent bg-clip-text text-transparent">
                  VOLT FITNESS
                </h2>
                <p className="text-xs text-txt-3">Sistema Profissional</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu principal */}
        <div className="flex-1 overflow-auto py-4">{" "}

          <SidebarGroup>
            <SidebarGroupLabel className="text-txt-2 px-4 py-2 text-xs font-medium">
              {!collapsed ? "NAVEGAÇÃO" : ""}
            </SidebarGroupLabel>
            
            <SidebarGroupContent className="px-2">
              <SidebarMenu className="space-y-1">
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      asChild 
                      className={`
                        p-3 rounded-lg transition-all duration-200 group
                        ${activeView === item.id || location.pathname === item.path
                          ? 'bg-gradient-to-r from-accent/20 to-accent/10 text-accent border-l-3 border-accent shadow-sm' 
                          : 'hover:bg-white/5 text-txt-2 hover:text-txt hover:translate-x-1'
                        }
                      `}
                    >
                       <button onClick={() => { 
                        if (item.path) { 
                          navigate(item.path); 
                        } else if (item.id === 'premium-features') {
                          onViewChange(item.id);
                        } else { 
                          onViewChange(item.id); 
                        } 
                        closeSidebarAfterAction(); 
                      }} className="flex items-center w-full">
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${activeView === item.id || location.pathname === item.path ? 'text-accent' : 'text-txt-2 group-hover:text-accent'}`} />
                        {!collapsed && (
                          <div className="ml-3 text-left min-w-0 flex-1">
                            <div className="font-medium text-sm truncate">{item.title}</div>
                            <div className="text-xs opacity-60 truncate">{item.description}</div>
                          </div>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                
                {/* Admin Items */}
                {isAdmin && adminItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      asChild 
                      className={`
                        p-3 rounded-lg transition-all duration-200 group border border-accent/30
                        ${activeView === item.id 
                          ? 'bg-gradient-to-r from-accent/20 to-accent/10 text-accent border-l-3 border-accent shadow-sm' 
                          : 'hover:bg-white/5 text-txt-2 hover:text-txt hover:translate-x-1'
                        }
                      `}
                    >
                      <button onClick={() => { if (item.id === 'admin-panel') { navigate('/admin'); } else if (item.id === 'system-test') { navigate('/testes/sessao'); } else if (item.id === 'system-report-detailed') { navigate('/testes/completo'); } else { onViewChange(item.id); } closeSidebarAfterAction(); }} className="flex items-center w-full">
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${activeView === item.id ? 'text-accent' : 'text-txt-2 group-hover:text-accent'}`} />
                        {!collapsed && (
                          <div className="ml-3 text-left min-w-0 flex-1">
                            <div className="font-medium text-sm truncate flex items-center gap-2">
                              {item.title}
                              <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">ADMIN</span>
                            </div>
                            <div className="text-xs opacity-60 truncate">{item.description}</div>
                          </div>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Menu inferior - mobile first */}
        <div className="p-3 border-t border-line/20 bg-surface/50 backdrop-blur-sm">
          <SidebarMenu className="space-y-1">
            {bottomItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton 
                  asChild 
                  className="p-3 rounded-xl transition-all duration-200 hover:bg-white/5 text-txt-3 hover:text-txt group"
                >
                  <button 
                    onClick={() => { 
                      if (item.id === 'logout') { 
                        handleLogout(); 
                      } else if (item.id === 'settings') {
                        navigate('/settings');
                      } else { 
                        onViewChange(item.id);
                      }
                      closeSidebarAfterAction();
                    }} 
                    className="flex items-center w-full"
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0 group-hover:text-accent" />
                    {!collapsed && (
                      <span className="ml-3 text-sm truncate">{item.title}</span>
                    )}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}