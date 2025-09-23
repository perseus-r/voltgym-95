import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isAdminEmail } from '@/lib/admin';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Settings, Database } from 'lucide-react';
import { toast } from 'sonner';

interface AdminStats {
  totalUsers: number;
  totalProfiles: number;
  totalSubscriptions: number;
  totalPosts: number;
}

export const AdminCheck = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const adminStatus = isAdminEmail(user.email);
      setIsAdmin(adminStatus);

      if (adminStatus) {
        await loadAdminStats();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminStats = async () => {
    try {
      const [
        { count: usersCount },
        { count: profilesCount },
        { count: subscriptionsCount },
        { count: postsCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('subscriptions').select('*', { count: 'exact', head: true }),
        supabase.from('social_posts').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalUsers: usersCount || 0,
        totalProfiles: profilesCount || 0,
        totalSubscriptions: subscriptionsCount || 0,
        totalPosts: postsCount || 0
      });
    } catch (error) {
      console.error('Error loading admin stats:', error);
      toast.error('Erro ao carregar estatísticas administrativas');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="glass-card p-6 border-accent/30">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-accent" />
        <div>
          <h3 className="text-lg font-semibold text-white">Painel de Administrador</h3>
          <p className="text-text-2 text-sm">Acesso total ao sistema</p>
        </div>
        <Badge variant="outline" className="border-accent text-accent ml-auto">
          ADMIN
        </Badge>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-surface/50 p-4 text-center">
            <Users className="w-6 h-6 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
            <div className="text-xs text-text-2">Usuários</div>
          </Card>
          <Card className="bg-surface/50 p-4 text-center">
            <Database className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalProfiles}</div>
            <div className="text-xs text-text-2">Perfis</div>
          </Card>
          <Card className="bg-surface/50 p-4 text-center">
            <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalSubscriptions}</div>
            <div className="text-xs text-text-2">Assinaturas</div>
          </Card>
          <Card className="bg-surface/50 p-4 text-center">
            <Settings className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalPosts}</div>
            <div className="text-xs text-text-2">Posts</div>
          </Card>
        </div>
      )}

      <div className="flex gap-2">
        <Button 
          size="sm" 
          className="volt-button"
          onClick={() => window.open('/admin', '_blank')}
        >
          Abrir Painel Admin
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={loadAdminStats}
        >
          Atualizar Stats
        </Button>
      </div>
    </Card>
  );
};

export default AdminCheck;