import { useState, useEffect } from "react";
import { Zap, Target, TrendingUp, Trophy } from "lucide-react";

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  animated?: boolean;
}

function ProgressRing({ 
  percentage, 
  size = 120, 
  strokeWidth = 8, 
  color = "#7bdcff",
  label,
  value,
  icon,
  animated = true 
}: ProgressRingProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAnimatedPercentage(percentage);
    }
  }, [percentage, animated]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-2000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${color}40)`,
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="mb-1 text-accent">
            {icon}
          </div>
          <div className="text-lg font-bold text-txt">
            {value}
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <div className="text-sm font-medium text-txt-2">{label}</div>
        <div className="text-xs text-accent font-semibold">{animatedPercentage}%</div>
      </div>
    </div>
  );
}

export function AdvancedProgressRings() {
  const rings = [
    {
      percentage: 75,
      label: "Meta Semanal",
      value: "3/4",
      icon: <Target className="w-6 h-6" />,
      color: "#7bdcff",
    },
    {
      percentage: 90,
      label: "Consistência",
      value: "90%",
      icon: <Zap className="w-6 h-6" />,
      color: "#22c55e",
    },
    {
      percentage: 65,
      label: "Progresso XP",
      value: "Elite",
      icon: <Trophy className="w-6 h-6" />,
      color: "#f59e0b",
    },
    {
      percentage: 85,
      label: "Performance",
      value: "85%",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="liquid-glass p-8">
      <h3 className="text-xl font-bold text-txt mb-6 text-center">
        Progresso Avançado
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {rings.map((ring, index) => (
          <div 
            key={index}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <ProgressRing {...ring} />
          </div>
        ))}
      </div>
    </div>
  );
}