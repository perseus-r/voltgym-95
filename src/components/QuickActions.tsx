import { useState } from "react";
import { 
  Play, 
  Zap, 
  Target, 
  Calendar, 
  TrendingUp, 
  Users, 
  BookOpen,
  Settings,
  Timer,
  Trophy,
  ShoppingBag,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
  badge?: string;
}

function QuickActionCard({ icon, title, description, color, onClick, badge }: QuickActionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={`liquid-glass-button cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {badge && (
        <div className="absolute top-2 right-2 z-10">
          <span className="px-2 py-1 text-xs font-bold bg-accent text-accent-ink rounded-full">
            {badge}
          </span>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className={`w-14 h-14 mb-4 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg transform transition-all duration-300 ${isHovered ? 'scale-110 rotate-6' : ''}`}>
          {icon}
        </div>
        
        <h3 className="text-lg font-bold text-txt mb-2 transition-colors duration-300 group-hover:text-accent">
          {title}
        </h3>
        
        <p className="text-sm text-txt-3">
          {description}
        </p>
      </CardContent>
      
      {/* Hover effect overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r from-accent/5 to-accent-2/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
    </Card>
  );
}

interface QuickActionsProps {
  onStartWorkout: () => void;
  onOpenPlanner?: () => void;
  onViewProgress?: () => void;
  onOpenCommunity?: () => void;
  onNavigateToView?: (view: string) => void;
}

export function QuickActions({ 
  onStartWorkout, 
  onOpenPlanner = () => {},
  onViewProgress = () => {},
  onOpenCommunity = () => {},
  onNavigateToView = () => {}
}: QuickActionsProps) {
  const navigate = useNavigate();
  const actions = [
    {
      icon: <Play className="w-8 h-8 text-white" />,
      title: "Iniciar Treino",
      description: "Comece seu treino agora",
      color: "from-blue-500 to-cyan-400",
      onClick: onStartWorkout,
      badge: "HOT"
    },
    {
      icon: <Calendar className="w-8 h-8 text-white" />,
      title: "Treinos",
      description: "Seus planos de treino",
      color: "from-purple-500 to-pink-500",
      onClick: () => navigate('/treinos')
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      title: "Progresso",
      description: "Veja sua evolução",
      color: "from-green-500 to-emerald-500",
      onClick: () => navigate('/progresso')
    },
    {
      icon: <BookOpen className="w-8 h-8 text-white" />,
      title: "Exercícios",
      description: "Biblioteca completa",
      color: "from-indigo-500 to-purple-600",
      onClick: () => navigate('/exercicios')
    },
    {
      icon: <Brain className="w-8 h-8 text-white" />,
      title: "IA Coach",
      description: "Seu treinador pessoal",
      color: "from-violet-500 to-purple-600",
      onClick: () => navigate('/ia-coach'),
      badge: "AI"
    },
    {
      icon: <Target className="w-8 h-8 text-white" />,
      title: "Nutrição", 
      description: "Dicas de alimentação",
      color: "from-orange-500 to-red-500",
      onClick: () => navigate('/nutricao')
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Comunidade",
      description: "Conecte-se com outros",
      color: "from-teal-500 to-cyan-600",
      onClick: () => navigate('/comunidade')
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-white" />,
      title: "Loja",
      description: "Suplementos e gear",
      color: "from-yellow-500 to-amber-500",
      onClick: () => navigate('/loja')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-txt">Ações Rápidas</h2>
        <Button variant="ghost" size="sm" className="text-accent hover:text-accent-2">
          Ver todas
        </Button>
      </div>
      
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, index) => (
          <div 
            key={index}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <QuickActionCard {...action} />
          </div>
        ))}
      </div>
    </div>
  );
}