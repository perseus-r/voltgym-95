import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Dumbbell, 
  Brain, 
  TrendingUp, 
  Zap, 
  Users, 
  ShoppingBag, 
  Settings, 
  LogOut,
  User,
  Apple,
  Crown,
  Shield,
  Activity,
  Target,
  Cpu,
  Menu
} from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { useMobileExperience } from '@/hooks/useMobileExperience';
import { useLocation, useNavigate } from 'react-router-dom';

import { cn } from '@/lib/utils';

const sidebarItems = [
  { 
    title: "Dashboard", 
    icon: Home, 
    id: "dashboard",
    path: "/dashboard",
    description: "Visão geral premium",
    color: "from-accent/20 to-accent/10",
    badge: null
  },
  { 
    title: "Treinos", 
    icon: Dumbbell, 
    id: "treinos",
    path: "/treinos",
    description: "Sessões de treino",
    color: "from-orange-500/20 to-orange-400/10", 
    badge: "Pro"
  },
  { 
    title: "Nutrição", 
    icon: Apple, 
    id: "nutricao",
    path: "/nutricao",
    description: "Dashboard nutricional",
    color: "from-green-500/20 to-green-400/10",
    badge: "IA"
  },
  { 
    title: "IA Coach", 
    icon: Brain, 
    id: "ia-coach",
    path: "/ia-coach",
    description: "Assistente inteligente",
    color: "from-purple-500/20 to-purple-400/10",
    badge: "New"
  },
  { 
    title: "Progresso", 
    icon: TrendingUp, 
    id: "progresso",
    path: "/progresso",
    description: "Analytics avançados",
    color: "from-blue-500/20 to-blue-400/10",
    badge: null
  },
  { 
    title: "Premium", 
    icon: Crown, 
    id: "premium-features",
    path: "/premium",
    description: "Funcionalidades VIP",
    color: "from-yellow-500/20 to-yellow-400/10",
    badge: "VIP"
  },
  { 
    title: "Exercícios", 
    icon: Target, 
    id: "exercises",
    path: "/exercicios",
    description: "Biblioteca completa",
    color: "from-red-500/20 to-red-400/10",
    badge: null
  },
  { 
    title: "Comunidade", 
    icon: Users, 
    id: "community",
    path: "/comunidade",
    description: "Rede social fitness",
    color: "from-pink-500/20 to-pink-400/10",
    badge: null
  },
  { 
    title: "Perfil", 
    icon: User, 
    id: "perfil",
    path: "/perfil",
    description: "Meu perfil e configurações",
    color: "from-indigo-500/20 to-indigo-400/10",
    badge: null
  },
  { 
    title: "Loja", 
    icon: ShoppingBag, 
    id: "shop",
    path: "/loja",
    description: "Produtos premium",
    color: "from-indigo-500/20 to-indigo-400/10",
    badge: null
  },
];

const adminItems = [
  { 
    title: "Admin Panel", 
    icon: Shield, 
    id: "admin-panel",
    path: "/admin",
    description: "Gerenciamento sistema",
    color: "from-red-600/20 to-red-500/10",
    badge: "ADMIN"
  }
];

const bottomItems = [
  { 
    title: "Configurações", 
    icon: Settings, 
    id: "settings",
    path: "/settings",
    description: "Preferências"
  },
  { 
    title: "Sair", 
    icon: LogOut, 
    id: "logout",
    description: "Fazer logout"
  },
];

interface VoltSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isAdmin?: boolean;
}

