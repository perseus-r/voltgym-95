const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-line bg-surface">
      <div className="container-custom">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">
            <span className="text-red-500">⚡</span>
            <span className="text-white">VOLT</span>
          </div>
          <p className="text-text-2 mb-6">
            Feito com ⚡ para revolucionar seus treinos
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-text-2">
            <a href="/terms" className="hover:text-white transition-colors">
              Termos
            </a>
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacidade  
            </a>
            <a href="/contact" className="hover:text-white transition-colors">
              Contato
            </a>
            <a href="/social" className="hover:text-white transition-colors">
              Redes
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;