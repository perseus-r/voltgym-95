import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string, phone: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("AuthContext: Setting up auth listener");
    }
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (process.env.NODE_ENV === 'development') {
          console.log("AuthContext: Auth state changed", event, !!session?.user);
        }
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Se é um login bem-sucedido, garantir que o perfil existe
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            ensureProfileExists(session.user);
          }, 500);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("AuthContext: Initial session check", !!session?.user);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Se tem sessão ativa, garantir que o perfil existe
      if (session?.user) {
        setTimeout(() => {
          ensureProfileExists(session.user);
        }, 500);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Função para garantir que o perfil existe
  const ensureProfileExists = async (user: User) => {
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      // Apenas criar perfil básico se não existir, SEM dados completos
      // Isso permitirá que o usuário vá para onboarding na primeira vez
      if (!existingProfile) {
        console.log("AuthContext: Creating minimal profile for new user");
        await supabase.from('profiles').insert({
          user_id: user.id,
          display_name: user.user_metadata?.display_name || '',
          phone: user.user_metadata?.phone || '',
          // NÃO preencher experience_level, goal, workout_location
          // para que useProfileCheck detecte como perfil incompleto
          current_xp: 0,
          total_workouts: 0,
          streak_days: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        console.log("AuthContext: Minimal profile created - user will go to onboarding");
      } else {
        console.log("AuthContext: Profile already exists for user");
      }
    } catch (error) {
      console.warn("AuthContext: Error checking/creating profile:", error);
    }
  };

  const signUp = async (email: string, password: string, displayName: string, phone: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log("AuthContext: Starting signup for user");
    }
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
        data: {
          display_name: displayName,
          phone: phone
        }
      }
    });
    
    // Se o cadastro foi bem-sucedido e o usuário foi criado
    if (!error && data.user) {
      try {
        // Aguardar um pouco para o trigger processar
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Inicializar período de 3 dias grátis
        const subscriptionEnd = new Date();
        subscriptionEnd.setDate(subscriptionEnd.getDate() + 3);
        
        await supabase.from('subscribers').upsert({
          user_id: data.user.id,
          email: data.user.email,
          subscribed: true,
          subscription_tier: 'trial',
          subscription_end: subscriptionEnd.toISOString()
        }, { onConflict: 'user_id' });
        
        console.log("AuthContext: 3-day trial initialized for user");
      } catch (subscriptionError) {
        console.warn("AuthContext: Could not initialize trial:", subscriptionError);
      }
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log("AuthContext: Signup result", !!data.user, error?.message);
    }
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log("AuthContext: Starting signin for user");
    }
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (process.env.NODE_ENV === 'development') {
      console.log("AuthContext: Signin result", !!data.user, error?.message);
    }
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    // Clear sensitive data from localStorage for user privacy
    if (typeof window !== 'undefined') {
      try {
        const keysToRemove = Object.keys(localStorage).filter(key => 
          key.includes('bora_') || 
          key.includes('health_') || 
          key.includes('workout_') ||
          key.includes('ai_chat') ||
          key.includes('xp_') ||
          key.includes('user_') || 
          key.includes('auto_settings')
        );
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } catch (cleanupError) {
        console.warn('Failed to clean localStorage on signOut:', cleanupError);
      }
    }
    
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};