export function VoltSidebar({ activeView, onViewChange, isAdmin = false }: VoltSidebarProps) {
  const { state, setOpen, setOpenMobile } = useSidebar();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useMobileExperience();
  const collapsed = state === "collapsed";

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

  const handleNavigation = (item: any) => {
    console.log('VoltSidebar: Navegating to', item.path || item.id);
    if (item.path) {
      navigate(item.path);
    } else if (item.id === 'logout') {
      handleLogout();
    } else {
      onViewChange(item.id);
    }
    closeSidebarAfterAction();
  };

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "icon"}
      side="left"
      className="transition-all duration-300 ease-in-out bg-gradient-to-b from-surface to-card backdrop-blur-xl shadow-2xl border-line/20"
      data-role="volt-sidebar"
    >
      <SidebarContent className="bg-gradient-to-b from-black/90 to-black/95 backdrop-blur-2xl overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-txt">
      {/* Header Premium Limpo */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
            <Zap className="w-5 h-5 text-accent-ink font-bold" />
          </div>
          
          <AnimatePresence>
            {!collapsed && (
              <motion.div 
                className="min-w-0 flex-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-lg font-bold text-txt">
                  VOLT GYM
                </h1>
                <p className="text-xs text-accent">
                  Sistema Premium
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

        {/* User Info Compacto */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div 
              className="p-4 border-b border-white/5"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium text-sm truncate">
                    {user?.email?.split('@')[0] || 'Usuário'}
                  </p>
                  <p className="text-txt-3 text-xs">Membro Premium</p>
                </div>
                <div className="flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-accent" />
                  <span className="text-accent text-xs font-bold">PRO</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu Principal */}
        <div className="flex-1 overflow-auto py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-txt-3 px-6 py-2 text-xs font-bold tracking-wider">
              {!collapsed ? "NAVEGAÇÃO" : ""}
            </SidebarGroupLabel>
            
            <SidebarGroupContent className="px-3">
              <SidebarMenu className="space-y-2">
                {sidebarItems.map((item, index) => {
                  const isActive = activeView === item.id || location.pathname === item.path;
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild className="p-0">
                          <motion.button
                            onClick={() => handleNavigation(item)}
                            className={cn(
                              "w-full p-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                              isActive 
                                ? "bg-gradient-to-r from-accent/20 to-accent/10 text-white shadow-lg shadow-accent/10 border border-accent/30" 
                                : "hover:bg-white/5 text-txt-2 hover:text-white hover:scale-[1.02]"
                            )}
                            whileHover={{ x: isActive ? 0 : 4 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                          >
                            {/* Background glow effect */}
                            {isActive && (
                              <motion.div
                                className={cn("absolute inset-0 rounded-xl", item.color)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              />
                            )}
                            
                            <div className="relative z-10 flex items-center gap-3">
                              <motion.div
                                animate={{ 
                                  scale: isActive ? 1.1 : 1,
                                  rotate: isActive ? [0, 5, -5, 0] : 0
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                <item.icon className={cn(
                                  "w-5 h-5 flex-shrink-0 transition-colors duration-300",
                                  isActive ? "text-accent" : "text-txt-2 group-hover:text-accent"
                                )} />
                              </motion.div>
                              
                              <AnimatePresence>
                                {!collapsed && (
                                  <motion.div 
                                    className="min-w-0 flex-1 text-left"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-sm truncate">
                                        {item.title}
                                      </span>
                                      {item.badge && (
                                        <span className={cn(
                                          "text-xs px-2 py-0.5 rounded-full font-bold",
                                          item.badge === "ADMIN" && "bg-red-500/20 text-red-400",
                                          item.badge === "VIP" && "bg-yellow-500/20 text-yellow-400", 
                                          item.badge === "Pro" && "bg-orange-500/20 text-orange-400",
                                          item.badge === "IA" && "bg-purple-500/20 text-purple-400",
                                          item.badge === "New" && "bg-green-500/20 text-green-400"
                                        )}>
                                          {item.badge}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs opacity-60 truncate">
                                      {item.description}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Active indicator */}
                            {isActive && (
                              <motion.div
                                className="absolute right-0 top-1/2 w-1 h-8 bg-accent rounded-l-full"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                              />
                            )}
                          </motion.button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  );
                })}
                
                {/* Admin Items */}
                {isAdmin && adminItems.map((item, index) => {
                  const isActive = activeView === item.id || location.pathname === item.path;
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sidebarItems.length + index) * 0.05, duration: 0.3 }}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild className="p-0">
                          <motion.button
                            onClick={() => handleNavigation(item)}
                            className={cn(
                              "w-full p-3 rounded-xl transition-all duration-300 group relative overflow-hidden border-2",
                              isActive 
                                ? "bg-gradient-to-r from-red-600/20 to-red-500/10 text-white shadow-lg border-red-500/30" 
                                : "border-red-500/20 hover:bg-red-500/10 text-txt-2 hover:text-white hover:border-red-500/40"
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="relative z-10 flex items-center gap-3">
                              <item.icon className="w-5 h-5 flex-shrink-0 text-red-400" />
                              <AnimatePresence>
                                {!collapsed && (
                                  <motion.div 
                                    className="min-w-0 flex-1 text-left"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-sm truncate">
                                        {item.title}
                                      </span>
                                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
                                        {item.badge}
                                      </span>
                                    </div>
                                    <div className="text-xs opacity-60 truncate">
                                      {item.description}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Bottom Menu */}
        <motion.div 
          className="p-4 border-t border-white/10 bg-gradient-to-r from-black/50 to-black/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <SidebarMenu className="space-y-2">
            {bottomItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild className="p-0">
                  <motion.button
                    onClick={() => handleNavigation(item)}
                    className="w-full p-2 rounded-lg transition-all duration-200 text-txt-3 hover:text-white hover:bg-white/5 group flex items-center gap-3"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 flex-shrink-0 transition-colors",
                      item.id === 'logout' ? "group-hover:text-red-400" : "group-hover:text-accent"
                    )} />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span 
                          className="text-sm truncate"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </motion.div>
      </SidebarContent>
    </Sidebar>
  );
}