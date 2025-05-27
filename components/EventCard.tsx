// components/EventCard.tsx
// Componente React para exibir um card (modal) com informações detalhadas sobre um evento bíblico.

import React from 'react';
import { BibleEvent, Person } from '../types'; // Importa os tipos BibleEvent e Person
import { peopleData } from '../data'; // Importa os dados de todas as pessoas para encontrar os participantes
import { FONT_SIZE_CLASSES, SEMANTIC_COLOR_VARS, Z_INDICES } from '../stylingConstants'; // Importa constantes de estilização

// Props esperadas pelo componente EventCard
interface EventCardProps {
  event: BibleEvent | null; // O objeto BibleEvent a ser exibido, ou null se nenhum evento estiver selecionado
  onClose: () => void;      // Função para fechar o card
  onSelectPerson: (person: Person) => void; // Função para selecionar um personagem (ex: ao clicar no nome de um participante)
}

const EventCard: React.FC<EventCardProps> = ({ event, onClose, onSelectPerson }) => {
  // Se não houver evento selecionado (event é null), não renderiza nada.
  if (!event) return null;

  // Filtra os dados de pessoas para encontrar os participantes do evento atual.
  const participants = peopleData.filter(person => event.characterIds.includes(person.id));

  return (
    // Container principal do modal, cobre toda a tela com um fundo semi-transparente.
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4" 
      style={{zIndex: Z_INDICES.modals}} // Garante que o modal fique acima de outros elementos
      onClick={onClose} // Fecha o modal ao clicar fora da área do card (no overlay)
    >
      {/* Conteúdo do card, com prevenção de propagação de clique */}
      <div 
        className="p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" 
        style={{
          backgroundColor: SEMANTIC_COLOR_VARS.cardBg, 
          borderColor: SEMANTIC_COLOR_VARS.borderColor, 
          borderWidth: '1px'
        }}
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do card feche o modal
      >
        {/* Cabeçalho do card: Nome do evento e botão de fechar */}
        <div className="flex justify-between items-center mb-4">
          <h2 
            className={`${FONT_SIZE_CLASSES['3xl']} font-bold`} 
            style={{color: SEMANTIC_COLOR_VARS.cardHeaderColor}} // Nome do evento
          >
            {event.name}
          </h2>
          <button 
            onClick={onClose} // Botão para fechar o card
            className={`hover:text-white ${FONT_SIZE_CLASSES['2xl']}`} 
            style={{color: SEMANTIC_COLOR_VARS.textColor}} // Estilo do botão de fechar (um 'X')
          >
            &times;
          </button>
        </div>

        {/* Informações adicionais: Ano do evento e Capítulos de Gênesis */}
        {event.year !== undefined && <p className={`${FONT_SIZE_CLASSES.sm} mb-1`} style={{color: SEMANTIC_COLOR_VARS.accentColor}}>Ano (Relativo Adão=0): {event.year}</p>}
        {event.genesisChapter && <p className={`${FONT_SIZE_CLASSES.sm} mb-3`} style={{color: SEMANTIC_COLOR_VARS.textColor}}>Gênesis Capítulos: {event.genesisChapter}</p>}
        
        {/* Descrição do evento */}
        <p className="mb-4 p-3 rounded" style={{backgroundColor: SEMANTIC_COLOR_VARS.appBg, color: SEMANTIC_COLOR_VARS.textColor}}>{event.description}</p>
        
        {/* Lista de participantes do evento */}
        {participants.length > 0 && (
          <div className="mt-4">
            <h3 className={`${FONT_SIZE_CLASSES.xl} font-semibold mb-2`} style={{color: SEMANTIC_COLOR_VARS.cardHeaderColor}}>Participantes:</h3>
            <ul className={`list-disc list-inside space-y-1 ${FONT_SIZE_CLASSES.sm}`}>
              {participants.map(person => (
                <li key={person.id}>
                  {/* Botão para selecionar o personagem e ver seus detalhes */}
                  <button 
                    onClick={() => { 
                      onClose(); // Fecha o card do evento atual
                      onSelectPerson(person); // Abre o card do personagem selecionado
                    }} 
                    className="underline hover:opacity-75" // Estilo de link
                    style={{color: SEMANTIC_COLOR_VARS.accentColor}}
                  >
                    {person.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Botão principal de ação para fechar o card */}
         <button 
          onClick={onClose} 
          className="mt-6 text-white font-semibold py-2 px-4 rounded w-full transition-colors duration-150"
          style={{backgroundColor: SEMANTIC_COLOR_VARS.buttonBg}}
          // Efeitos de hover para o botão
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonHoverBg}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonBg}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default EventCard;