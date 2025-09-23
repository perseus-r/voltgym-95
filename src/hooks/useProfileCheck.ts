import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useProfileCheck = () => {
  const { user, loading: authLoading } = useAuth();
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (authLoading || !user) {
        setLoading(false);
        return;
      }

      try {
        console.log('useProfileCheck: Starting profile check for user:', user.id);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.warn('useProfileCheck: Error fetching profile:', error);
          setProfileComplete(false);
          setLoading(false);
          return;
        }

        // Considerar perfil completo se existe e tem dados básicos preenchidos
        const hasBasicData = !!(profile && 
          profile.display_name && 
          profile.experience_level && 
          profile.goal && 
          profile.workout_location &&
          profile.display_name.trim() !== '' &&
          profile.experience_level.trim() !== '' &&
          profile.goal.trim() !== '' &&
          profile.workout_location.trim() !== ''
        );

        console.log('useProfileCheck: Profile analysis:', { 
          profileExists: !!profile, 
          hasBasicData,
          profileData: profile
        });

        setProfileComplete(hasBasicData);
      } catch (error) {
        console.error('Erro ao verificar perfil:', error);
        setProfileComplete(false);
      } finally {
        setLoading(false);
      }
    };

    // Debounce para evitar múltiplas chamadas
    const timeoutId = setTimeout(checkProfile, 100);
    return () => clearTimeout(timeoutId);
  }, [user?.id, authLoading]); // Dependência mais específica

  return { profileComplete, loading };
};