import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-bg/90 backdrop-blur-xl border-b border-line/30">
      <div className="container-custom flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6">
        {/* Logo - Premium Fitness Brand */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link to="/" className="group">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20 group-hover:border-accent/40 transition-all duration-300 group-hover:scale-105">
              <span className="text-2xl sm:text-3xl">⚡</span>
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">VOLT</span>
            </div>
          </Link>
          
          {/* Navigation - Clean and Modern */}
          <nav className="hidden lg:flex items-center gap-1">
            <a 
              href="#sistema" 
              className="px-4 py-2 text-txt-2 hover:text-white transition-all duration-300 rounded-lg hover:bg-surface/50 font-medium"
            >
              IA Coach
            </a>
            <a 
              href="#como-funciona" 
              className="px-4 py-2 text-txt-2 hover:text-white transition-all duration-300 rounded-lg hover:bg-surface/50 font-medium"
            >
              Como Funciona
            </a>
            <a 
              href="#planos" 
              className="px-4 py-2 text-txt-2 hover:text-white transition-all duration-300 rounded-lg hover:bg-surface/50 font-medium"
            >
              Planos
            </a>
            <a 
              href="#faq" 
              className="px-4 py-2 text-txt-2 hover:text-white transition-all duration-300 rounded-lg hover:bg-surface/50 font-medium"
            >
              FAQ
            </a>
          </nav>
        </div>
        
        {/* CTA Button - Strong and Action-Oriented */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button className="lg:hidden p-2 rounded-lg bg-surface/50 text-txt-2 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          
          {/* Main CTA */}
          <Link to="/auth">
            <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-accent to-accent/80 text-accent-ink font-bold rounded-xl hover:from-accent/90 hover:to-accent/70 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-accent/30 text-sm sm:text-base whitespace-nowrap">
              🚀 3 Dias Grátis
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;