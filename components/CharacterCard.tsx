// components/CharacterCard.tsx
// Componente React para exibir um card (modal) com informações detalhadas sobre um personagem bíblico.
// ATUALIZADO: Material Design 3 e integração com sistema de versículos bíblicos

import React from 'react';
import { Person } from '../types';
import { eventsData, peopleData } from '../data'; // Importa os dados de todos os eventos para encontrar os relacionados
import { Z_INDICES } from '../stylingConstants'; // Importa constantes de estilização
import { XMarkIcon } from '@heroicons/react/24/outline';
import { MaterialButton } from './MaterialButton';

// Props esperadas pelo componente CharacterCard
interface CharacterCardProps {
  person: Person | null; // O objeto Person a ser exibido, ou null se nenhum personagem estiver selecionado
  onClose: () => void;   // Função para fechar o card
  onBibleReferenceClick?: (reference: string) => void; // Função para abrir versículo bíblico
}

const CharacterCard: React.FC<CharacterCardProps> = ({ person, onClose, onBibleReferenceClick }) => {
  // Se não houver personagem selecionado (person é null), não renderiza nada.
  if (!person) return null;

  // Filtra os eventos bíblicos para encontrar aqueles que incluem o ID do personagem atual.
  const relatedEvents = eventsData.filter(event => event.characterIds.includes(person.id));
  // Helper function to create clickable Bible references
  const renderBibleReference = (reference: string) => {
    if (!reference || !onBibleReferenceClick) {
      return reference;
    }
    
    // Check if reference contains bible book names (not just a chapter number)
    const hasBibleBook = /\b(gênesis|êxodo|levítico|números|deuteronômio|josué|juízes|rute|samuel|reis|crônicas|esdras|neemias|ester|jó|salmos|provérbios|eclesiastes|cânticos|isaías|jeremias|lamentações|ezequiel|daniel|oséias|joel|amós|obadias|jonas|miquéias|naum|habacuque|sofonias|ageu|zacarias|malaquias|mateus|marcos|lucas|joão|atos|romanos|coríntios|gálatas|efésios|filipenses|colossenses|tessalonicenses|timóteo|tito|filemom|hebreus|tiago|pedro|judas|apocalipse)\b/i.test(reference);
    
    if (hasBibleBook) {
      return (
        <button
          onClick={() => onBibleReferenceClick(reference)}
          className="md-interactive text-blue-600 hover:text-blue-800 underline ml-1"
          title="Clique para ver o versículo"
        >
          {reference}
        </button>
      );
    }
    
    return reference;
  };

  return (
    // Container principal do modal, cobre toda a tela com um fundo semi-transparente.
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4" 
      style={{zIndex: Z_INDICES.modals}} // Garante que o modal fique acima de outros elementos
      onClick={onClose} // Fecha o modal ao clicar fora da área do card (no overlay)
    >
      {/* Conteúdo do card, com prevenção de propagação de clique para não fechar ao clicar dentro */}
      <div 
        className="p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto bg-theme-card-bg border-theme-border border" 
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do card feche o modal
      >        {/* Cabeçalho do card: Nome do personagem e botão de fechar */}
        <div className="flex justify-between items-center mb-4">
          <h2 
            className={`md-headline-medium text-theme-card-header ${person.isCovenantLine ? '' : 'opacity-80'}`} 
          >
            {person.name}
          </h2>
          <button 
            onClick={onClose} // Botão para fechar o card
            className="md-interactive text-theme-text hover:text-theme-accent md-title-medium" 
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>        {/* Informações adicionais: Significado do nome e Referência Bíblica */}
        {person.nameMeaning && <p className="md-label-large italic mb-1 text-theme-accent">Significado: {person.nameMeaning}</p>}
        {person.bibleReference && (
          <p className="md-label-large mb-3 text-theme-text">
            Referência: {renderBibleReference(person.bibleReference)}
          </p>
        )}

        {/* Grid com dados cronológicos: Nascimento, Morte, Tempo de Vida, Idade na Paternidade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 md-body-medium">
          {person.birthYear !== undefined && <div><strong className="text-theme-accent">Nascimento (Relativo Adão=0):</strong> Ano {person.birthYear}</div>}
          {person.deathYear !== undefined && <div><strong className="text-theme-accent">Morte (Relativo Adão=0):</strong> Ano {person.deathYear}</div>}
          {person.totalLifespan !== undefined && <div><strong className="text-theme-accent">Tempo de Vida:</strong> {person.totalLifespan} anos</div>}
          {person.ageAtParenthood !== undefined && <div><strong className="text-theme-accent">Idade ao gerar filho principal:</strong> {person.ageAtParenthood} anos</div>}
        </div>

        {/* Descrição do personagem, se disponível */}
        {person.description && <p className="mb-4 p-3 rounded bg-theme-app-bg text-theme-text md-body-medium">{person.description}</p>}
        
        {/* Informações sobre o pai (poderia ser expandido para outros familiares) */}
        {person.fatherId && <p className="md-body-medium"><strong className="text-theme-accent">Pai:</strong> {peopleData.find(p => p.id === person.fatherId)?.name || person.fatherId}</p>}
        {/* TODO: Adicionar mãe, cônjuges, filhos com links/botões para abrir seus respectivos cards */}        {/* Lista de eventos chave relacionados ao personagem */}
        {relatedEvents.length > 0 && (
          <div className="mt-4">
            <h3 className="md-title-large font-semibold mb-2 text-theme-card-header">Eventos Chave:</h3>            <ul className="list-disc list-inside space-y-1 md-body-medium">
              {relatedEvents.map(event => (
                <li key={event.id} className="text-theme-text">
                  {event.name} {event.genesisChapter && (
                    <span className="text-sm">
                      ({renderBibleReference(`Gênesis ${event.genesisChapter}`)})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Botão principal de ação para fechar o card */}
        <div className="mt-6">
          <MaterialButton
            variant="filled"
            size="medium"
            onClick={onClose}
            className="w-full"
            theme={{ colors: { primary: 'var(--md-primary)', onPrimary: 'var(--md-onPrimary)' } }}
            ariaLabel="Fechar card do personagem"
          >
            Fechar
          </MaterialButton>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;