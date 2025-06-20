// Componente para exibir erros críticos na tela principal
import React, { useState, useEffect } from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface CriticalError {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  source: 'console' | 'react' | 'promise' | 'runtime';
}

interface ErrorDisplayProps {
  theme: any;
  onErrorsChange?: (count: number) => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ theme, onErrorsChange }) => {
  const [errors, setErrors] = useState<CriticalError[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Global error handler
    const handleGlobalError = (event: ErrorEvent) => {
      const error: CriticalError = {
        id: `runtime-${Date.now()}`,
        message: `${event.message} at ${event.filename}:${event.lineno}:${event.colno}`,
        stack: event.error?.stack,
        timestamp: new Date(),
        source: 'runtime'
      };
      
      addError(error);
    };

    // Unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error: CriticalError = {
        id: `promise-${Date.now()}`,
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: new Date(),
        source: 'promise'
      };
      
      addError(error);
    };

    // Console error interceptor
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');

      const error: CriticalError = {
        id: `console-${Date.now()}`,
        message,
        timestamp: new Date(),
        source: 'console'
      };
      
      addError(error);
    };    // Expor função globalmente para ser chamada pelo Error Boundary
    (window as any).reportReactError = (error: Error) => {
      const criticalError: CriticalError = {
        id: `react-${Date.now()}`,
        message: error.message,
        stack: error.stack || undefined,
        timestamp: new Date(),
        source: 'react'
      };
      
      addError(criticalError);
    };

    // Expor função para abrir console monitor
    (window as any).openConsoleMonitor = () => {
      setIsVisible(true);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      delete (window as any).reportReactError;
      delete (window as any).openConsoleMonitor;
    };
  }, []);

  const addError = (error: CriticalError) => {
    setErrors(prev => {
      const updated = [error, ...prev].slice(0, 50); // Manter apenas 50 erros
      
      // Auto mostrar se é um erro crítico
      if (!isVisible && (error.source === 'react' || error.source === 'runtime')) {
        setIsVisible(true);
      }
      
      if (onErrorsChange) {
        onErrorsChange(updated.length);
      }
      
      return updated;
    });
  };

  const clearErrors = () => {
    setErrors([]);
    if (onErrorsChange) {
      onErrorsChange(0);
    }
  };

  const getSourceColor = (source: CriticalError['source']) => {
    switch (source) {
      case 'react': return 'bg-red-100 text-red-800 border-red-300';
      case 'runtime': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'promise': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'console': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  const getSourceIcon = () => {
    return <ExclamationTriangleIcon className="w-4 h-4" />;
  };

  if (!isVisible && errors.length === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Error Button */}
      {!isVisible && errors.length > 0 && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed top-4 right-4 z-50 p-3 bg-red-500 text-white rounded-full shadow-lg animate-pulse"
          title={`${errors.length} erro(s) detectado(s)`}
        >
          <ExclamationTriangleIcon className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {errors.length > 9 ? '9+' : errors.length}
          </span>
        </button>
      )}

      {/* Error Panel */}
      {isVisible && (
        <div className="fixed top-4 right-4 w-96 max-h-96 z-50 shadow-2xl rounded-lg overflow-hidden"
             style={{ 
               backgroundColor: theme.colors.surface,
               border: `2px solid ${theme.colors.error}`
             }}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b"
               style={{ 
                 backgroundColor: theme.colors.errorContainer,
                 borderColor: theme.colors.error 
               }}>
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5" style={{ color: theme.colors.onErrorContainer }} />
              <h3 className="font-semibold text-sm" style={{ color: theme.colors.onErrorContainer }}>
                Erros Detectados ({errors.length})
              </h3>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={clearErrors}
                className="p-1 text-xs px-2 rounded transition-colors"
                style={{ 
                  backgroundColor: theme.colors.error,
                  color: theme.colors.onError 
                }}
                title="Limpar erros"
              >
                Limpar
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 rounded transition-colors"
                style={{ color: theme.colors.onErrorContainer }}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Error List */}
          <div className="max-h-80 overflow-y-auto p-2">
            {errors.length === 0 ? (
              <div className="text-center text-sm py-4" style={{ color: theme.colors.onSurfaceVariant }}>
                Nenhum erro detectado
              </div>
            ) : (
              errors.map((error) => (
                <div
                  key={error.id}
                  className={`mb-2 p-2 rounded text-xs border-l-4 ${getSourceColor(error.source)}`}
                >                  <div className="flex items-start gap-2">
                    {getSourceIcon()}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold uppercase text-xs">
                          {error.source}
                        </span>
                        <span className="text-xs opacity-70">
                          {error.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <pre className="whitespace-pre-wrap break-words font-mono text-xs mb-1">
                        {error.message}
                      </pre>
                      {error.stack && (
                        <details className="mt-1">
                          <summary className="cursor-pointer text-xs opacity-70">
                            Stack trace
                          </summary>
                          <pre className="whitespace-pre-wrap break-words font-mono text-xs mt-1 opacity-60">
                            {error.stack}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorDisplay;
