import React, { useEffect } from 'react';
import { clearSharedData } from '@/lib/storage';

const SecurityCleanup: React.FC = () => {
  useEffect(() => {
    // Executar limpeza de segurança na inicialização
    clearSharedData();
  }, []);

  return null; // Componente invisível
};

export default SecurityCleanup;