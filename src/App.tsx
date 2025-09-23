import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { routerFutureConfig } from '@/utils/routerConfig';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AnimatedPageWrapper } from '@/components/AnimatedPageWrapper';
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { VoltSidebarTrigger } from "@/components/VoltSidebarTrigger";
import { NativeMobileLayout } from "@/components/NativeMobileLayout";
import { isAdminEmail } from "@/lib/admin";
import { EnhancedMobileLayout } from './components/EnhancedMobileLayout';
import { PremiumPageTransition } from './components/PremiumAnimations';
import { PremiumMobileNav, PremiumHeader } from './components/PremiumMobileNav';
import { GlassContainer } from './components/PremiumGlassmorphism';
import { useIsMobile } from "@/hooks/use-mobile";
import { useMobileExperience } from "@/hooks/useMobileExperience";
import SessionAutoQA from "@/components/SessionAutoQA";
import Dashboard from "./pages/Dashboard";
import TreinosPage from "./pages/TreinosPage";
import IACoachPage from "./pages/IACoachPage";
import ProgressoPage from "./pages/ProgressoPage";
import ProPage from "./pages/ProPage";
import PremiumPage from "./pages/PremiumPage";
import NutricaoPage from "./pages/NutricaoPage";
import ProSucessoPage from "./pages/ProSucessoPage";
import PremiumSucessoPage from "./pages/PremiumSucessoPage";
import AdminPanel from "./pages/AdminPanel";
import ProductManagerPage from './pages/ProductManagerPage';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import ComunidadePage from "./pages/ComunidadePage";
import PerfilPage from "./pages/PerfilPage";
import { SessionTester } from "./components/SessionTester";
import { AllPagesTest } from "./components/AllPagesTest";
import LojaPage from "./pages/LojaPage";
import ExerciciosPage from "./pages/ExerciciosPage";
import { TabBar } from "./components/TabBar";

const queryClient = new QueryClient();

