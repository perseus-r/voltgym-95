import * as React from "react";
import { cn } from "@/lib/utils";

// Lightweight Tooltip implementation to avoid Radix runtime issues
// API-compatible subset: TooltipProvider, Tooltip, TooltipTrigger, TooltipContent

type TooltipSide = "top" | "right" | "bottom" | "left";

type TooltipContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const TooltipContext = React.createContext<TooltipContextValue | null>(null);
const TooltipDelayContext = React.createContext<number>(0);

const TooltipProvider: React.FC<React.PropsWithChildren<{ delayDuration?: number }>> = ({ children, delayDuration = 0 }) => {
  return <TooltipDelayContext.Provider value={delayDuration}>{children}</TooltipDelayContext.Provider>;
};

const Tooltip: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-flex items-center">{children}</div>
    </TooltipContext.Provider>
  );
};

const TooltipTrigger: React.FC<React.PropsWithChildren<{ asChild?: boolean }>> = ({ children, asChild }) => {
  const ctx = React.useContext(TooltipContext);
  const delay = React.useContext(TooltipDelayContext);
  const timeoutRef = React.useRef<number | null>(null);

  if (!ctx) return <>{children}</>;

  const attachHandlers = (props: any = {}) => ({
    ...props,
    onMouseEnter: (e: React.MouseEvent) => {
      props?.onMouseEnter?.(e);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => ctx.setOpen(true), delay);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      props?.onMouseLeave?.(e);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      ctx.setOpen(false);
    },
    onFocus: (e: React.FocusEvent) => {
      props?.onFocus?.(e);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => ctx.setOpen(true), delay);
    },
    onBlur: (e: React.FocusEvent) => {
      props?.onBlur?.(e);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      ctx.setOpen(false);
    },
  });

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, attachHandlers((children as any).props));
  }
  return <button type="button" {...attachHandlers()}>{children}</button>;
};

const TooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { side?: TooltipSide; align?: "start" | "center" | "end"; hidden?: boolean }>(
  ({ className, side = "top", align = "center", hidden, style, ...props }, ref) => {
    const ctx = React.useContext(TooltipContext);
    if (!ctx) return null;

    const sideClasses: Record<TooltipSide, string> = {
      top: "bottom-full left-1/2 -translate-x-1/2 -mb-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 -mr-2",
    };

    const alignClasses = align === "start" ? "-translate-x-0" : align === "end" ? "translate-x-0" : "";

    return (
      <div
        ref={ref}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md transition-opacity duration-150",
          sideClasses[side],
          alignClasses,
          (hidden || !ctx.open) ? "opacity-0" : "opacity-100",
          className,
        )}
        style={style}
        {...props}
      />
    );
  }
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
