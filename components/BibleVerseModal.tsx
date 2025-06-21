// BibleVerseModal.tsx
// Material Design 3 Modal component for displaying Bible verses
// Updated to use the new Bible Digital API

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useBibleApi } from '../hooks/useBibleApi';

interface BibleVerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  reference?: string;
  theme?: any; // Made optional since it's not currently used
}

export const BibleVerseModal: React.FC<BibleVerseModalProps> = ({
  isOpen,
  onClose,
  reference
}) => {
  const [selectedVersion, setSelectedVersion] = React.useState('acf');
  const { loading, error, currentReference, fetchByReference } = useBibleApi();

  // Versões disponíveis da Bíblia
  const availableVersions = [
    { id: 'nvi', name: 'Nova Versão Internacional (NVI)' },
    { id: 'acf', name: 'Almeida Corrigida Fiel (ACF)' }
  ];
  const currentVersionObj = availableVersions.find(v => v.id === selectedVersion);
  // Buscar conteúdo quando modal abrir ou referência/versão mudar
  React.useEffect(() => {
    if (isOpen && reference) {
      fetchByReference(reference, selectedVersion);
    }
  }, [isOpen, reference, selectedVersion, fetchByReference]);
  const handleVersionChange = (versionId: string) => {
    setSelectedVersion(versionId);
    if (reference) {
      fetchByReference(reference, versionId);
    }
  };

  // Fechar modal ao pressionar ESC
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);  if (!isOpen) return null;

  // ...existing code...


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
        className="relative bg-theme-card-bg rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bible-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-theme-border">
          <h2 id="bible-modal-title" className="text-xl font-semibold text-theme-header-text">
            {reference || 'Versículo Bíblico'}
          </h2>
          
          <div className="flex items-center space-x-4">
            {/* Seletor de versão */}
            <select
              value={selectedVersion}
              onChange={(e) => handleVersionChange(e.target.value)}
              className="px-3 py-2 rounded-lg border border-theme-border bg-theme-card-bg text-theme-text focus:border-theme-accent focus:outline-none"
            >
              {availableVersions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.id.toUpperCase()}
                </option>
              ))}
            </select>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-colors duration-200 text-theme-text hover:text-theme-accent hover:bg-theme-app-bg"
              aria-label="Fechar"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-t-transparent border-theme-accent rounded-full animate-spin" />
              <span className="ml-3 text-theme-text">
                Carregando versículo...
              </span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800">
              <p className="font-medium">Erro ao carregar versículo:</p>
              <p className="mt-1">{error}</p>
              <p className="mt-2 text-sm text-red-600">
                Verifique a referência e tente novamente.
              </p>
            </div>
          )}          {currentReference && (
            <div className="space-y-4">
              {/* Cabeçalho da referência */}
              <div className="border-b border-theme-border pb-3">                <h3 className="text-xl font-semibold text-theme-header-text">
                  {currentReference.book.name}
                </h3>
                <p className="text-sm text-theme-text opacity-75">
                  {currentReference.totalVerses || 1} versículo{(currentReference.totalVerses || 1) > 1 ? 's' : ''} • {currentReference.book.author || 'Autor desconhecido'}
                </p>
              </div>              {/* Conteúdo */}
              <div className="space-y-6">
                {currentReference.chapters.map((chapter, chapterIndex) => (
                  <div key={chapterIndex}>
                    {/* Cabeçalho do capítulo */}
                    <div className="mb-4 p-3 rounded-lg bg-theme-accent/10 border border-theme-accent/20">
                      <h4 className="text-lg font-semibold text-theme-accent mb-1">
                        {currentReference.book.name} - Capítulo {chapter.number}
                      </h4>
                      <p className="text-sm text-theme-text opacity-75">
                        {chapter.verses.length} versículo{chapter.verses.length > 1 ? 's' : ''} • {selectedVersion.toUpperCase()} - {currentReference.versionName || currentVersionObj?.name}
                      </p>
                      {currentReference.book.author && (
                        <p className="text-sm text-theme-text opacity-75 mt-1">
                          Autor: {currentReference.book.author} • {currentReference.book.group}
                        </p>
                      )}
                    </div>
                    
                    {/* Versículos */}
                    <div className="p-4 rounded-xl bg-theme-app-bg border border-theme-border">
                      {chapter.verses.map((verse, verseIndex) => (
                        <div key={verseIndex} className="mb-3 last:mb-0">
                          <p className="text-lg text-theme-text leading-relaxed">
                            <span className="font-bold text-theme-accent mr-2">
                              {verse.number}
                            </span>
                            {verse.text.replace(/^"|"$/g, '')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Rodapé da referência */}
              <div className="border-t border-theme-border pt-3">
                <span className="text-sm text-theme-text opacity-75">
                  {selectedVersion.toUpperCase()} - {currentReference.versionName || currentVersionObj?.name} • {currentReference.book.group}
                </span>
              </div>
            </div>
          )}          {!loading && !error && !currentReference && reference && (
            <div className="text-center py-8">
              <p className="text-theme-text opacity-75">
                Nenhum resultado encontrado para "{reference}"
              </p>
              <p className="text-sm text-theme-text opacity-50 mt-2">
                Tente referências como: "gn 1:1", "gn 1:1-5", "gn 1-3", "joão 3:16"
              </p>
            </div>
          )}

          {!reference && !loading && (
            <div className="text-center py-8">
              <p className="text-theme-text opacity-75">
                Clique em uma referência bíblica para visualizar o versículo
              </p>
              <p className="text-sm text-theme-text opacity-50 mt-2">
                Suporta: versículos únicos, sequências e capítulos completos
              </p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-theme-border">
          <div className="flex justify-between items-center">
            <p className="text-xs text-theme-text opacity-50">
              Fonte: A Bíblia Digital • abibliadigital.com.br
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-theme-accent text-white hover:opacity-90 transition-opacity"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibleVerseModal;