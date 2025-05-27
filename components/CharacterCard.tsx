// components/CharacterCard.tsx
// Componente React para exibir um card (modal) com informações detalhadas sobre um personagem bíblico.

import React from 'react';
import { Person, BibleEvent } from '../types'; // Importa os tipos Person e BibleEvent
// Fix: Import peopleData from ../data
import { eventsData, peopleData } from '../data'; // Importa os dados de todos os eventos para encontrar os relacionados
import { FONT_SIZE_CLASSES, SEMANTIC_COLOR_VARS, Z_INDICES } from '../stylingConstants'; // Importa constantes de estilização

// Props esperadas pelo componente CharacterCard
interface CharacterCardProps {
  person: Person | null; // O objeto Person a ser exibido, ou null se nenhum personagem estiver selecionado
  onClose: () => void;   // Função para fechar o card
}

const CharacterCard: React.FC<CharacterCardProps> = ({ person, onClose }) => {
  // Se não houver personagem selecionado (person é null), não renderiza nada.
  if (!person) return null;

  // Filtra os eventos bíblicos para encontrar aqueles que incluem o ID do personagem atual.
  const relatedEvents = eventsData.filter(event => event.characterIds.includes(person.id));

  return (
    // Container principal do modal, cobre toda a tela com um fundo semi-transparente.
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4" 
      style={{zIndex: Z_INDICES.modals}} // Garante que o modal fique acima de outros elementos
      onClick={onClose} // Fecha o modal ao clicar fora da área do card (no overlay)
    >
      {/* Conteúdo do card, com prevenção de propagação de clique para não fechar ao clicar dentro */}
      <div 
        className="p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" 
        style={{
          backgroundColor: SEMANTIC_COLOR_VARS.cardBg, 
          borderColor: SEMANTIC_COLOR_VARS.borderColor, 
          borderWidth: '1px'
        }}
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do card feche o modal
      >
        {/* Cabeçalho do card: Nome do personagem e botão de fechar */}
        <div className="flex justify-between items-center mb-4">
          <h2 
            className={`${FONT_SIZE_CLASSES['3xl']} font-bold ${person.isCovenantLine ? '' : 'opacity-80'}`} 
            style={{color: SEMANTIC_COLOR_VARS.cardHeaderColor}} // Nome do personagem, com destaque se for da linha do pacto
          >
            {person.name}
          </h2>
          <button 
            onClick={onClose} // Botão para fechar o card
            className={`hover:text-white ${FONT_SIZE_CLASSES['2xl']}`} 
            style={{color: SEMANTIC_COLOR_VARS.textColor}} // Estilo do botão de fechar (um 'X')
          >
            &times;
          </button>
        </div>
        
        {/* Informações adicionais: Significado do nome e Referência Bíblica */}
        {person.nameMeaning && <p className={`${FONT_SIZE_CLASSES.sm} italic mb-1`} style={{color: SEMANTIC_COLOR_VARS.accentColor}}>Significado: {person.nameMeaning}</p>}
        {person.bibleReference && <p className={`${FONT_SIZE_CLASSES.sm} mb-3`} style={{color: SEMANTIC_COLOR_VARS.textColor}}>Referência: {person.bibleReference}</p>}

        {/* Grid com dados cronológicos: Nascimento, Morte, Tempo de Vida, Idade na Paternidade */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ${FONT_SIZE_CLASSES.sm}`}>
          {person.birthYear !== undefined && <div><strong style={{color: SEMANTIC_COLOR_VARS.accentColor}}>Nascimento (Relativo Adão=0):</strong> Ano {person.birthYear}</div>}
          {person.deathYear !== undefined && <div><strong style={{color: SEMANTIC_COLOR_VARS.accentColor}}>Morte (Relativo Adão=0):</strong> Ano {person.deathYear}</div>}
          {person.totalLifespan !== undefined && <div><strong style={{color: SEMANTIC_COLOR_VARS.accentColor}}>Tempo de Vida:</strong> {person.totalLifespan} anos</div>}
          {person.ageAtParenthood !== undefined && <div><strong style={{color: SEMANTIC_COLOR_VARS.accentColor}}>Idade ao gerar filho principal:</strong> {person.ageAtParenthood} anos</div>}
        </div>

        {/* Descrição do personagem, se disponível */}
        {person.description && <p className="mb-4 p-3 rounded" style={{backgroundColor: SEMANTIC_COLOR_VARS.appBg, color: SEMANTIC_COLOR_VARS.textColor}}>{person.description}</p>}
        
        {/* Informações sobre o pai (poderia ser expandido para outros familiares) */}
        {person.fatherId && <p className={FONT_SIZE_CLASSES.sm}><strong style={{color: SEMANTIC_COLOR_VARS.accentColor}}>Pai:</strong> {peopleData.find(p => p.id === person.fatherId)?.name || person.fatherId}</p>}
        {/* TODO: Adicionar mãe, cônjuges, filhos com links/botões para abrir seus respectivos cards */}

        {/* Lista de eventos chave relacionados ao personagem */}
        {relatedEvents.length > 0 && (
          <div className="mt-4">
            <h3 className={`${FONT_SIZE_CLASSES.xl} font-semibold mb-2`} style={{color: SEMANTIC_COLOR_VARS.cardHeaderColor}}>Eventos Chave:</h3>
            <ul className={`list-disc list-inside space-y-1 ${FONT_SIZE_CLASSES.sm}`}>
              {relatedEvents.map(event => (
                <li key={event.id} style={{color: SEMANTIC_COLOR_VARS.textColor}}>
                  {event.name} {event.genesisChapter && `(Gênesis ${event.genesisChapter})`}
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
          // Efeitos de hover para o botão, mudando a cor de fundo
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonHoverBg}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonBg}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default CharacterCard;