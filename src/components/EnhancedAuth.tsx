import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileCheck } from '@/hooks/useProfileCheck';
import { toast } from 'sonner';
import { Eye, EyeOff, UserPlus, LogIn, Zap, Shield } from 'lucide-react';
import { AppleCard, AppleButton, AppleInput, AppleSpinner, ApplePageTransition } from './AppleAnimations';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const { profileComplete, loading: profileLoading } = useProfileCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || profileLoading) return;
    
    if (user) {
      console.log("EnhancedAuth: user logged in, redirecting to dashboard");
      navigate('/dashboard');
    }
  }, [user, authLoading, profileLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        if (!displayName.trim()) {
          toast.error('Por favor, insira seu nome completo.');
          setLoading(false);
          return;
        }
        if (!phone.trim()) {
          toast.error('Por favor, insira seu número de telefone.');
          setLoading(false);
          return;
        }
        result = await signUp(email, password, displayName, phone);
      }

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
        } else if (result.error.message.includes('captcha verification process failed')) {
          errorMessage = "Falha na verificação de segurança. Tente novamente.";
        } else if (result.error.message.includes('email_not_confirmed')) {
          errorMessage = "Confirme seu email antes de fazer login. Verifique sua caixa de entrada.";
        }

        toast.error(errorMessage);
      } else if (!isLogin) {
        toast.success('⚡ Conta criada com sucesso! Redirecionando...');
      } else {
        toast.success('⚡ Login realizado! Bem-vindo de volta ao VOLT!');
      }
    } catch (error) {
      toast.error('Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg flex items-center justify-center">
        <AppleCard className="p-8 text-center">
          <AppleSpinner size="lg" />
          <p className="text-txt-2 mt-4">Verificando conta...</p>
        </AppleCard>
      </div>
    );
  }

  return (
    <ApplePageTransition>
      <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg flex items-center justify-center p-4">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <AppleCard className="p-8">
            {/* Header com logo animado */}
            <motion.div 
              className="text-center mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div 
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent via-accent-2 to-primary rounded-2xl flex items-center justify-center shadow-lg shadow-accent/30"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Zap className="w-10 h-10 text-white" />
              </motion.div>
              
              <h1 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  VOLT
                </span>
              </h1>
              
              <p className="text-txt-2">
                {isLogin ? 'Bem-vindo de volta, atleta!' : 'Junte-se aos campeões'}
              </p>
            </motion.div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="signup-fields"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <AppleInput
                      placeholder="Nome de atleta"
                      value={displayName}
                      onChange={setDisplayName}
                    />
                    <AppleInput
                      placeholder="WhatsApp para suporte"
                      value={phone}
                      onChange={setPhone}
                      type="tel"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AppleInput
                placeholder="seu@email.com"
                value={email}
                onChange={setEmail}
                type="email"
              />

              <div className="relative">
                <AppleInput
                  placeholder="••••••••"
                  value={password}
                  onChange={setPassword}
                  type={showPassword ? "text" : "password"}
                />
                <motion.button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-txt-3 hover:text-txt transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>

              <AppleButton
                variant="primary"
                className="w-full py-4 text-lg font-semibold"
                disabled={loading}
                onClick={() => {}}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <AppleSpinner size="sm" />
                    <span>Processando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    <span>{isLogin ? 'ENTRAR NO VOLT' : 'COMEÇAR JORNADA'}</span>
                  </div>
                )}
              </AppleButton>
            </form>

            {/* Toggle de modo */}
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <AppleCard hoverable={false} className="p-4 bg-gradient-to-r from-surface/50 to-card/50">
                <p className="text-txt-2 mb-3">
                  {isLogin ? 'Novo no universo VOLT?' : 'Já faz parte da família fitness?'}
                </p>
                <AppleButton
                  variant="glass"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setEmail('');
                    setPassword('');
                    setDisplayName('');
                    setPhone('');
                  }}
                  className="text-sm"
                >
                  {isLogin ? '🚀 Criar conta de atleta' : '⚡ Fazer login'}
                </AppleButton>
              </AppleCard>
            </motion.div>

            {/* Benefícios para signup */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6"
                >
                  <AppleCard hoverable={false} className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-accent" />
                      <span className="text-accent font-semibold text-sm">3 DIAS PREMIUM GRÁTIS</span>
                    </div>
                    <p className="text-txt-3 text-xs">
                      Acesso completo • Sem cartão • Cancela quando quiser
                    </p>
                  </AppleCard>
                </motion.div>
              )}
            </AnimatePresence>
          </AppleCard>
        </motion.div>
      </div>
    </ApplePageTransition>
  );
};

export default EnhancedAuth;