function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState('dashboard');
  const { user } = useAuth();
  const location = useLocation();
  const { isMobile } = useMobileExperience();

  // Get page title from pathname
  const getPageTitle = (pathname: string) => {
    const titles: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/treinos': 'Treinos',
      '/exercicios': 'Exercícios',
      '/ia-coach': 'IA Coach',
      '/progresso': 'Progresso',
      '/nutricao': 'Nutrição',
      '/perfil': 'Perfil',
      '/loja': 'Loja',
      '/comunidade': 'Comunidade'
    };
    return titles[pathname] || 'Volt Gym';
  };

  console.log('AppLayoutWrapper: isMobile =', isMobile, 'pathname =', location.pathname);

  if (isMobile) {
    return (
      <div className="min-h-[100dvh] w-full relative bg-gradient-to-br from-bg via-surface to-bg">
        {/* Sidebar mobile (offcanvas) */}
        <AppSidebar 
          activeView={activeView} 
          onViewChange={setActiveView}
          isAdmin={isAdminEmail(user?.email || null)}
        />
        {/* Premium mobile header */}
        <PremiumHeader 
          title={getPageTitle(location.pathname)}
          subtitle="Sua evolução em cada treino"
          actions={<VoltSidebarTrigger />}
        />
        
        {/* Main content with premium transitions */}
        <main className="pb-20 relative z-10">
          <PremiumPageTransition>
            <div className="container-custom py-6">
              {children}
            </div>
          </PremiumPageTransition>
        </main>

        {/* Premium mobile navigation */}
        <PremiumMobileNav />

        {/* Ambient energy particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow opacity-20 animate-pulse" />
        </div>
      </div>
    );
  }

  // Desktop layout with sidebar - ALWAYS show sidebar on desktop
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-bg via-surface to-bg">
        {/* Sidebar usando AppSidebar padrão */}
        <AppSidebar 
          activeView={activeView} 
          onViewChange={setActiveView}
          isAdmin={isAdminEmail(user?.email || null)}
        />
        
        {/* Main content */}
        <main className="flex-1 transition-all duration-300">
          {/* Premium desktop header with sidebar trigger */}
          <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/10">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <VoltSidebarTrigger />
                <div>
                  <h1 className="text-xl font-bold text-white">{getPageTitle(location.pathname)}</h1>
                  <p className="text-sm text-txt-2">Experiência premium de treino</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content with premium animations */}
          <div className="p-8">
            <PremiumPageTransition>
              {children}
            </PremiumPageTransition>
          </div>
        </main>

        {/* Ambient effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-warning/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </div>
    </SidebarProvider>
  );
}

const App = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log("Volt Gym App rendering...");
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <SidebarProvider>
          <Router future={routerFutureConfig}>
            <SessionAutoQA />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={
                <ProtectedRoute requiresProfile={false}>
                  <Onboarding />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AppLayoutWrapper>
                    <Dashboard />
                  </AppLayoutWrapper>
                </ProtectedRoute>
              } />
              <Route path="/treinos" element={
                <ProtectedRoute>
                  <AppLayoutWrapper>
                    <TreinosPage />
                  </AppLayoutWrapper>
                </ProtectedRoute>
              } />
              <Route path="/exercicios" element={
                <ProtectedRoute>
                  <AppLayoutWrapper>
                    <ExerciciosPage />
                  </AppLayoutWrapper>
                </ProtectedRoute>
              } />
              <Route path="/ia-coach" element={
                <ProtectedRoute>
                  <AppLayoutWrapper>
                    <IACoachPage />
                  </AppLayoutWrapper>
                </ProtectedRoute>
              } />
              <Route path="/progresso" element={
                <ProtectedRoute>
                  <AppLayoutWrapper>
                    <ProgressoPage />
                  </AppLayoutWrapper>
                </ProtectedRoute>
              } />
              <Route path="/pro" element={
                <AppLayoutWrapper>
                  <ProPage />
                </AppLayoutWrapper>
              } />
              <Route path="/premium" element={
                <AppLayoutWrapper>
                  <PremiumPage />
                </AppLayoutWrapper>
              } />
              <Route path="/loja" element={
                <ProtectedRoute>
                  <AppLayoutWrapper>
                    <LojaPage />
                  </AppLayoutWrapper>
                </ProtectedRoute>
              } />
              <Route path="/nutricao" element={
                <ProtectedRoute>
                  <AppLayoutWrapper>
                    <NutricaoPage />
                  </AppLayoutWrapper>
                </ProtectedRoute>
              } />
              <Route path="/pro/sucesso" element={
                <ProtectedRoute>
                  <AppLayoutWrapper>
                    <ProSucessoPage />
                  </AppLayoutWrapper>
                </ProtectedRoute>
              } />
              <Route path="/premium/sucesso" element={
                <ProtectedRoute>
                  <AppLayoutWrapper>
                    <PremiumSucessoPage />
                  </AppLayoutWrapper>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AppLayoutWrapper>
                    <AdminPanel />
                  </AppLayoutWrapper>
                </ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute>
                  <AppLayoutWrapper>
                    <ProductManagerPage />
                  </AppLayoutWrapper>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <AppLayoutWrapper>
                    <Settings />
                  </AppLayoutWrapper>
                </ProtectedRoute>
              } />
              <Route path="/comunidade" element={
                <AppLayoutWrapper>
                  <ComunidadePage />
                </AppLayoutWrapper>
              } />
              <Route path="/perfil" element={
                <ProtectedRoute>
                  <AppLayoutWrapper>
                    <PerfilPage />
                  </AppLayoutWrapper>
                </ProtectedRoute>
              } />
              <Route path="/testes/sessao" element={
                <ProtectedRoute>
                  <AppLayoutWrapper>
                    <SessionTester />
                  </AppLayoutWrapper>
                </ProtectedRoute>
              } />
              <Route path="/testes/completo" element={
                <ProtectedRoute>
                  <AppLayoutWrapper>
                    <AllPagesTest />
                  </AppLayoutWrapper>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          </SidebarProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;