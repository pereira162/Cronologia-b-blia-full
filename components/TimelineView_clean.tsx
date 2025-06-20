import React, { useEffect } from 'react';
import { Person, BibleEvent, YearReferenceMode } from '../types';
import { BASE_DIMENSIONS } from '../stylingConstants';

interface TimelineViewProps {
  people: Person[];
  events: BibleEvent[];
  onSelectPerson: (person: Person) => void;
  onSelectEvent: (event: BibleEvent) => void;
  yearReferenceMode: YearReferenceMode;
  personBarPalette: string[];
  horizontalScale: number;
  verticalScale: number;
  globalUiScale: number;
  hiddenCharacterIds: string[];
  onToggleCharacterVisibility: (personId: string) => void;
  showCharacterBarControls: boolean;
  activePersonLifeLines: Record<string, boolean>;
  onTogglePersonLifeLine: (personId: string) => void;
  onBibleReferenceClick: (reference: string) => void;
  isYearRulerSticky: boolean;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  horizontalScale,
  globalUiScale,
  isYearRulerSticky,
}) => {
  
  // Debug logs for ruler state
  useEffect(() => {
    console.log('TimelineView - isYearRulerSticky:', isYearRulerSticky);
  }, [isYearRulerSticky]);

  const yearsToShow = [
    { year: 4000, label: '4000 AC' },
    { year: 3500, label: '3500 AC' },
    { year: 3000, label: '3000 AC' },
    { year: 2500, label: '2500 AC' },
    { year: 2000, label: '2000 AC' },
    { year: 1500, label: '1500 AC' },
    { year: 1000, label: '1000 AC' },
    { year: 500, label: '500 AC' },
    { year: 0, label: '0 DC' },
  ];

  const yearRulerHeight = BASE_DIMENSIONS.yearHeaderHeight * globalUiScale;

  const renderYearRuler = () => {
    const rulerClass = isYearRulerSticky 
      ? 'fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-300 shadow-sm'
      : 'relative bg-gray-100 border-b border-gray-300';
    
    return (
      <div 
        className={rulerClass}
        style={{ height: `${yearRulerHeight}px` }}
      >
        <div className="flex items-center h-full px-4">
          <div className="text-sm font-semibold text-gray-700 mr-4">
            Régua de Anos:
          </div>
          <div className="text-xs text-gray-600">
            {isYearRulerSticky ? 'MODO FIXO (sticky)' : 'MODO SCROLL (relative)'}
          </div>
          <div className="flex space-x-6 ml-8">
            {yearsToShow.map(({ year, label }) => (
              <div key={year} className="text-xs text-gray-500">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="timeline-view">
      {/* Year Ruler */}
      {renderYearRuler()}
      
      {/* Main Timeline Content */}
      <div 
        className="timeline-content bg-gray-50"
        style={{ 
          marginTop: isYearRulerSticky ? `${yearRulerHeight}px` : '0',
          minHeight: '800px'
        }}
      >
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Cronologia Bíblica - Timeline Content
          </h2>
          <p className="text-gray-600 mb-4">
            Escala Horizontal: {horizontalScale}x | UI Scale: {globalUiScale}x
          </p>
          <p className="text-gray-600 mb-4">
            Estado da Régua: {isYearRulerSticky ? 'FIXA (sticky)' : 'SCROLL (relative)'}
          </p>
          
          {/* Placeholder content for scrolling test */}
          <div className="space-y-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold">Evento {i + 1}</h3>
                <p className="text-gray-600">
                  Conteúdo do evento {i + 1}. Este é um placeholder para testar o comportamento da régua de anos.
                  {isYearRulerSticky 
                    ? ' A régua deve permanecer fixa no topo enquanto você scrolla.' 
                    : ' A régua deve scrollar junto com o conteúdo.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
