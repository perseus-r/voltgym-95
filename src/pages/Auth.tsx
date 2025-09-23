import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileCheck } from '@/hooks/useProfileCheck';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { OptimizedLayout, OptimizedHero } from '@/components/OptimizedLayout';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const { profileComplete, loading: profileLoading } = useProfileCheck();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Se ainda está carregando, não fazer nada
    if (authLoading || profileLoading) return;
    
    // Se usuário está logado, sempre vai para dashboard
    if (user) {
      console.log("Auth: user logged in, redirecting to dashboard");
      navigate('/dashboard');
    }
  }, [user, authLoading, profileLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Auth: Form submitted", { isLogin, email, hasDisplayName: !!displayName, hasPhone: !!phone });

    try {
      let result;
      
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        if (!displayName.trim()) {
          toast({
            title: "Nome obrigatório",
            description: "Por favor, insira seu nome completo.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        if (!phone.trim()) {
          toast({
            title: "Telefone obrigatório",
            description: "Por favor, insira seu número de telefone.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        console.log("Auth: Calling signUp with", { email, displayName, phone });
        result = await signUp(email, password, displayName, phone);
      }

      console.log("Auth: Result from auth call", { error: result.error?.message, isLogin });

      if (result.error) {
        let errorMessage = "Erro desconhecido";
        
        if (result.error.message.includes('Invalid login credentials')) {
          errorMessage = "Email ou senha incorretos";
        } else if (result.error.message.includes('User already registered')) {
          errorMessage = "Este email já está cadastrado. Tente fazer login.";
        } else if (result.error.message.includes('Password should be at least 6 characters')) {
          errorMessage = "A senha deve ter pelo menos 6 caracteres";
        } else if (result.error.message.includes('Invalid email')) {
          errorMessage = "Email inválido";
        } else if (result.error.message.includes('email_not_confirmed')) {
          errorMessage = "Confirme seu email antes de fazer login. Verifique sua caixa de entrada.";
        } else if (result.error.message.includes('Email not confirmed')) {
          errorMessage = "Confirme seu email antes de fazer login. Verifique sua caixa de entrada.";
        }

        toast({
          title: isLogin ? "Erro no login" : "Erro no cadastro",
          description: errorMessage,
          variant: "destructive"
        });
      } else if (!isLogin) {
        toast({
          title: "⚡ Conta criada com sucesso!",
          description: "Redirecionando para o dashboard...",
        });
      } else {
        // Login bem-sucedido - será redirecionado automaticamente pelo useEffect
        toast({
          title: "⚡ Login realizado!",
          description: "Bem-vindo de volta ao VOLT!",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Algo deu errado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading enquanto verifica dados
  if (authLoading || profileLoading) {
    return (
      <OptimizedLayout>
        <OptimizedHero className="flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verificando conta...</p>
          </div>
        </OptimizedHero>
      </OptimizedLayout>
    );
  }

  return (
    <OptimizedLayout>
      <OptimizedHero>
        <Card className="glass-card border-border/50 shadow-2xl overflow-hidden backdrop-blur-sm w-full max-w-md mx-auto">
          <CardHeader className="space-y-4 text-center pb-8 relative">
            {/* Fitness Brand Identity */}
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-destructive/30 via-accent/30 to-primary/30 rounded-2xl flex items-center justify-center mb-6 shadow-xl backdrop-blur-sm border border-accent/20 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/20 to-accent/20 rounded-2xl animate-pulse"></div>
              {isLogin ? (
                <LogIn className="w-12 h-12 text-accent drop-shadow-lg relative z-10" />
              ) : (
                <UserPlus className="w-12 h-12 text-accent drop-shadow-lg relative z-10" />
              )}
            </div>
            
            {/* Brand Title with Fitness Identity */}
            <div className="mb-6">
              <div className="text-4xl font-bold mb-3">
                <span className="text-destructive">⚡</span>
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent font-bold">VOLT</span>
                <span className="text-muted-foreground text-2xl ml-2">FITNESS</span>
              </div>
              <div className="text-lg font-semibold text-foreground mb-2">
                {isLogin ? '🏆 Bem-vindo de volta, atleta!' : '🏆 Junte-se aos campeões'}
              </div>
            </div>
            
            {/* Value Proposition for Signup */}
            {!isLogin && (
              <div className="bg-gradient-to-r from-destructive/20 via-accent/20 to-primary/20 border-2 border-accent/30 rounded-xl p-4 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 to-accent/10 rounded-xl animate-pulse"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                    <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent font-bold text-base">3 DIAS PREMIUM GRÁTIS</span>
                    <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Acesso completo • Sem cartão • Cancela quando quiser
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span>✅ IA Personal</span>
                    <span>✅ Treinos Científicos</span>
                    <span>✅ Comunidade Elite</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Login Welcome Message */}
            {isLogin && (
              <div className="bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 rounded-xl p-4 text-center">
                <div className="text-muted-foreground text-sm">
                  Sua jornada fitness continua aqui
                </div>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-medium">Sistema online</span>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6 px-6 sm:px-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-foreground font-medium">Nome de atleta</Label>
                    <Input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Como você quer ser chamado?"
                      required={!isLogin}
                      className="bg-input/80 border-input-border/50 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground font-medium">WhatsApp para suporte</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      required={!isLogin}
                      className="bg-input/80 border-input-border/50 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="bg-input/80 border-input-border/50 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-input/80 border-input-border/50 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 backdrop-blur-sm pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Fitness-focused CTA Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-destructive via-accent to-primary hover:from-destructive/90 hover:via-accent/90 hover:to-primary/90 text-white font-bold py-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>{isLogin ? '🏆 ENTRAR NO VOLT' : '🚀 COMEÇAR JORNADA'}</span>
                    {!isLogin && <span className="text-xs opacity-80">(3 dias grátis)</span>}
                  </div>
                )}
              </Button>
            </form>

            {/* Enhanced Toggle Section */}
            <div className="text-center pt-6 border-t border-border/30">
              <div className="bg-gradient-to-r from-card/50 to-muted/50 rounded-xl p-4 backdrop-blur-sm border border-accent/10">
                <p className="text-muted-foreground mb-3 font-medium">
                  {isLogin ? 'Novo no universo VOLT?' : 'Já faz parte da família fitness?'}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setEmail('');
                    setPassword('');
                    setDisplayName('');
                    setPhone('');
                  }}
                  className="text-accent border-accent/40 hover:bg-accent/10 hover:text-accent transition-all duration-200 backdrop-blur-sm font-medium w-full sm:w-auto"
                >
                  {isLogin ? '🚀 Criar conta de atleta' : '⚡ Fazer login'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </OptimizedHero>
    </OptimizedLayout>
  );
};

export default Auth;