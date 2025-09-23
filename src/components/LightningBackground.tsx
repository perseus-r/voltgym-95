import React, { useEffect, useRef, useState } from 'react';

interface Lightning {
  points: { x: number; y: number }[];
  opacity: number;
  thickness: number;
  color: string;
  fadeSpeed: number;
}

interface LightningBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export function LightningBackground({ intensity = 'medium', className = '' }: LightningBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lightningsRef = useRef<Lightning[]>([]);
  const animationRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const intensityConfig = {
    low: { frequency: 0.02, maxLightnings: 3, thickness: 1.5 },
    medium: { frequency: 0.05, maxLightnings: 5, thickness: 2 },
    high: { frequency: 0.08, maxLightnings: 8, thickness: 2.5 }
  };

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

  const generateLightningPath = (startX: number, startY: number, endX: number, endY: number): { x: number; y: number }[] => {
    const points = [{ x: startX, y: startY }];
    const segments = Math.floor(Math.random() * 8) + 6;
    
    for (let i = 1; i < segments; i++) {
      const progress = i / segments;
      const x = startX + (endX - startX) * progress + (Math.random() - 0.5) * 80;
      const y = startY + (endY - startY) * progress + (Math.random() - 0.5) * 40;
      points.push({ x, y });
    }
    
    points.push({ x: endX, y: endY });
    return points;
  };

  const createLightning = (width: number, height: number): Lightning => {
    const startX = Math.random() * width;
    const startY = -20;
    const endX = startX + (Math.random() - 0.5) * 200;
    const endY = height + 20;

    const colors = ['#7bdcff', '#ffffff', '#00d9ff', '#64b5f6'];
    
    return {
      points: generateLightningPath(startX, startY, endX, endY),
      opacity: 0.8 + Math.random() * 0.2,
      thickness: intensityConfig[intensity].thickness + Math.random(),
      color: colors[Math.floor(Math.random() * colors.length)],
      fadeSpeed: 0.02 + Math.random() * 0.03
    };
  };

  const drawLightning = (ctx: CanvasRenderingContext2D, lightning: Lightning) => {
    if (lightning.points.length < 2) return;

    // Glow effect
    ctx.save();
    ctx.shadowColor = lightning.color;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = lightning.color;
    ctx.lineWidth = lightning.thickness * 3;
    ctx.globalAlpha = lightning.opacity * 0.3;
    
    ctx.beginPath();
    ctx.moveTo(lightning.points[0].x, lightning.points[0].y);
    for (let i = 1; i < lightning.points.length; i++) {
      ctx.lineTo(lightning.points[i].x, lightning.points[i].y);
    }
    ctx.stroke();
    ctx.restore();

    // Main lightning
    ctx.save();
    ctx.strokeStyle = lightning.color;
    ctx.lineWidth = lightning.thickness;
    ctx.globalAlpha = lightning.opacity;
    
    ctx.beginPath();
    ctx.moveTo(lightning.points[0].x, lightning.points[0].y);
    for (let i = 1; i < lightning.points.length; i++) {
      ctx.lineTo(lightning.points[i].x, lightning.points[i].y);
    }
    ctx.stroke();

    // Inner bright core
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = lightning.thickness * 0.3;
    ctx.globalAlpha = lightning.opacity * 0.8;
    
    ctx.beginPath();
    ctx.moveTo(lightning.points[0].x, lightning.points[0].y);
    for (let i = 1; i < lightning.points.length; i++) {
      ctx.lineTo(lightning.points[i].x, lightning.points[i].y);
    }
    ctx.stroke();
    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Clear canvas with slight trail effect
    ctx.fillStyle = 'rgba(11, 16, 32, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const config = intensityConfig[intensity];

    // Create new lightning
    if (Math.random() < config.frequency && lightningsRef.current.length < config.maxLightnings) {
      lightningsRef.current.push(createLightning(canvas.width, canvas.height));
    }

    // Update and draw lightnings
    lightningsRef.current = lightningsRef.current.filter(lightning => {
      lightning.opacity -= lightning.fadeSpeed;
      
      if (lightning.opacity <= 0) return false;
      
      drawLightning(ctx, lightning);
      return true;
    });

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
  }, [dimensions, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}