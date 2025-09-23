import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileCheck } from '@/hooks/useProfileCheck';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresProfile?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresProfile = true 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { profileComplete, loading: profileLoading } = useProfileCheck();

  // Debug logging
  console.log('ProtectedRoute state:', {
    authLoading,
    profileLoading,
    hasUser: !!user,
    profileComplete,
    requiresProfile
  });

  // Mostrar loading enquanto verifica autenticação
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-volt-dark to-volt-darker">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-volt-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-volt-text-secondary">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está logado, redirecionar para auth
  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Se o perfil não está completo e é necessário, redirecionar para onboarding
  if (requiresProfile && profileComplete === false) {
    console.log('ProtectedRoute: Profile incomplete, redirecting to onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  // Se está aguardando verificação de perfil, mas tem usuário, aguardar
  if (requiresProfile && profileComplete === null) {
    console.log('ProtectedRoute: Still checking profile, waiting...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-volt-dark to-volt-darker">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-volt-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-volt-text-secondary">Verificando perfil...</p>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute: All checks passed, showing content');
  // Se está logado e perfil está ok (ou não é necessário), mostrar conteúdo
  return <>{children}</>;
};