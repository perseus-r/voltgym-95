import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
}

export function useErrorBoundary() {
  const [error, setError] = useState<ErrorInfo | null>(null);

  const captureError = useCallback((error: Error, errorInfo?: { componentStack: string }) => {
    const errorDetails: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack
    };

    setError(errorDetails);
    
    // Log to console for debugging
    console.error('🔥 Error captured:', error);
    console.error('Component stack:', errorInfo?.componentStack);

    // Show user-friendly message
    toast.error('Algo deu errado. Tente novamente.');

    // In production, you could send to error reporting service
    // reportError(errorDetails);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetErrorBoundary = useCallback(() => {
    setError(null);
    window.location.reload();
  }, []);

  return {
    error,
    captureError,
    clearError,
    resetErrorBoundary,
    hasError: error !== null
  };
}