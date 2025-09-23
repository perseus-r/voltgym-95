import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const VerifiedBadge = ({ size = 'md', className }: VerifiedBadgeProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const checkSizeClasses = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5'
  };

  return (
    <div 
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-blue-500 flex-shrink-0',
        sizeClasses[size],
        className
      )}
      title="Usuário verificado"
    >
      <Check className={cn('text-white font-bold', checkSizeClasses[size])} strokeWidth={3} />
    </div>
  );
};

export default VerifiedBadge;