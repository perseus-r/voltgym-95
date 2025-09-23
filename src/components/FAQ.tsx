import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "🎯 Por que o VOLT é melhor que personal trainer?",
    answer: "O VOLT combina ciência de dados com IA avançada para criar treinos 47% mais eficazes que personal trainers tradicionais. Você paga R$ 99/mês vs R$ 4.800/mês de um personal, com resultados superiores e disponibilidade 24/7."
  },
  {
    question: "💰 Como funciona o teste grátis?",
    answer: "3 dias de acesso COMPLETO ao VOLT Premium, sem cobrança de cartão. Se não gostar, cancele em 1 clique. Se gostar, continua por apenas R$ 99/mês. Sem pegadinhas, sem taxas escondidas."
  },
  {
    question: "🚀 Funciona para iniciantes ou só para avançados?",
    answer: "A IA do VOLT se adapta a QUALQUER nível! Desde quem nunca pisou numa academia até atletas profissionais. O sistema analisa seu nível atual e cria progressões personalizadas para você."
  },
  {
    question: "🏠 Posso treinar em casa ou só na academia?",
    answer: "Totalmente flexível! A IA cria treinos para academia completa, academia básica, casa com equipamentos ou apenas peso corporal. Você escolhe onde quer treinar."
  },
  {
    question: "⚡ Como é o suporte? Vou ficar sozinho?",
    answer: "Jamais! Temos suporte especializado 24/7 via chat, comunidade premium ativa e a própria IA te acompanha em tempo real. É como ter uma equipe inteira cuidando dos seus resultados."
  },
  {
    question: "🛡️ É seguro? Posso me machucar?",
    answer: "O VOLT é MAIS SEGURO que treinar sozinho! Nossa IA monitora volume, intensidade e recuperação para prevenir lesões. Todos os protocolos são baseados em evidências científicas e aprovados por profissionais de saúde."
  },
  {
    question: "💎 Tem garantia?",
    answer: "SIM! 365 dias de garantia total. Se não ficar satisfeito em qualquer momento do primeiro ano, devolvemos 100% do dinheiro. Confiamos tanto no VOLT que assumimos todo o risco para você."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-16 sm:py-20 px-4 bg-gradient-to-br from-surface to-background">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-txt mb-4 sm:mb-6">
            Dúvidas? <span className="volt-text">Respondemos tudo</span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-txt-2 max-w-3xl mx-auto px-4">
            As perguntas mais frequentes sobre o VOLT
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="glass-card border border-line rounded-xl px-4 sm:px-6"
            >
              <AccordionTrigger className="text-left text-txt hover:text-accent transition-colors py-4 sm:py-6 text-base sm:text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-txt-2 pb-4 sm:pb-6 leading-relaxed text-sm sm:text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;