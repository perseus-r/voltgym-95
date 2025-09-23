import * as React from "react";

const MOBILE_BREAKPOINT = 768;

// Usa matchMedia para alinhar exatamente com os breakpoints de CSS
const getInitialMobileState = (): boolean => {
  if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return false;
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches;
};

export function useIsMobile() {
  // Estado inicial estável evita "piscada" entre layouts
  const [isMobile, setIsMobile] = React.useState<boolean>(getInitialMobileState);

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Debounce para evitar alternâncias rápidas ao carregar/rolar
    let t: number | undefined;
    const onChange = (e: MediaQueryListEvent) => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        setIsMobile(e.matches);
      }, 150);
    };

    // Garantir estado correto imediatamente
    setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);

    return () => {
      mql.removeEventListener("change", onChange);
      if (t) window.clearTimeout(t);
    };
  }, []);

  return isMobile;
}
