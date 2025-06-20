// BibleVerseModal.tsx
// Material Design 3 Modal component for displaying Bible verses
// Follows Material Design 3 guidelines for dialogs and modals
// Updated to use the new Bible Digital API

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useBibleDigitalApi } from '../hooks/useBibleDigitalApi';

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
  const { content, loading, error, fetchVerse, getAvailableTranslations } = useBibleDigitalApi();
  const [selectedTranslation, setSelectedTranslation] = React.useState('nvi');
  const availableTranslations = getAvailableTranslations();

  React.useEffect(() => {
    if (isOpen && reference) {
      fetchVerse(reference, selectedTranslation as any);
    }
  }, [isOpen, reference, selectedTranslation, fetchVerse]);

  const handleTranslationChange = (translationId: string) => {
    setSelectedTranslation(translationId);
    if (reference) {
      fetchVerse(reference, translationId as any);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 1000 }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] mx-4 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ 
          backgroundColor: theme.colors.surface,
          color: theme.colors.onSurface 
        }}
      >        {/* Header */}        <div className="flex items-center justify-between p-6 pb-4 border-b" style={{ borderColor: theme.colors.outline }}>
          <div className="flex-1">
            <h2 className="md-title-large text-theme-card-header mb-2">
              {reference || 'Versículo Bíblico'}
            </h2>
            
            {/* Translation Selector */}
            <select 
              value={selectedTranslation}
              onChange={(e) => handleTranslationChange(e.target.value)}
              className="text-sm border rounded px-2 py-1"
              style={{ 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outline,
                color: theme.colors.onSurface
              }}
            >
              {availableTranslations.map(translation => (
                <option key={translation.id} value={translation.id}>
                  {translation.name} ({translation.language})
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={onClose}
            className="md-interactive p-2 rounded-full transition-colors duration-200 text-theme-text hover:text-theme-accent"
            aria-label="Fechar"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">{loading && (
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
          )}            {error && (
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
            {content && (
            <div className="space-y-4">
              {/* Informações da versão */}
              {content.version && (
                <p 
                  className="md-label-medium text-theme-text"
                >
                  {availableTranslations.find(t => t.id === content.version)?.name || content.version.toUpperCase()}
                </p>
              )}
              
              {/* Versículo único */}
              {content.type === 'verse' && content.verse && (
                <div 
                  className="p-4 rounded-xl leading-relaxed md-body-large"
                  style={{ 
                    backgroundColor: theme.colors.surfaceContainer,
                    color: theme.colors.onSurface
                  }}
                >
                  <p className="mb-2">{content.verse.text}</p>
                  <p 
                    className="text-right font-medium md-label-large"
                    style={{ 
                      color: theme.colors.primary 
                    }}
                  >
                    {content.verse.book.name} {content.verse.chapter.number}:{content.verse.number}
                  </p>
                </div>
              )}

              {/* Capítulo completo ou range de versículos */}
              {(content.type === 'chapter' || content.type === 'range') && content.chapter && (
                <div 
                  className="p-4 rounded-xl"
                  style={{ 
                    backgroundColor: theme.colors.surfaceContainer,
                    color: theme.colors.onSurface
                  }}
                >
                  <h3 className="font-bold text-lg mb-3" style={{ color: theme.colors.primary }}>
                    {content.chapter.book.name} {content.chapter.chapter.number}
                  </h3>
                  <div className="space-y-2">
                    {content.chapter.verses.map((verse) => (
                      <p 
                        key={verse.number}
                        className="leading-relaxed md-body-medium"
                      >
                        <span className="font-semibold mr-2" style={{ color: theme.colors.primary }}>
                          {verse.number}
                        </span>
                        {verse.text}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Resultados de busca */}
              {content.type === 'search' && content.verses && (
                <div className="space-y-3">
                  <p className="md-label-medium" style={{ color: theme.colors.primary }}>
                    {content.verses.length} versículo(s) encontrado(s)
                  </p>
                  {content.verses.map((verse, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-lg border-l-4"
                      style={{ 
                        backgroundColor: theme.colors.surfaceContainer,
                        color: theme.colors.onSurface,
                        borderLeftColor: theme.colors.primary
                      }}
                    >
                      <p className="mb-1 leading-relaxed md-body-medium">{verse.text}</p>
                      <p 
                        className="text-sm font-medium"
                        style={{ color: theme.colors.primary }}
                      >
                        {verse.book.name} {verse.chapter.number}:{verse.number}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>          {/* Actions */}
        <div className="flex justify-end gap-2 p-6 pt-4 border-t" style={{ borderColor: theme.colors.outline }}>
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
