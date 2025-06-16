// components/EventCard.tsx
// Componente React para exibir um card (modal) com informações detalhadas sobre um evento bíblico.
// ATUALIZADO: Material Design 3 e integração com sistema de versículos bíblicos

import React from 'react';
import { BibleEvent, Person } from '../types'; // Importa os tipos BibleEvent e Person
import { peopleData } from '../data'; // Importa os dados de todas as pessoas para encontrar os participantes
import { Z_INDICES } from '../stylingConstants'; // Importa constantes de estilização
import { XMarkIcon } from '@heroicons/react/24/outline';
import { MaterialButton } from './MaterialButton';

// Props esperadas pelo componente EventCard
interface EventCardProps {
  event: BibleEvent | null; // O objeto BibleEvent a ser exibido, ou null se nenhum evento estiver selecionado
  onClose: () => void;      // Função para fechar o card
  onSelectPerson: (person: Person) => void; // Função para selecionar um personagem (ex: ao clicar no nome de um participante)
  onBibleReferenceClick?: (reference: string) => void; // Função para abrir versículo bíblico
}

const EventCard: React.FC<EventCardProps> = ({ event, onClose, onSelectPerson, onBibleReferenceClick }) => {
  // Se não houver evento selecionado (event é null), não renderiza nada.
  if (!event) return null;

  // Filtra os dados de pessoas para encontrar os participantes do evento atual.
  const participants = peopleData.filter(person => event.characterIds.includes(person.id));

  // Helper function to create clickable Bible references
  const renderBibleReference = (chapter: string | number) => {
    if (!chapter || !onBibleReferenceClick) {
      return ` (Gênesis ${chapter})`;
    }
      return (
      <button
        onClick={() => onBibleReferenceClick(`Genesis ${chapter}`)}
        className="md-interactive text-blue-600 hover:text-blue-800 underline ml-1"
        title="Clique para ver o versículo"
      >
        (Gênesis {chapter})
      </button>
    );
  };

  return (
    // Container principal do modal, cobre toda a tela com um fundo semi-transparente.
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4" 
      style={{zIndex: Z_INDICES.modals}} // Garante que o modal fique acima de outros elementos
      onClick={onClose} // Fecha o modal ao clicar fora da área do card (no overlay)
    >
      {/* Conteúdo do card, com prevenção de propagação de clique */}
      <div 
        className="p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto bg-theme-card-bg border-theme-border border"
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do card feche o modal
      >        {/* Cabeçalho do card: Nome do evento e botão de fechar */}
        <div className="flex justify-between items-center mb-4">
          <h2 
            className="md-headline-medium text-theme-card-header"
          >
            {event.name}
          </h2>
          <button 
            onClick={onClose} // Botão para fechar o card
            className="md-interactive text-theme-text hover:text-theme-accent md-title-medium"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>        {/* Informações adicionais: Ano do evento e Capítulos de Gênesis */}
        {event.year !== undefined && <p className="md-label-large mb-1 text-theme-accent">Ano (Relativo Adão=0): {event.year}</p>}
        {event.genesisChapter && (
          <p className="md-label-large mb-3 text-theme-text">
            Gênesis Capítulos: 
            {renderBibleReference(event.genesisChapter)}
          </p>
        )}
        
        {/* Descrição do evento */}
        <p className="mb-4 p-3 rounded bg-theme-app-bg text-theme-text md-body-medium">{event.description}</p>
          {/* Lista de participantes do evento */}
        {participants.length > 0 && (
          <div className="mt-4">
            <h3 className="md-title-large font-semibold mb-2 text-theme-card-header">Participantes:</h3>
            <ul className="list-disc list-inside space-y-1 md-body-medium">
              {participants.map(person => (
                <li key={person.id}>
                  {/* Botão para selecionar o personagem e ver seus detalhes */}
                  <button 
                    onClick={() => { 
                      onClose(); // Fecha o card do evento atual
                      onSelectPerson(person); // Abre o card do personagem selecionado
                    }} 
                    className="md-interactive underline hover:opacity-75 text-theme-accent"
                  >
                    {person.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}{/* Botão principal de ação para fechar o card */}
        <div className="mt-6">
          <MaterialButton
            variant="filled"
            size="medium"
            onClick={onClose}
            className="w-full"
            theme={{ colors: { primary: 'var(--md-primary)', onPrimary: 'var(--md-onPrimary)' } }}
            ariaLabel="Fechar card do evento"
          >
            Fechar
          </MaterialButton>
        </div>
      </div>
    </div>
  );
};

export default EventCard;