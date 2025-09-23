import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Create initial particles
    const initialParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }
    setParticles(initialParticles);

    // Animation loop
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx > window.innerWidth ? 0 : particle.x + particle.vx < 0 ? window.innerWidth : particle.x + particle.vx,
        y: particle.y + particle.vy > window.innerHeight ? 0 : particle.y + particle.vy < 0 ? window.innerHeight : particle.y + particle.vy,
      })));
    };

    const interval = setInterval(animateParticles, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg via-surface/50 to-bg opacity-90" />
      
      {/* Animated particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-accent"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            filter: 'blur(0.5px)',
            boxShadow: `0 0 ${particle.size * 2}px hsl(var(--accent) / 0.3)`,
          }}
        />
      ))}

      {/* Lightning grid effect */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" className="animate-electric-flow">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-accent" />
        </svg>
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-accent/10 to-accent-2/10 blur-3xl animate-float" />
      <div className="absolute top-3/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-accent-2/10 to-accent/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
    </div>
  );
}