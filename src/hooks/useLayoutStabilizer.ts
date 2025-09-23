import React, { useEffect, useState } from 'react';

interface LayoutStabilizer {
  isStable: boolean;
  dimensions: {
    width: number;
    height: number;
    isMobile: boolean;
  };
}

export const useLayoutStabilizer = (): LayoutStabilizer => {
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false
  }));
  
  const [isStable, setIsStable] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateDimensions = () => {
      const newDimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768
      };

      setDimensions(newDimensions);
      setIsStable(false);

      // Stabilize after 100ms
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsStable(true);
      }, 100);
    };

    // Initial stabilization
    updateDimensions();

    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timeoutId);
    };
  }, []);

  return { isStable, dimensions };
};