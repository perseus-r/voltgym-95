import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Check, 
  X, 
  Crown, 
  Zap, 
  Star,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  Brain,
  Activity,
  Shield,
  Smartphone
} from "lucide-react";
import { Link } from "react-router-dom";

const PlanCarousel = () => {
  const [currentPlan, setCurrentPlan] = useState(1); // Start with Pro plan (most popular)
  const [isAutoplay, setIsAutoplay] = useState(true);

  const plans = [
    {
      id: 0,
      name: "Gratuito",
      badge: null,
      price: "0",
      period: "3 dias grátis",
      description: "Para conhecer a plataforma",
      buttonText: "Começar grátis",
      buttonStyle: "bg-gray-600 hover:bg-gray-700 text-white",
      cardStyle: "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/50",
      headerStyle: "bg-gray-700/30",
      popular: false,
      features: [
        { text: "3 treinos máximo", included: true },
        { text: "5 consultas IA", included: true },
        { text: "Registro básico", included: true },
        { text: "Métricas avançadas", included: false },
        { text: "Templates prontos", included: false },
        { text: "IA Coach ilimitada", included: false },
        { text: "Dashboard nutrição", included: false },
        { text: "Selo verificado", included: false },
        { text: "Suporte prioritário", included: false }
      ]
    },
    {
      id: 1,
      name: "Pro",
      badge: "MAIS POPULAR",
      badgeColor: "bg-gradient-to-r from-cyan-500 to-blue-500",
      price: "99",
      period: "/mês",
      originalPrice: "299",
      economy: "ECONOMIA: R$ 4.701/mês vs Personal",
      description: "Para transformação séria e sustentável",
      buttonText: "Começar 3 dias grátis",
      buttonStyle: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-xl hover:shadow-cyan-500/25",
      cardStyle: "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-400/50 shadow-2xl scale-105 z-10",
      headerStyle: "bg-gradient-to-r from-cyan-500/20 to-blue-500/20",
      popular: true,
      features: [
        { text: "Treinos ilimitados", included: true },
        { text: "IA Coach ilimitada", included: true },
        { text: "Métricas avançadas", included: true },
        { text: "Templates prontos", included: true },
        { text: "Exportação & Suporte", included: true },
        { text: "Comunidade exclusiva", included: true },
        { text: "Dashboard nutrição", included: false },
        { text: "Selo verificado", included: false },
        { text: "Análise corporal IA", included: false }
      ]
    },
    {
      id: 2,
      name: "Premium",
      badge: "TRANSFORMAÇÃO COMPLETA",
      badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500",
      price: "149",
      period: "/mês",
      originalPrice: "399",
      economy: "TRANSFORMAÇÃO TOTAL + NUTRIÇÃO",
      description: "A experiência completa de transformação",
      buttonText: "Começar 3 dias grátis",
      buttonStyle: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-xl hover:shadow-purple-500/25",
      cardStyle: "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-400/50",
      headerStyle: "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
      popular: false,
      features: [
        { text: "Tudo do Pro +", included: true },
        { text: "Dashboard nutrição completo", included: true },
        { text: "IA Nutricionista", included: true },
        { text: "Contador calorias IA", included: true },
        { text: "Receitas personalizadas", included: true },
        { text: "Selo verificado ✓", included: true },
        { text: "Análise corporal IA", included: true },
        { text: "Suporte prioritário", included: true },
        { text: "Consultoria 1x1 mensal", included: true }
      ]
    }
  ];

  useEffect(() => {
    if (!isAutoplay) return;
    
    const interval = setInterval(() => {
      setCurrentPlan((prev) => (prev + 1) % plans.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoplay, plans.length]);

  const nextPlan = () => {
    setIsAutoplay(false);
    setCurrentPlan((prev) => (prev + 1) % plans.length);
  };

  const prevPlan = () => {
    setIsAutoplay(false);
    setCurrentPlan((prev) => (prev - 1 + plans.length) % plans.length);
  };

  const selectPlan = (index: number) => {
    setIsAutoplay(false);
    setCurrentPlan(index);
  };

  return (
    <section id="pricing" className="py-16 md:py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 -top-48 -left-48 rounded-full opacity-5 animate-pulse" style={{ background: 'var(--gradient-glow)' }}></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 rounded-full opacity-5 animate-pulse delay-1000" style={{ background: 'var(--gradient-glow)' }}></div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 px-6 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 backdrop-blur-sm">
            💰 Transformação com 95% de Economia
          </Badge>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: 'var(--text-1)' }}>
            Escolha Seu Plano de 
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Transformação
            </span>
          </h2>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8" style={{ color: 'var(--text-2)' }}>
            Todos os planos incluem 3 dias grátis para você testar nossa tecnologia de IA
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>Sem compromisso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>Garantia 30 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>27.000+ usuários</span>
            </div>
          </div>
        </div>

        {/* Plans Container - Desktop View */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden transition-all duration-500 hover:scale-105 ${plan.cardStyle} ${
                plan.popular ? 'transform scale-110' : ''
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className={`${plan.badgeColor} text-white px-4 py-1 text-xs font-bold shadow-lg`}>
                    {plan.badge}
                  </Badge>
                </div>
              )}

              {/* Header */}
              <div className={`p-6 text-center ${plan.headerStyle}`}>
                <div className="mb-4">
                  {plan.id === 0 && <Zap className="w-8 h-8 mx-auto text-gray-400" />}
                  {plan.id === 1 && <Crown className="w-8 h-8 mx-auto text-cyan-400" />}
                  {plan.id === 2 && <Star className="w-8 h-8 mx-auto text-purple-400" />}
                </div>
                
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-1)' }}>{plan.name}</h3>
                
                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-sm" style={{ color: 'var(--text-2)' }}>R$</span>
                    <span className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-1)' }}>{plan.price}</span>
                    <span className="text-sm" style={{ color: 'var(--text-2)' }}>{plan.period}</span>
                  </div>
                  
                  {plan.originalPrice && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="text-sm line-through text-red-400">R$ {plan.originalPrice}</span>
                      <Badge className="bg-green-500/20 text-green-400 text-xs border-green-500/30">
                        -{Math.round((1 - parseInt(plan.price) / parseInt(plan.originalPrice)) * 100)}%
                      </Badge>
                    </div>
                  )}
                  
                  {plan.economy && (
                    <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-xs font-medium text-yellow-400">{plan.economy}</p>
                    </div>
                  )}
                </div>
                
                <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>{plan.description}</p>
              </div>

              {/* Features */}
              <div className="p-6 pt-0">
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-current' : 'text-gray-500'}`} style={{ color: feature.included ? 'var(--text-2)' : undefined }}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Link to="/auth" className="block">
                  <Button className={`w-full py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 ${plan.buttonStyle}`}>
                    {plan.buttonText}
                  </Button>
                </Link>
                
                <p className="text-center text-xs mt-3 text-green-400">
                  ✅ Trial de 3 dias • ✅ Cancela quando quiser
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Navigation Buttons */}
            <button 
              onClick={prevPlan}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" style={{ color: 'var(--text-1)' }} />
            </button>
            
            <button 
              onClick={nextPlan}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-1)' }} />
            </button>

            {/* Plan Card */}
            <div className="px-4 mb-8">
              <Card className={`relative overflow-hidden transition-all duration-500 ${plans[currentPlan].cardStyle}`}>
                {/* Badge */}
                {plans[currentPlan].badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className={`${plans[currentPlan].badgeColor} text-white px-4 py-1 text-xs font-bold shadow-lg`}>
                      {plans[currentPlan].badge}
                    </Badge>
                  </div>
                )}

                {/* Header */}
                <div className={`p-6 text-center ${plans[currentPlan].headerStyle}`}>
                  <div className="mb-4">
                    {plans[currentPlan].id === 0 && <Zap className="w-8 h-8 mx-auto text-gray-400" />}
                    {plans[currentPlan].id === 1 && <Crown className="w-8 h-8 mx-auto text-cyan-400" />}
                    {plans[currentPlan].id === 2 && <Star className="w-8 h-8 mx-auto text-purple-400" />}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-1)' }}>
                    {plans[currentPlan].name}
                  </h3>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-sm" style={{ color: 'var(--text-2)' }}>R$</span>
                      <span className="text-4xl font-bold" style={{ color: 'var(--text-1)' }}>
                        {plans[currentPlan].price}
                      </span>
                      <span className="text-sm" style={{ color: 'var(--text-2)' }}>
                        {plans[currentPlan].period}
                      </span>
                    </div>
                    
                    {plans[currentPlan].originalPrice && (
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-sm line-through text-red-400">
                          R$ {plans[currentPlan].originalPrice}
                        </span>
                        <Badge className="bg-green-500/20 text-green-400 text-xs border-green-500/30">
                          -{Math.round((1 - parseInt(plans[currentPlan].price) / parseInt(plans[currentPlan].originalPrice!)) * 100)}%
                        </Badge>
                      </div>
                    )}
                    
                    {plans[currentPlan].economy && (
                      <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-xs font-medium text-yellow-400">
                          {plans[currentPlan].economy}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
                    {plans[currentPlan].description}
                  </p>
                </div>

                {/* Features */}
                <div className="p-6 pt-0">
                  <div className="space-y-3 mb-8">
                    {plans[currentPlan].features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-current' : 'text-gray-500'}`} style={{ color: feature.included ? 'var(--text-2)' : undefined }}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Link to="/auth" className="block">
                    <Button className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${plans[currentPlan].buttonStyle}`}>
                      {plans[currentPlan].buttonText}
                    </Button>
                  </Link>
                  
                  <p className="text-center text-xs mt-3 text-green-400">
                    ✅ Trial de 3 dias • ✅ Cancela quando quiser
                  </p>
                </div>
              </Card>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mb-8">
              {plans.map((_, index) => (
                <button
                  key={index}
                  onClick={() => selectPlan(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentPlan 
                      ? 'bg-cyan-400 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text-1)' }}>
              Não Sabe Qual Escolher?
            </h3>
            <p className="text-lg mb-8" style={{ color: 'var(--text-2)' }}>
              Comece com nosso teste gratuito de 3 dias e descubra o poder da IA na sua transformação
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-cyan-500/25 w-full sm:w-auto">
                  <Brain className="w-5 h-5 mr-2" />
                  Começar Teste Gratuito
                </Button>
              </Link>
              
              <Button className="bg-white/10 backdrop-blur-sm border border-white/20 text-lg px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 w-full sm:w-auto" style={{ color: 'var(--text-1)' }}>
                <Smartphone className="w-5 h-5 mr-2" />
                Falar com Consultor
              </Button>
            </div>
            
            <p className="text-sm mt-4 text-green-400">
              💳 Sem cartão de crédito • ⚡ Ativação instantânea • 🔒 100% seguro
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlanCarousel;