import { useState, useEffect, ReactNode } from 'react';

interface ScrollingHeaderProps {
  children: ReactNode;
  className?: string;
}

export function ScrollingHeader({ children, className = "" }: ScrollingHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Add transparency when scrolled
      setIsScrolled(currentScrollY > 20);
      
      // Hide/show header based on scroll direction (Apple style)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
        ${isScrolled ? 'bg-bg/80 backdrop-blur-md border-b border-line/50' : 'bg-transparent'}
        ${isHidden ? '-translate-y-full' : 'translate-y-0'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}