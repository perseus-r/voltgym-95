import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  loading?: boolean;
  delay?: number;
  variant?: 'default' | 'glass' | 'solid' | 'gradient';
}

const Enhanced_Card = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, children, interactive = false, loading = false, delay = 0, variant = 'default', onMouseEnter, onMouseLeave, onClick, ...props }, ref) => {
    
    const variants = {
      default: "bg-card border border-border",
      glass: "bg-card/60 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20",
      solid: "bg-card border border-border shadow-lg",
      gradient: "bg-gradient-to-br from-card/80 to-card/40 border border-accent/20 backdrop-blur-xl"
    };

    if (loading) {
      return (
        <div
          className={cn(
            "rounded-xl p-6 animate-pulse",
            variants[variant],
            className
          )}
          ref={ref}
          {...props}
        >
          <div className="space-y-3">
            <div className="h-4 bg-accent/20 rounded w-3/4"></div>
            <div className="h-4 bg-accent/20 rounded w-1/2"></div>
            <div className="h-20 bg-accent/20 rounded"></div>
          </div>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.3, 
          ease: "easeOut",
          delay 
        }}
        whileHover={interactive ? { 
          y: -2, 
          scale: 1.02,
          transition: { duration: 0.2 }
        } : {}}
        whileTap={interactive ? { scale: 0.98 } : {}}
        className={cn(
          "rounded-xl p-6 transition-all duration-300 ease-out will-change-transform",
          variants[variant],
          interactive && "cursor-pointer hover:shadow-xl hover:shadow-accent/10",
          className
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        ref={ref}
      >
        {children}
      </motion.div>
    );
  }
)

Enhanced_Card.displayName = "Enhanced_Card"

const Enhanced_CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-6", className)}
    {...props}
  />
))
Enhanced_CardHeader.displayName = "Enhanced_CardHeader"

const Enhanced_CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-bold leading-none tracking-tight text-txt", className)}
    {...props}
  >
    {children}
  </h3>
))
Enhanced_CardTitle.displayName = "Enhanced_CardTitle"

const Enhanced_CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-txt-2", className)}
    {...props}
  >
    {children}
  </p>
))
Enhanced_CardDescription.displayName = "Enhanced_CardDescription"

const Enhanced_CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("pb-6", className)} 
    {...props} 
  />
))
Enhanced_CardContent.displayName = "Enhanced_CardContent"

const Enhanced_CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-6 border-t border-border/50", className)}
    {...props}
  />
))
Enhanced_CardFooter.displayName = "Enhanced_CardFooter"

export { 
  Enhanced_Card, 
  Enhanced_CardHeader, 
  Enhanced_CardFooter, 
  Enhanced_CardTitle, 
  Enhanced_CardDescription, 
  Enhanced_CardContent 
}