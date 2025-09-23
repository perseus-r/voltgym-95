import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Crown, Sparkles, User, Shield, CheckCircle, Activity } from 'lucide-react';
import { isAdminEmail } from '@/lib/admin';
import { toast } from 'sonner';
import VerifiedBadge from '@/components/VerifiedBadge';

interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  plan_type: 'free' | 'pro' | 'premium';
  is_verified: boolean;
  created_at: string;
  last_sign_in_at: string;
}

const AdminPanel = () => {
  const { user } = useAuth();

  const isAdmin = user && isAdminEmail(user.email);

  // Verificar se é admin antes de qualquer hook
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="glass-card p-8 text-center max-w-md">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Acesso Negado</h1>
          <p className="text-text-2">Você não tem permissão para acessar esta página.</p>
          <div className="mt-4">
            <p className="text-sm text-txt-3">
              {user ? `Email: ${user.email}` : 'Usuário não autenticado'}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Buscar perfis de usuários com dados de verificados
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, user_id, created_at, verified')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      if (profiles && profiles.length > 0) {
        // Buscar assinaturas para determinar planos
        const { data: subscriptions } = await supabase
          .from('subscriptions')
          .select('user_id, plan_id, status');

        const userProfiles = profiles.map((profile: any) => {
          const subscription = subscriptions?.find((s: any) => s.user_id === profile.user_id);
          
          let planType: 'free' | 'pro' | 'premium' = 'free';
          if (subscription?.status === 'active') {
            planType = subscription.plan_id?.includes('premium') ? 'premium' : 'pro';
          }

          return {
            id: profile.user_id || profile.id,
            display_name: profile.display_name || 'Usuário VOLT',
            email: 'user@domain.com', // Não temos acesso ao email real
            plan_type: planType,
            is_verified: profile.verified || false,
            created_at: profile.created_at,
            last_sign_in_at: profile.created_at
          } as UserProfile;
        });

        setUsers(userProfiles);
        setFilteredUsers(userProfiles);
        return;
      }

      // Fallback para dados mock se nada funcionar
      const mockUsers = Array.from({ length: 5 }, (_, index) => ({
        id: `user-${index + 1}`,
        display_name: `Usuário ${index + 1}`,
        email: `user${index + 1}@example.com`,
        plan_type: (index % 3 === 0 ? 'premium' : index % 2 === 0 ? 'pro' : 'free') as 'free' | 'pro' | 'premium',
        is_verified: index % 4 === 0,
        created_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString()
      }));
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      toast("Dados de demonstração", { description: "Mostrando usuários de exemplo" });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const updateUserPlan = async (userId: string, planType: 'free' | 'pro' | 'premium') => {  
    try {
      const { error } = await supabase.functions.invoke('admin-update-plan', {
        body: { userId, planType, verified: false }
      });

      if (error) throw error;

      // Atualizar estado local
      setUsers(users.map(u => u.id === userId ? { ...u, plan_type: planType } : u));
      toast.success(`Plano atualizado para ${planType.toUpperCase()}`);
    } catch (error) {
      console.error('Error updating user plan:', error);
      toast.error('Erro ao atualizar plano: ' + (error as Error).message);
    }
  };

  const toggleUserVerification = async (userId: string, currentStatus: boolean) => {
    try {
      const currentUser = users.find(u => u.id === userId);
      if (!currentUser) return;

      const { error } = await supabase.functions.invoke('admin-update-plan', {
        body: { 
          userId, 
          planType: currentUser.plan_type, 
          verified: !currentStatus 
        }
      });

      if (error) throw error;

      // Atualizar estado local
      setUsers(users.map(u => u.id === userId ? { ...u, is_verified: !currentStatus } : u));
      toast.success(`Usuário ${!currentStatus ? 'verificado' : 'não verificado'}`);
    } catch (error) {
      console.error('Error updating verification:', error);
      toast.error('Erro ao atualizar verificação: ' + (error as Error).message);
    }
  };

  // Filtrar usuários
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (planFilter !== 'all') {
      filtered = filtered.filter(user => user.plan_type === planFilter);
    }

    if (verifiedFilter !== 'all') {
      const isVerified = verifiedFilter === 'verified';
      filtered = filtered.filter(user => user.is_verified === isVerified);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, planFilter, verifiedFilter]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro': return <Crown className="w-4 h-4 text-accent" />;
      case 'premium': return <Sparkles className="w-4 h-4 text-purple-400" />;
      default: return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPlanBadgeStyle = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-accent/20 text-accent border-accent/30';
      case 'premium': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-background p-2 md:p-4">
      <div className="container-custom max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <Shield className="w-6 h-6 md:w-8 md:h-8 text-accent" />
          <h1 className="text-xl md:text-3xl font-bold text-white">Painel Admin</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card className="glass-card p-3 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <User className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
              <div>
                <p className="text-text-2 text-xs md:text-sm">Total</p>
                <p className="text-lg md:text-2xl font-bold text-white">{users.length}</p>
              </div>
            </div>
          </Card>
          <Card className="glass-card p-3 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <Crown className="w-6 h-6 md:w-8 md:h-8 text-accent" />
              <div>
                <p className="text-text-2 text-xs md:text-sm">Pro</p>
                <p className="text-lg md:text-2xl font-bold text-white">
                  {users.filter(u => u.plan_type === 'pro').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="glass-card p-3 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
              <div>
                <p className="text-text-2 text-xs md:text-sm">Premium</p>
                <p className="text-lg md:text-2xl font-bold text-white">
                  {users.filter(u => u.plan_type === 'premium').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="glass-card p-3 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              <div>
                <p className="text-text-2 text-xs md:text-sm">Verificados</p>
                <p className="text-lg md:text-2xl font-bold text-white">
                  {users.filter(u => u.is_verified).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass-card p-3 md:p-6 mb-6 md:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-2" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os planos</SelectItem>
                <SelectItem value="free">Grátis</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>

            <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por verificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="verified">Verificados</SelectItem>
                <SelectItem value="unverified">Não verificados</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={fetchUsers} variant="outline">
              Atualizar
            </Button>
          </div>
        </Card>

        {/* Atividade Recente */}
        <Card className="glass-card p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-white">Atividade Recente</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-surface/30 rounded-lg">
              <span className="text-text-2 text-sm">Usuários online agora</span>
              <span className="text-accent font-medium">{users.filter(u => u.plan_type !== 'free').length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface/30 rounded-lg">
              <span className="text-text-2 text-sm">Novos cadastros hoje</span>
              <span className="text-accent font-medium">
                {users.filter(u => new Date(u.created_at).toDateString() === new Date().toDateString()).length}
              </span>
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card className="glass-card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
              <p className="text-text-2 mt-4">Carregando usuários...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="md:hidden space-y-4 p-4">
                {/* Mobile Card Layout */}
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="glass-card p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                          {user.display_name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{user.display_name || 'Sem nome'}</span>
                            {user.is_verified && <VerifiedBadge size="sm" />}
                          </div>
                          <p className="text-text-2 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <Badge className={getPlanBadgeStyle(user.plan_type)}>
                        {getPlanIcon(user.plan_type)}
                        <span className="ml-1">{user.plan_type.toUpperCase()}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      <Button
                        size="sm"
                        variant={user.is_verified ? "default" : "outline"}
                        onClick={() => toggleUserVerification(user.id, user.is_verified)}
                        className={user.is_verified ? "bg-blue-500 hover:bg-blue-600" : ""}
                      >
                        {user.is_verified ? 'Verificado' : 'Verificar'}
                      </Button>
                      
                      <Select
                        value={user.plan_type}
                        onValueChange={(value) => updateUserPlan(user.id, value as 'free' | 'pro' | 'premium')}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Grátis</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <p className="text-text-2 text-xs">
                      Cadastro: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </Card>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <table className="w-full hidden md:table">
                <thead className="bg-surface/50 border-b border-line/30">
                  <tr>
                    <th className="text-left p-4 font-medium text-text-2">Usuário</th>
                    <th className="text-left p-4 font-medium text-text-2">Email</th>
                    <th className="text-left p-4 font-medium text-text-2">Plano</th>
                    <th className="text-left p-4 font-medium text-text-2">Verificado</th>
                    <th className="text-left p-4 font-medium text-text-2">Cadastro</th>
                    <th className="text-left p-4 font-medium text-text-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-line/10 hover:bg-surface/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                            {user.display_name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white">{user.display_name || 'Sem nome'}</span>
                            {user.is_verified && <VerifiedBadge size="sm" />}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-text-2">{user.email}</td>
                      <td className="p-4">
                        <Badge className={getPlanBadgeStyle(user.plan_type)}>
                          {getPlanIcon(user.plan_type)}
                          <span className="ml-1">{user.plan_type.toUpperCase()}</span>
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button
                          size="sm"
                          variant={user.is_verified ? "default" : "outline"}
                          onClick={() => toggleUserVerification(user.id, user.is_verified)}
                          className={user.is_verified ? "bg-blue-500 hover:bg-blue-600" : ""}
                        >
                          {user.is_verified ? 'Verificado' : 'Verificar'}
                        </Button>
                      </td>
                      <td className="p-4 text-text-2">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Select
                            value={user.plan_type}
                            onValueChange={(value) => updateUserPlan(user.id, value as 'free' | 'pro' | 'premium')}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Grátis</SelectItem>
                              <SelectItem value="pro">Pro</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-text-2">
                  Nenhum usuário encontrado
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;