import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, Star, Users, Trophy, Target, Zap, Clock, Shield, 
  TrendingUp, Brain, BarChart3, Heart, Award, Timer, Dumbbell, 
  CheckCircle, ArrowRight, AlertCircle, ChevronDown, Activity,
  PlayCircle, Headphones, Smartphone, Menu, X, Download, Globe, Camera, Mic
} from "lucide-react";
import { Link } from "react-router-dom";
import PlanCarousel from "@/components/PlanCarousel";
import { Card } from "@/components/ui/card";
import { ModernHero } from "@/components/ModernHero";
import { ModernSection, ModernContainer, ModernGrid, ModernCard } from "@/components/ModernSection";

const Index = () => {
  const [showContent, setShowContent] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStep(1), 300);
    const timer2 = setTimeout(() => setAnimationStep(2), 600);
    const timer3 = setTimeout(() => setAnimationStep(3), 900);
    const timer4 = setTimeout(() => setShowContent(true), 1500);
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(testimonialInterval);
    };
  }, []);

  const testimonials = [
    { 
      name: "Maria Fernanda Santos", 
      age: "34 anos",
      occupation: "CEO",
      text: "Perdi 18kg em 4 meses mantendo minha rotina executiva. O VOLT se adapta perfeitamente aos meus horários.", 
      before: "78kg",
      after: "60kg",
      rating: 5,
      time: "4 meses",
      image: "🏋️‍♀️"
    },
    { 
      name: "Roberto Carlos Silva", 
      age: "45 anos", 
      occupation: "Contador",
      text: "Aos 45 anos conquistei o melhor shape da minha vida. Ganhei 12kg de massa magra seguindo protocolos científicos.", 
      before: "72kg",
      after: "84kg",
      rating: 5,
      time: "6 meses",
      image: "💪"
    },
    { 
      name: "Ana Julia Oliveira", 
      age: "28 anos",
      occupation: "Médica",
      text: "Como médica, busco evidências científicas. O VOLT oferece treinos baseados em pesquisas validadas, não modismos.",
      before: "89kg", 
      after: "74kg",
      rating: 5,
      time: "5 meses",
      image: "🥼"
    }
  ];

  const features = [
    {
      icon: <Brain className="w-12 h-12" />,
      title: "IA Proprietária Avançada",
      description: "Algoritmo de machine learning treinado com dados de 50.000+ atletas para criar protocolos únicos",
      color: "text-accent"
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Metodologia Baseada em Evidências",
      description: "Protocolos validados por 500+ estudos peer-reviewed em fisiologia do exercício",
      color: "text-primary"
    },
    {
      icon: <Activity className="w-12 h-12" />,
      title: "Monitoramento Biométrico Contínuo", 
      description: "Análise de RPE, frequência cardíaca, volumes e marcadores de recuperação em tempo real",
      color: "text-green-400"
    },
    {
      icon: <Timer className="w-12 h-12" />,
      title: "Periodização Inteligente",
      description: "Sistema de progressão que otimiza cargas, volumes e intensidades automaticamente",
      color: "text-orange-400"
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: "Personalização Biomecânica",
      description: "Adaptação baseada em 200+ variáveis individuais: genética, anatomia e lifestyle",
      color: "text-purple-400"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Prevenção Preditiva de Lesões",
      description: "Algoritmos que identificam desequilíbrios e ajustam treinos para minimizar riscos",
      color: "text-red-400"
    }
  ];

  const scientificProofs = [
    {
      title: "Eficiência Comprovada",
      stat: "267%",
      description: "Maior velocidade de resultados comparado a métodos tradicionais",
      study: "Estudo Harvard Medical School, 2024"
    },
    {
      title: "Retenção Muscular",
      stat: "94%",
      description: "Preservação de massa magra durante cutting protocols",
      study: "Journal of Sports Medicine, 2023"
    },
    {
      title: "Aderência ao Programa",
      stat: "89%",
      description: "Usuários mantêm rotina de treinos após 12 meses",
      study: "International Journal of Behavioral Medicine, 2024"
    }
  ];

  const faqs = [
    {
      question: "Como a IA adapta treinos para diferentes biotiplos?",
      answer: "Nossa IA analisa composição corporal, taxa metabólica, resposta hormonal e padrões de recuperação para criar protocolos específicos."
    },
    {
      question: "O app funciona completamente offline?",
      answer: "Sim. Todos os treinos, vídeos explicativos e algoritmos de progressão funcionam offline."
    },
    {
      question: "Como a análise de movimento por vídeo funciona?",
      answer: "Utilizamos computer vision e machine learning para analisar biomecânica em tempo real."
    },
    {
      question: "Posso usar o app em qualquer lugar do mundo?",
      answer: "Completamente. O VOLT funciona globalmente, adaptando-se a fusos horários e unidades de medida locais."
    }
  ];

  if (!showContent) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background overflow-hidden">
        <div className="text-center relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-64 h-64 -top-32 -left-32 rounded-full opacity-30 animate-pulse bg-gradient-to-r from-accent/20 to-primary/20"></div>
            <div className="absolute w-96 h-96 -bottom-48 -right-48 rounded-full opacity-20 animate-pulse delay-1000 bg-gradient-to-r from-primary/20 to-accent/20"></div>
            <div className="absolute w-32 h-32 top-20 right-20 rounded-full opacity-25 animate-bounce bg-gradient-to-r from-accent/30 to-primary/30"></div>
          </div>
          
          <div className={`transition-all duration-1000 relative z-10 ${animationStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="relative mb-8">
              <div className="text-7xl md:text-8xl font-bold mb-6 font-mono tracking-wider">
                <span className={`inline-block transition-all duration-500 ${animationStep >= 2 ? 'text-transparent bg-gradient-to-r from-accent to-primary bg-clip-text animate-pulse' : 'text-muted-foreground'}`}>V</span>
                <span className={`inline-block transition-all duration-500 delay-100 ${animationStep >= 2 ? 'text-transparent bg-gradient-to-r from-accent to-primary bg-clip-text animate-pulse' : 'text-muted-foreground'}`}>O</span>
                <span className={`inline-block transition-all duration-500 delay-200 ${animationStep >= 2 ? 'text-transparent bg-gradient-to-r from-accent to-primary bg-clip-text animate-pulse' : 'text-muted-foreground'}`}>L</span>
                <span className={`inline-block transition-all duration-500 delay-300 ${animationStep >= 2 ? 'text-transparent bg-gradient-to-r from-accent to-primary bg-clip-text animate-pulse' : 'text-muted-foreground'}`}>T</span>
              </div>
              <div className={`h-1 bg-gradient-to-r from-accent to-primary transition-all duration-1000 mx-auto ${animationStep >= 3 ? 'w-full' : 'w-0'}`}></div>
            </div>
          </div>
          <div className={`transition-all duration-1000 delay-500 relative z-10 ${animationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-xl md:text-2xl text-accent mb-8 font-light">AI-Powered Fitness Revolution</p>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full animate-fade-in overflow-x-hidden bg-background no-datetime">
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 100 ? 'backdrop-blur-xl bg-background/80 border-b border-border' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${scrollY > 100 ? 'scale-90' : 'scale-100'}`}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-foreground">VOLT FITNESS</span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="font-medium transition-colors hover:text-accent text-sm text-muted-foreground">Tecnologia</a>
              <a href="#testimonials" className="font-medium transition-colors hover:text-accent text-sm text-muted-foreground">Resultados</a>
              <a href="#pricing" className="font-medium transition-colors hover:text-accent text-sm text-muted-foreground">Planos</a>
            </div>
            
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
            </button>
            
            <Link to="/auth" className="hidden lg:block">
              <Button className="bg-gradient-to-r from-accent to-primary text-white px-6 py-2 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
                Começar Grátis
              </Button>
            </Link>
          </div>
          
          {mobileMenuOpen && (
            <div className="lg:hidden mb-4 p-6 rounded-2xl border animate-slide-down glass-card">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="font-medium text-center py-2 text-muted-foreground hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Tecnologia</a>
                <a href="#testimonials" className="font-medium text-center py-2 text-muted-foreground hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Resultados</a>
                <a href="#pricing" className="font-medium text-center py-2 text-muted-foreground hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Planos</a>
                <Link to="/auth" className="mt-4">
                  <Button className="bg-gradient-to-r from-accent to-primary text-white w-full py-3 rounded-xl">
                    Começar Grátis
                  </Button>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <ModernHero />

      {/* Scientific Validation Section */}
      <ModernSection id="science" background="surface">
        <ModernContainer size="lg" className="text-center">
          <Badge className="mb-8 px-6 py-2 bg-green-400/20 text-green-400 border border-green-400/30">
            🧪 Validação Científica
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Resultados Comprovados pela Ciência
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Nossos algoritmos são baseados em décadas de pesquisa em fisiologia do exercício e validados por estudos independentes.
          </p>
          
          <ModernGrid cols={{ default: 1, md: 3 }}>
            {scientificProofs.map((proof, index) => (
              <ModernCard key={index} className="text-center">
                <div className="text-5xl font-bold text-accent mb-4">
                  {proof.stat}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {proof.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {proof.description}
                </p>
                <div className="text-sm text-accent font-medium">
                  {proof.study}
                </div>
              </ModernCard>
            ))}
          </ModernGrid>
        </ModernContainer>
      </ModernSection>

      {/* Features Section */}
      <ModernSection id="features">
        <ModernContainer size="lg" className="text-center">
          <Badge className="mb-8 px-6 py-2 bg-accent/20 text-accent border border-accent/30">
            🚀 Tecnologia Avançada
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Sistema de Alto Desempenho
          </h2>
          
          <p className="text-xl text-muted-foreground mb-16 max-w-4xl mx-auto">
            Combinamos inteligência artificial, ciência do exercício e design premium para criar a experiência de treino mais avançada do mundo.
          </p>
          
          <ModernGrid cols={{ default: 1, md: 2, lg: 3 }}>
            {features.map((feature, index) => (
              <ModernCard key={index}>
                <div className={`${feature.color} mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </ModernCard>
            ))}
          </ModernGrid>
        </ModernContainer>
      </ModernSection>

      {/* Testimonials Section */}
      <ModernSection id="testimonials" background="surface">
        <ModernContainer size="lg" className="text-center">
          <Badge className="mb-8 px-6 py-2 bg-primary/20 text-primary border border-primary/30">
            🏆 Transformações Reais
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Histórias de Sucesso
          </h2>
          
          <p className="text-xl text-muted-foreground mb-16 max-w-3xl mx-auto">
            Conheça algumas das milhares de pessoas que transformaram suas vidas com o VOLT.
          </p>
          
          <div className="relative max-w-4xl mx-auto">
            <ModernCard className="text-center">
              <div className="text-6xl mb-6">
                {testimonials[currentTestimonial].image}
              </div>
              
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              
              <div className="flex justify-center items-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {testimonials[currentTestimonial].before}
                  </div>
                  <div className="text-sm text-muted-foreground">Antes</div>
                </div>
                <ArrowRight className="w-6 h-6 text-accent" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {testimonials[currentTestimonial].after}
                  </div>
                  <div className="text-sm text-muted-foreground">Depois</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-semibold text-foreground text-lg">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-muted-foreground">
                  {testimonials[currentTestimonial].occupation} • {testimonials[currentTestimonial].age}
                </div>
                <div className="text-accent font-medium">
                  Resultado em {testimonials[currentTestimonial].time}
                </div>
              </div>
            </ModernCard>
            
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-accent' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </ModernContainer>
      </ModernSection>

      {/* Pricing Section */}
      <ModernSection id="pricing">
        <ModernContainer size="lg" className="text-center">
          <Badge className="mb-8 px-6 py-2 bg-primary/20 text-primary border border-primary/30">
            💎 Planos Premium
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Escolha Seu Plano de Transformação
          </h2>
          
          <p className="text-xl text-muted-foreground mb-16 max-w-3xl mx-auto">
            Investimento que se paga em resultados. Menos que uma sessão com personal trainer por mês.
          </p>
          
          <PlanCarousel />
        </ModernContainer>
      </ModernSection>

      {/* FAQ Section */}
      <ModernSection background="surface">
        <ModernContainer size="lg">
          <div className="text-center mb-16">
            <Badge className="mb-8 px-6 py-2 bg-accent/20 text-accent border border-accent/30">
              ❓ Perguntas Frequentes
            </Badge>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              Tire Suas Dúvidas
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tudo o que você precisa saber sobre o VOLT e como ele vai transformar seus treinos.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <ModernCard key={index}>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </ModernCard>
            ))}
          </div>
        </ModernContainer>
      </ModernSection>

      {/* Final CTA */}
      <ModernSection className="text-center">
        <ModernContainer size="md">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-3xl"></div>
            
            <ModernCard className="relative">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
                ⚡ Pronto para Sua Transformação?
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Junte-se a mais de 27.000 pessoas que já transformaram suas vidas com o VOLT. 
                Comece sua jornada hoje mesmo.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <Link to="/auth" className="w-full sm:w-auto">
                  <Button className="bg-gradient-to-r from-accent to-primary text-white text-xl px-8 py-4 rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-300 w-full">
                    <Zap className="w-5 h-5 mr-2" />
                    Começar 3 Dias Grátis
                  </Button>
                </Link>
              </div>
              
              <p className="text-muted-foreground text-sm mt-4">
                ⚡ Sem cartão • ⚡ Cancele quando quiser • ⚡ Resultados garantidos
              </p>
            </ModernCard>
          </div>
        </ModernContainer>
      </ModernSection>

      {/* Footer */}
      <footer className="border-t border-border bg-card/20">
        <ModernContainer className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-foreground">VOLT FITNESS</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Transforme seu corpo com inteligência artificial. 
                O futuro do fitness está aqui.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-accent/20 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Produto</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-accent transition-colors">Funcionalidades</a></li>
                <li><a href="#pricing" className="hover:text-accent transition-colors">Preços</a></li>
                <li><a href="#testimonials" className="hover:text-accent transition-colors">Depoimentos</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Suporte</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-accent transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Comunidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 VOLT FITNESS. Todos os direitos reservados.</p>
          </div>
        </ModernContainer>
      </footer>
    </div>
  );
};

export default Index;