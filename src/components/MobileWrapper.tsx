import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileWrapperProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
}

export const MobileWrapper: React.FC<MobileWrapperProps> = ({
  children,
  className = '',
  mobileClassName = '',
  desktopClassName = ''
}) => {
  const isMobile = useIsMobile();

  const finalClassName = `
    ${className}
    ${isMobile ? mobileClassName : desktopClassName}
    ${isMobile ? 'mobile-optimized' : ''}
  `.trim();

  return (
    <div className={finalClassName}>
      {children}
    </div>
  );
};

export default MobileWrapper;