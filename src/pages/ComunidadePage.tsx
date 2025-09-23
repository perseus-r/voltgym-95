import React, { useEffect } from "react";
import { EnhancedCommunityFeed } from "@/components/EnhancedCommunityFeed";
import { MobileCommunityFeed } from "@/components/MobileCommunityFeed";
import { useIsMobile } from "@/hooks/use-mobile";

const ComunidadePage: React.FC = () => {
  const isMobile = useIsMobile();
  useEffect(() => {
    // Basic SEO for the page
    document.title = "Comunidade Fitness Inteligente | VOLT";

    const metaDescId = "meta-desc-comunidade";
    let meta = document.querySelector(`meta[name="description"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "Comunidade fitness inteligente com IA: feed personalizado, dicas e insights para seus treinos.");

    const canonicalId = "canonical-comunidade";
    let link = document.querySelector(`link[rel="canonical"]`);
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", `${window.location.origin}/comunidade`);
  }, []);

  return (
    <>
      {isMobile ? (
        <MobileCommunityFeed />
      ) : (
        <main className="max-w-container mx-auto p-4 sm:p-6">
          <header className="mb-4">
            <h1 className="text-xl sm:text-2xl font-semibold text-txt">Comunidade</h1>
            <p className="text-sm text-txt-3">
              Feed público da comunidade VOLT - conecte-se, compartilhe e inspire-se com outros atletas.
            </p>
          </header>
          <section>
            <EnhancedCommunityFeed />
          </section>
        </main>
      )}
    </>
  );
};

export default ComunidadePage;
