// Sistema de Log para capturar e persistir informações de debugging
import { useEffect } from 'react';

interface LogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  stack?: string;
  userAgent?: string;
  url?: string;
}

class DebugLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 500;
  private createLogEntry(level: LogEntry['level'], message: string, stack?: string): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    if (stack) {
      entry.stack = stack;
    }
    
    return entry;
  }

  log(level: LogEntry['level'], message: string, stack?: string) {
    const entry = this.createLogEntry(level, message, stack);
    this.logs.unshift(entry);
    
    // Manter apenas os logs mais recentes
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Salvar no localStorage para persistência
    this.persistLogs();
    
    // Log para console também
    console.log(`🔍 [${level.toUpperCase()}] ${message}`, stack ? { stack } : '');
  }

  error(message: string, error?: Error) {
    this.log('error', message, error?.stack);
  }

  warn(message: string) {
    this.log('warn', message);
  }

  info(message: string) {
    this.log('info', message);
  }

  debug(message: string) {
    this.log('debug', message);
  }

  private persistLogs() {
    try {
      localStorage.setItem('debug_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.warn('Falha ao salvar logs no localStorage:', error);
    }
  }

  loadPersistedLogs() {
    try {
      const stored = localStorage.getItem('debug_logs');
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Falha ao carregar logs do localStorage:', error);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('debug_logs');
    console.log('🗑️ Logs limpos');
  }

  exportLogs(): string {
    const exportData = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      logs: this.logs
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  downloadLogs() {
    const data = this.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('📥 Logs exportados para download');
  }

  getErrorSummary() {
    const errorCount = this.logs.filter(log => log.level === 'error').length;
    const warnCount = this.logs.filter(log => log.level === 'warn').length;
    const recentErrors = this.logs.filter(log => 
      log.level === 'error' && 
      new Date(log.timestamp) > new Date(Date.now() - 5 * 60 * 1000) // últimos 5 minutos
    );

    return {
      totalErrors: errorCount,
      totalWarnings: warnCount,
      recentErrors: recentErrors.length,
      totalLogs: this.logs.length
    };
  }
}

// Instância global do logger
export const debugLogger = new DebugLogger();

// Hook para integrar o logger com React
export const useDebugLogger = () => {
  useEffect(() => {
    // Carregar logs persistidos na inicialização
    debugLogger.loadPersistedLogs();
    
    // Interceptar console methods
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    console.error = (...args) => {
      originalError.apply(console, args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      debugLogger.error(message);
    };

    console.warn = (...args) => {
      originalWarn.apply(console, args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      debugLogger.warn(message);
    };

    console.info = (...args) => {
      originalInfo.apply(console, args);
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      debugLogger.info(message);
    };

    // Interceptar erros globais
    const handleGlobalError = (event: ErrorEvent) => {
      debugLogger.error(
        `Erro global: ${event.message} em ${event.filename}:${event.lineno}:${event.colno}`,
        new Error(event.message)
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      debugLogger.error(
        `Promise rejeitada: ${event.reason}`,
        event.reason instanceof Error ? event.reason : new Error(String(event.reason))
      );
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Expor logger globalmente para uso em desenvolvimento
    (window as any).debugLogger = debugLogger;

    // Log de inicialização
    debugLogger.info('Sistema de debug logger inicializado');

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return debugLogger;
};

export default useDebugLogger;
