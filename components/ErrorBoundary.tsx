// Error Boundary para capturar erros React
import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Error Boundary capturou um erro:', error);
    console.error('📍 Informações do erro:', errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Callback opcional para notificar erros
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Reportar erro para o sistema global
    if (typeof window !== 'undefined' && (window as any).reportReactError) {
      (window as any).reportReactError(error);
    }

    // Força a abertura do console monitor se disponível
    if (typeof window !== 'undefined' && (window as any).openConsoleMonitor) {
      (window as any).openConsoleMonitor();
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '20px',
          background: '#ffebee',
          border: '2px solid #f44336',
          borderRadius: '8px',
          margin: '20px',
          fontFamily: 'monospace'
        }}>
          <h2 style={{ color: '#d32f2f', marginBottom: '10px' }}>
            🚨 Erro na Aplicação
          </h2>
          
          <details style={{ marginBottom: '10px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Detalhes do Erro
            </summary>
            <pre style={{ 
              background: '#fff', 
              padding: '10px', 
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {this.state.error && this.state.error.toString()}
            </pre>
          </details>

          {this.state.errorInfo && (
            <details>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Stack Trace
              </summary>
              <pre style={{ 
                background: '#fff', 
                padding: '10px', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '10px'
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Tentar Novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
