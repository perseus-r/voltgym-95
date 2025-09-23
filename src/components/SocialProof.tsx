import { Card } from "@/components/ui/card";

const testimonials = [
  {
    name: "Carlos Silva",
    role: "Empresário, 34 anos",
    result: "+15kg de massa muscular",
    time: "5 meses",
    quote: "Tentei 3 personal trainers diferentes. O VOLT me deu mais resultado em menos tempo que todos eles juntos. É como ter um especialista 24h comigo.",
    image: "💪"
  },
  {
    name: "Ana Beatriz", 
    role: "Mãe de 2 filhos, 28 anos",
    result: "-22kg e corpo dos sonhos",
    time: "4 meses",
    quote: "Com a correria de casa, só conseguia treinar de madrugada. A IA se adaptou perfeitamente à minha rotina maluca. Resultado? Melhor que qualquer academia!",
    image: "🔥"
  },
  {
    name: "Ricardo Santos",
    role: "Atleta amador, 25 anos", 
    result: "+65% de força total",
    time: "3 meses",
    quote: "Estava estagnado há meses. O VOLT identificou exatamente onde eu estava errando e criou um plano que me fez quebrar todos os meus recordes.",
    image: "🏆"
  }
];

const SocialProof = () => {
  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="container-custom">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6">
            Pessoas REAIS, <span className="volt-text">Resultados REAIS</span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto px-4">
            Veja como o VOLT transformou a vida de milhares de pessoas como você
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial.name} className="glass-card p-6 sm:p-8 hover:scale-105 transition-all duration-300">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{testimonial.image}</div>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
              </div>
              
              <p className="text-white/90 italic text-lg leading-relaxed mb-6 text-center">
                "{testimonial.quote}"
              </p>
              
              <div className="border-t border-line/30 pt-6 text-center">
                <div className="text-2xl font-bold volt-text mb-1">{testimonial.result}</div>
                <div className="text-sm text-white/70 mb-2">em {testimonial.time}</div>
                <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
                <div className="text-accent text-sm font-medium">{testimonial.role}</div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Trust indicators */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="glass-card p-6 sm:p-8 rounded-2xl max-w-4xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <div>
                <div className="text-2xl sm:text-3xl font-bold volt-text mb-2">12.847</div>
                <div className="text-white/80 font-medium text-sm sm:text-base">Vidas Transformadas</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold volt-text mb-2">4.9/5</div>
                <div className="text-white/80 font-medium text-sm sm:text-base">Avaliação Média</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold volt-text mb-2">97%</div>
                <div className="text-white/80 font-medium text-sm sm:text-base">Recomendam</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold volt-text mb-2">365 dias</div>
                <div className="text-white/80 font-medium text-sm sm:text-base">Garantia Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;