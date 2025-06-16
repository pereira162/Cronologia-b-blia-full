// BibleVerseModal.tsx
// Material Design 3 Modal component for displaying Bible verses
// Follows Material Design 3 guidelines for dialogs and modals

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useBibleApi } from '../hooks';

interface BibleVerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  reference?: string;
  theme: any; // Will be properly typed when theme system is updated
}

export const BibleVerseModal: React.FC<BibleVerseModalProps> = ({
  isOpen,
  onClose,
  reference,
  theme
}) => {
  const { verse, loading, error, fetchVerse } = useBibleApi();

  React.useEffect(() => {
    if (isOpen && reference) {
      fetchVerse(reference);
    }
  }, [isOpen, reference, fetchVerse]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/32" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md mx-4 rounded-3xl shadow-xl"
        style={{ 
          backgroundColor: theme.colors.surface,
          color: theme.colors.onSurface 
        }}
      >
        {/* Header */}        <div className="flex items-center justify-between p-6 pb-0">
          <h2 
            className="md-title-large text-theme-card-header"
          >
            {reference || 'Versículo Bíblico'}
          </h2>
          
          <button
            onClick={onClose}
            className="md-interactive p-2 rounded-full transition-colors duration-200 text-theme-text hover:text-theme-accent"
            aria-label="Fechar"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 pt-4">          {loading && (
            <div className="flex items-center justify-center py-8">
              <div 
                className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: theme.colors.primary }}
              />
              <span 
                className="ml-3 md-body-medium text-theme-text"
              >
                Carregando versículo...
              </span>
            </div>
          )}
            {error && (
            <div 
              className="p-4 rounded-xl"
              style={{ 
                backgroundColor: theme.colors.errorContainer,
                color: theme.colors.onErrorContainer 
              }}
            >
              <p className="md-body-medium">
                Erro ao carregar versículo: {error}
              </p>
              <p 
                className="mt-2 md-label-medium"
                style={{ 
                  color: theme.colors.onErrorContainer 
                }}
              >
                Verifique a referência e tente novamente.
              </p>
            </div>
          )}
          
          {verse && (
            <div className="space-y-4">              {/* Translation info */}
              {verse.translation_name && (
                <p 
                  className="md-label-medium text-theme-text"
                >
                  {verse.translation_name}
                </p>
              )}
              
              {/* Verse text */}
              <div 
                className="p-4 rounded-xl leading-relaxed md-body-large"
                style={{ 
                  backgroundColor: theme.colors.surfaceContainer,
                  color: theme.colors.onSurface
                }}
              >
                {verse.text}
              </div>
              
              {/* Reference */}
              <p 
                className="text-right font-medium md-label-large"
                style={{ 
                  color: theme.colors.primary 
                }}
              >
                {verse.reference}
              </p>
            </div>
          )}
        </div>
          {/* Actions */}
        <div className="flex justify-end gap-2 p-6 pt-0">
          <button
            onClick={onClose}
            className="md-interactive px-6 py-2 rounded-full font-medium transition-all duration-200 md-label-large"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.onPrimary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primaryContainer;
              e.currentTarget.style.color = theme.colors.onPrimaryContainer;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
              e.currentTarget.style.color = theme.colors.onPrimary;
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
