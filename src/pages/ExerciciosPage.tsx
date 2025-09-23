import React, { useEffect } from "react";
import { ExerciseLibrary } from "@/components/ExerciseLibrary";

const ExerciciosPage: React.FC = () => {
  useEffect(() => {
    document.title = "Biblioteca de Exercícios | VOLT";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'Explore exercícios por grupos musculares, níveis e dicas de execução.');

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', `${window.location.origin}/exercicios`);
  }, []);

  return (
    <main className="max-w-container mx-auto p-4 md:p-6">
      <h1 className="sr-only">Biblioteca de Exercícios</h1>
      <ExerciseLibrary />
    </main>
  );
};

export default ExerciciosPage;
