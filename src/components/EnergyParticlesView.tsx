import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface EnergyParticlesViewProps {
  pulse: boolean;
  burstPosition?: { x: number; y: number };
  className?: string;
}

export function EnergyParticlesView({ pulse, burstPosition, className = '' }: EnergyParticlesViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (burstPosition) {
      createBurst(burstPosition.x, burstPosition.y);
    }
  }, [burstPosition]);

  const createParticle = (x: number, y: number, intense = false): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = intense ? Math.random() * 4 + 2 : Math.random() * 2 + 0.5;
    
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: intense ? 60 : 120,
      maxLife: intense ? 60 : 120,
      size: intense ? Math.random() * 4 + 2 : Math.random() * 2 + 1
    };
  };

  const createBurst = (x: number, y: number) => {
    const burstCount = 15;
    for (let i = 0; i < burstCount; i++) {
      particlesRef.current.push(createParticle(x, y, true));
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add ambient particles
    if (Math.random() < (pulse ? 0.3 : 0.1)) {
      particlesRef.current.push(
        createParticle(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        )
      );
    }

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;

      // Gravity effect
      particle.vy += 0.02;

      // Fade and shrink
      const alpha = particle.life / particle.maxLife;
      const size = particle.size * alpha;

      if (particle.life <= 0 || size <= 0) return false;

      // Draw particle with neon glow effect
      const intensity = pulse ? alpha * 1.5 : alpha;
      
      // Outer glow
      ctx.shadowColor = '#7BDcff';
      ctx.shadowBlur = 20 * intensity;
      ctx.fillStyle = `rgba(123, 220, 255, ${intensity * 0.8})`;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size + 2, 0, Math.PI * 2);
      ctx.fill();

      // Inner core
      ctx.shadowBlur = 5;
      ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      ctx.fill();

      return true;
    });

    // Limit particle count for performance
    if (particlesRef.current.length > 100) {
      particlesRef.current = particlesRef.current.slice(-50);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, pulse]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      createBurst(x, y);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto cursor-pointer ${className}`}
      style={{ width: '100%', height: '100%' }}
      onClick={handleCanvasClick}
      aria-label="Interactive particle background"
    />
  );
}