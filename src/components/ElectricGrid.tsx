import React from 'react';

interface ElectricGridProps {
  className?: string;
}

export function ElectricGrid({ className = '' }: ElectricGridProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(123, 220, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(123, 220, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'pulse 4s ease-in-out infinite'
          }}
        />
      </div>

      {/* Electric Lines */}
      <div className="absolute inset-0">
        {/* Horizontal lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-pulse" />
        <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Vertical lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-accent/30 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-accent/25 to-transparent animate-pulse" style={{ animationDelay: '2.5s' }} />
      </div>

      {/* Corner Electric Effects */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-accent/20 to-transparent animate-pulse" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-accent/20 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-radial from-accent/20 to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-radial from-accent/20 to-transparent animate-pulse" style={{ animationDelay: '3s' }} />
    </div>
  );
}