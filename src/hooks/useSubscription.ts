import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usageTracker } from '@/services/UsageTracker';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionStatus {
  subscribed: boolean;
  status: string;
  plan_id: string | null;
  plan_type: 'free' | 'pro' | 'premium';
  trial_end: string | null;
  current_period_end: string | null;
  grace_period?: boolean;
  loading: boolean;
  error: string | null;
  usage_limits?: {
    workouts_created: number;
    max_workouts: number;
    ai_requests: number;
    max_ai_requests: number;
  };
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    subscribed: false,
    status: 'free',
    plan_id: null,
    plan_type: 'free',
    trial_end: null,
    current_period_end: null,
    loading: true,
    error: null,
    usage_limits: {
      workouts_created: 0,
      max_workouts: 3,
      ai_requests: 0,
      max_ai_requests: 5,
    },
  });

  const checkSubscription = async () => {
    if (!user) {
      setSubscription(prev => ({
        ...prev,
        subscribed: false,
        status: 'free',
        plan_type: 'free',
        loading: false,
      }));
      return;
    }

    try {
      setSubscription(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;

      // Verificar também se o usuário tem acesso gratuito concedido por admin
      const { data: currentUser } = await supabase.auth.getUser();
      let hasAdminAccess = false;
      
      if (currentUser?.user?.email) {
        const { data: adminAccess } = await supabase
          .from('admin_controls')
          .select('free_access_granted')
          .eq('target_user_email', currentUser.user.email)
          .eq('free_access_granted', true)
          .maybeSingle();
          
        hasAdminAccess = !!adminAccess;
      }

      setSubscription(prev => ({
        ...prev,
        ...data,
        subscribed: data.subscribed || hasAdminAccess,
        plan_type: hasAdminAccess && data.plan_type === 'free' ? 'premium' : data.plan_type,
        loading: false,
      }));
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  const openCustomerPortal = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      throw error;
    }
  };

  // Check subscription on mount and when user changes
  useEffect(() => {
    checkSubscription();
  }, [user]);

  // Auto-refresh every 15 seconds for better responsiveness
  useEffect(() => {
    const interval = setInterval(checkSubscription, 15000);
    return () => clearInterval(interval);
  }, [user]);

  return {
    ...subscription,
    checkSubscription,
    openCustomerPortal,
    isPro: subscription.plan_type === 'pro' || subscription.plan_type === 'premium',
    isPremium: subscription.plan_type === 'premium',
    isFree: subscription.plan_type === 'free',
    isTrial: subscription.status === 'trialing',
    isPastDue: subscription.status === 'past_due',
    hasReachedWorkoutLimit: subscription.usage_limits ? 
      subscription.usage_limits.workouts_created >= subscription.usage_limits.max_workouts : false,
    hasReachedAILimit: subscription.usage_limits ? 
      subscription.usage_limits.ai_requests >= subscription.usage_limits.max_ai_requests : false,
  };
};