// Console Monitor Component - Para visualizar erros automaticamente
// Componente para capturar e exibir erros de console em tempo real

import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ConsoleMessage {
  id: string;
  type: 'error' | 'warn' | 'info' | 'log';
  message: string;
  timestamp: Date;
  stack?: string;
  count: number;
}

interface ConsoleMonitorProps {
  isVisible: boolean;
  onToggle: () => void;
  onErrorCountChange?: (count: number) => void;
  maxMessages?: number;
  theme: any;
}

export const ConsoleMonitor: React.FC<ConsoleMonitorProps> = ({
  isVisible,
  onToggle,
  onErrorCountChange,
  maxMessages = 100,
  theme
}) => {
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);
  const [filter, setFilter] = useState<'all' | 'error' | 'warn' | 'info'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reportar contagem de erros para o componente pai
  useEffect(() => {
    if (onErrorCountChange) {
      const errorCount = messages.filter(m => m.type === 'error').reduce((sum, m) => sum + m.count, 0);
      onErrorCountChange(errorCount);
    }
  }, [messages, onErrorCountChange]);
  useEffect(() => {
    // Capturar console.error
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;
    const originalInfo = console.info;

    const addMessage = (type: ConsoleMessage['type'], args: any[]) => {
      const message = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');

      const messageId = `${type}-${message}`;
      
      setMessages(prev => {
        const existingIndex = prev.findIndex(m => m.id === messageId);
        
        if (existingIndex >= 0) {
          // Incrementar contador se mensagem já existe
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            count: updated[existingIndex].count + 1,
            timestamp: new Date()
          };
          return updated;
        } else {
          // Adicionar nova mensagem
          const newMessage: ConsoleMessage = {
            id: messageId,
            type,
            message,
            timestamp: new Date(),
            stack: type === 'error' && args[0]?.stack ? args[0].stack : undefined,
            count: 1
          };
          
          const updated = [...prev, newMessage];
          
          // Auto-abrir o monitor em caso de erro
          if (type === 'error' && !isVisible) {
            onToggle();
          }
          
          return updated.slice(-maxMessages); // Manter apenas as últimas N mensagens
        }
      });
    };

    console.error = (...args) => {
      originalError.apply(console, args);
      addMessage('error', args);
    };

    console.warn = (...args) => {
      originalWarn.apply(console, args);
      addMessage('warn', args);
    };

    console.info = (...args) => {
      originalInfo.apply(console, args);
      addMessage('info', args);
    };

    console.log = (...args) => {
      originalLog.apply(console, args);
      addMessage('log', args);
    };

    // Capturar erros não tratados
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addMessage('error', [`Unhandled Promise Rejection: ${event.reason}`]);
    };

    const handleError = (event: ErrorEvent) => {
      addMessage('error', [`${event.message} at ${event.filename}:${event.lineno}:${event.colno}`]);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
      console.info = originalInfo;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, [maxMessages]);

  const clearMessages = () => {
    setMessages([]);
  };

  const getIcon = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      case 'warn':
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="w-4 h-4 text-blue-500" />;
      case 'log':
        return <CheckCircleIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'warn':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'log':
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredMessages = messages.filter(msg => 
    filter === 'all' || msg.type === filter
  );

  const errorCount = messages.filter(m => m.type === 'error').length;
  const warnCount = messages.filter(m => m.type === 'warn').length;

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className={`fixed bottom-4 right-4 p-3 rounded-full shadow-lg transition-all duration-200 z-50 ${
          errorCount > 0 ? 'bg-red-500 text-white animate-pulse' : 
          warnCount > 0 ? 'bg-yellow-500 text-white' : 
          'bg-gray-500 text-white'
        }`}
        title={`Console: ${errorCount} erros, ${warnCount} avisos`}
      >
        <div className="relative">
          <ExclamationTriangleIcon className="w-6 h-6" />
          {(errorCount > 0 || warnCount > 0) && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {errorCount + warnCount > 9 ? '9+' : errorCount + warnCount}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 shadow-2xl rounded-lg overflow-hidden z-50"
         style={{ 
           backgroundColor: theme.colors.surface,
           border: `1px solid ${theme.colors.outline}`
         }}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b"
           style={{ 
             backgroundColor: theme.colors.surfaceContainer,
             borderColor: theme.colors.outline 
           }}>
        <div className="flex items-center gap-2">
          <ExclamationTriangleIcon className="w-5 h-5" style={{ color: theme.colors.primary }} />
          <h3 className="font-semibold text-sm" style={{ color: theme.colors.onSurface }}>
            Console Monitor
          </h3>
          <span className="text-xs px-2 py-1 rounded" 
                style={{ 
                  backgroundColor: theme.colors.primaryContainer,
                  color: theme.colors.onPrimaryContainer 
                }}>
            {filteredMessages.length}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={clearMessages}
            className="p-1 text-xs px-2 rounded transition-colors"
            style={{ 
              backgroundColor: theme.colors.surfaceContainer,
              color: theme.colors.onSurface 
            }}
            title="Limpar"
          >
            Clear
          </button>
          <button
            onClick={onToggle}
            className="p-1 rounded transition-colors"
            style={{ color: theme.colors.onSurface }}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 p-2 border-b text-xs"
           style={{ borderColor: theme.colors.outline }}>
        {(['all', 'error', 'warn', 'info'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-2 py-1 rounded transition-colors ${
              filter === type ? 'font-semibold' : ''
            }`}
            style={{
              backgroundColor: filter === type ? theme.colors.primary : 'transparent',
              color: filter === type ? theme.colors.onPrimary : theme.colors.onSurface
            }}
          >
            {type} {type !== 'all' && `(${messages.filter(m => m.type === type).length})`}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 h-64">
        {filteredMessages.length === 0 ? (
          <div className="text-center text-sm py-8" style={{ color: theme.colors.onSurfaceVariant }}>
            Nenhuma mensagem {filter !== 'all' ? `do tipo ${filter}` : ''}
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={`${msg.id}-${msg.timestamp.getTime()}`}
              className={`mb-2 p-2 rounded text-xs border-l-4 ${getTypeColor(msg.type)}`}
            >
              <div className="flex items-start gap-2">
                {getIcon(msg.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold uppercase">{msg.type}</span>
                    {msg.count > 1 && (
                      <span className="bg-gray-200 text-gray-700 px-1 rounded text-xs">
                        {msg.count}x
                      </span>
                    )}
                    <span className="text-gray-500 text-xs">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap break-words font-mono text-xs">
                    {msg.message}
                  </pre>
                  {msg.stack && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs">Stack trace</summary>
                      <pre className="whitespace-pre-wrap break-words font-mono text-xs mt-1 text-gray-600">
                        {msg.stack}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ConsoleMonitor;
