// App.tsx
// Componente principal da aplicação. Gerencia o estado global, como o modo de visualização,
// personagem/evento selecionado, tema atual e filtros. Renderiza o cabeçalho,
// a visualização principal (TimelineView) e os modais de cartão.
// 
// ATUALIZADO: React 19 - Aproveitando refs mutáveis e otimizações de performance

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Person, BibleEvent, YearReferenceMode, EventCategory } from './types';
import { useOnClickOutside } from './hooks';
import { peopleData, eventsData } from './data'; 
import { themes } from './themes'; 
import {
  Cog6ToothIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon as ChevronDownHeroIcon, // Alias to avoid naming conflict if any old ones remain temporarily
  ChevronUpIcon as ChevronUpHeroIcon,     // Alias to avoid naming conflict
  FunnelIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import TimelineView from './components/TimelineView';
import CharacterCard from './components/CharacterCard';
import EventCard from './components/EventCard';
import { FONT_SIZE_CLASSES, Z_INDICES, MIN_HORIZONTAL_SCALE, MAX_HORIZONTAL_SCALE, MIN_VERTICAL_SCALE, MAX_VERTICAL_SCALE, MIN_GLOBAL_UI_SCALE, MAX_GLOBAL_UI_SCALE } from './stylingConstants';

// --- Ícones Helper --- (Old icon components removed)

const mapSliderToScale = (sliderValue: number, minScale: number, maxScale: number): number => {
  const val = Number(sliderValue); 
  if (val < 50) return minScale + (val / 50) * (1.0 - minScale);
  if (val === 50) return 1.0;
  return 1.0 + ((val - 50) / 50) * (maxScale - 1.0);
};

const mapScaleToSlider = (scaleValue: number, minScale: number, maxScale: number): number => {
  const scale = Number(scaleValue); 
  if (scale < 1.0) return Math.round(((scale - minScale) / (1.0 - minScale)) * 50);
  if (scale === 1.0) return 50;
  return Math.round(50 + ((scale - 1.0) / (maxScale - 1.0)) * 50);
};

const App: React.FC = () => {
  const [yearReferenceMode, setYearReferenceMode] = useState<YearReferenceMode>('AC');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<BibleEvent | null>(null);
  const [currentThemeId, setCurrentThemeId] = useState<string>(themes[0].id);  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const themeSelectorRef = useOnClickOutside<HTMLDivElement>(() => setIsThemeSelectorOpen(false));
  
  const initialSelectedEventIds = useMemo(() => 
    eventsData.filter(event => event.category === 'principal').map(event => event.id)
  , []); 
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>(initialSelectedEventIds);  const [isEventSelectorOpen, setIsEventSelectorOpen] = useState(false);
  const eventSelectorRef = useOnClickOutside<HTMLDivElement>(() => setIsEventSelectorOpen(false));

  const [horizontalSliderValue, setHorizontalSliderValue] = useState(mapScaleToSlider(1.0, MIN_HORIZONTAL_SCALE, MAX_HORIZONTAL_SCALE));
  const [verticalSliderValue, setVerticalSliderValue] = useState(mapScaleToSlider(1.0, MIN_VERTICAL_SCALE, MAX_VERTICAL_SCALE));
  const [globalUiScaleSliderValue, setGlobalUiScaleSliderValue] = useState(mapScaleToSlider(1.0, MIN_GLOBAL_UI_SCALE, MAX_GLOBAL_UI_SCALE));

  // Base scales from sliders
  const baseHorizontalScale = useMemo(() => mapSliderToScale(horizontalSliderValue, MIN_HORIZONTAL_SCALE, MAX_HORIZONTAL_SCALE), [horizontalSliderValue]);
  const baseVerticalScale = useMemo(() => mapSliderToScale(verticalSliderValue, MIN_VERTICAL_SCALE, MAX_VERTICAL_SCALE), [verticalSliderValue]);
  const globalUiScale = useMemo(() => mapSliderToScale(globalUiScaleSliderValue, MIN_GLOBAL_UI_SCALE, MAX_GLOBAL_UI_SCALE), [globalUiScaleSliderValue]);

  // Effective scales for display and passing to TimelineView (base * global)
  const effectiveHorizontalScaleDisplay = (baseHorizontalScale * globalUiScale).toFixed(1);
  const effectiveVerticalScaleDisplay = (baseVerticalScale * globalUiScale).toFixed(1);

  const [hiddenCharacterIds, setHiddenCharacterIds] = useState<string[]>([]);  const [isPersonVisibilityPanelOpen, setIsPersonVisibilityPanelOpen] = useState(false);
  const personVisibilityPanelRef = useOnClickOutside<HTMLDivElement>(() => setIsPersonVisibilityPanelOpen(false));

  const [showCharacterBarControls, setShowCharacterBarControls] = useState(true);
  const [activePersonLifeLines, setActivePersonLifeLines] = useState<Record<string, boolean>>({});
  
  const [showControlsHeader, setShowControlsHeader] = useState(true);
  const controlsHeaderRef = useRef<HTMLElement>(null);  const [controlsHeaderHeight, setControlsHeaderHeight] = useState(0);

  // React 19: Otimizando funções com useCallback para melhor performance
  const toggleCharacterVisibility = useCallback((personId: string) => {
    setHiddenCharacterIds((prevHiddenIds: string[]) =>
      prevHiddenIds.includes(personId)
        ? prevHiddenIds.filter((id: string) => id !== personId)
        : [...prevHiddenIds, personId]
    );
  }, []);
  
  const togglePersonLifeLine = useCallback((personId: string) => {
    setActivePersonLifeLines((prev: Record<string, boolean>) => ({ 
      ...prev, 
      [personId]: !prev[personId] 
    }));
  }, []);

  useEffect(() => {
    const selectedTheme = themes.find(t => t.id === currentThemeId);
    if (selectedTheme) {
      const root = document.documentElement; 
      root.style.setProperty('--app-bg-color', selectedTheme.colors.appBg);
      root.style.setProperty('--header-bg-color', selectedTheme.colors.headerBg);
      root.style.setProperty('--timeline-gradient-start', selectedTheme.colors.timelineGradientStart);
      root.style.setProperty('--timeline-gradient-end', selectedTheme.colors.timelineGradientEnd);
      root.style.setProperty('--text-color', selectedTheme.colors.textColor);
      root.style.setProperty('--accent-color', selectedTheme.colors.accentColor);
      root.style.setProperty('--button-bg-color', selectedTheme.colors.buttonBg);
      root.style.setProperty('--button-hover-bg-color', selectedTheme.colors.buttonHoverBg);
      root.style.setProperty('--card-bg-color', selectedTheme.colors.cardBg);
      root.style.setProperty('--card-header-color', selectedTheme.colors.cardHeaderColor);
      root.style.setProperty('--border-color', selectedTheme.colors.borderColor);
      
      const isDarkTheme = ['modern-dark', 'oceanic-blaze', 'sunset-glow'].includes(selectedTheme.id); 
      root.style.setProperty('--scrollbar-track-color', isDarkTheme ? '#1f2937' : '#e5e7eb'); 
      root.style.setProperty('--scrollbar-thumb-color', selectedTheme.colors.accentColor); 
      root.style.setProperty('--scrollbar-thumb-hover-color', selectedTheme.colors.timelineGradientEnd); 

      root.style.setProperty('--timeline-year-marker-major-color', selectedTheme.colors.textColor);
      root.style.setProperty('--timeline-year-marker-minor-color', selectedTheme.colors.accentColor);
      root.style.setProperty('--timeline-grid-line-color', selectedTheme.id.includes('light') || selectedTheme.id.includes('spring') ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--person-line-active-color', selectedTheme.id.includes('light') || selectedTheme.id.includes('spring') ? '#ca8a04' : '#facc15');
      root.style.setProperty('--event-line-color', selectedTheme.id.includes('light') || selectedTheme.id.includes('spring') ? '#db2777' : '#f472b6');
    }
  }, [currentThemeId]);

  useEffect(() => {
    const calculateHeight = () => {
      if (showControlsHeader && controlsHeaderRef.current) {
        setControlsHeaderHeight(controlsHeaderRef.current.offsetHeight);
      } else {
        setControlsHeaderHeight(0);
      }
    };
    
    const observer = new ResizeObserver(calculateHeight);
    if (controlsHeaderRef.current) {
      observer.observe(controlsHeaderRef.current);
    }
    
    // Initial calculation
    calculateHeight();
    
    window.addEventListener('resize', calculateHeight);

    return () => {
      if (controlsHeaderRef.current) {
        observer.unobserve(controlsHeaderRef.current);
      }
      window.removeEventListener('resize', calculateHeight);
    };
  }, [showControlsHeader, globalUiScale, isThemeSelectorOpen, isEventSelectorOpen, isPersonVisibilityPanelOpen]);

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setSelectedEvent(null);
  };

  const handleSelectEvent = (event: BibleEvent) => {
    setSelectedEvent(event);
    setSelectedPerson(null);
  };

  const closeCards = () => {
    setSelectedPerson(null);
    setSelectedEvent(null);
  };
  // React 19: Otimizando handlers com useCallback e tipagem explícita
  const toggleYearReferenceMode = useCallback(() => {
    setYearReferenceMode((prevMode: YearReferenceMode) => 
      prevMode === 'AC' ? 'Relative' : 'AC'
    );
  }, []);

  const handleEventSelectionChange = useCallback((eventId: string) => {
    setSelectedEventIds((prevSelectedIds: string[]) => 
      prevSelectedIds.includes(eventId) 
        ? prevSelectedIds.filter((id: string) => id !== eventId)
        : [...prevSelectedIds, eventId]
    );
  }, []);
  
  const eventCategories: EventCategory[] = ['principal', 'secundario', 'menor'];
  const groupedEvents = useMemo(() => {
    return eventCategories.map(category => ({
      category,
      events: eventsData.filter(event => event.category === category)
    }));
  }, []);

  const currentTheme = themes.find(t => t.id === currentThemeId) || themes[0];

  // Helper to apply globalUiScale to Tailwind font size classes
  const getScaledFontSize = (tailwindClass: keyof typeof FONT_SIZE_CLASSES) => {
    const baseSizesRem = {
      xs: 0.75, sm: 0.875, base: 1, lg: 1.125, xl: 1.25, '2xl': 1.5, '3xl': 1.875
    };
    // Ensure the calculation results in a valid CSS string for font-size
    const scaledValue = (baseSizesRem[tailwindClass] * globalUiScale).toFixed(3);
    return `${scaledValue}rem`;
  };


  return (
    <div className="flex flex-col h-screen bg-theme-app-bg text-theme-text">
      {/* Top bar with Title and Toggle Configs Button */}
      <div 
        className="p-3 md:p-4 shadow-md bg-theme-header-bg"
        style={{ zIndex: Z_INDICES.controlsHeader + 1 }} // Ensure title bar is above controls header
      >
        <div className="container mx-auto flex justify-between items-center">
           <h1 
            style={{ fontSize: getScaledFontSize('2xl') }}
            className="font-bold tracking-tight text-theme-accent" // Removed text-2xl md:text-3xl to rely on getScaledFontSize
           >
            Gênesis Interativo
           </h1>
          <button
            onClick={() => setShowControlsHeader(!showControlsHeader)}
            className={`p-2 rounded-md font-semibold flex items-center transition-colors duration-150 bg-theme-button-bg hover:bg-theme-button-hover-bg text-theme-text`}
            style={{ fontSize: getScaledFontSize('sm')}}
            title={showControlsHeader ? "Ocultar Configurações" : "Mostrar Configurações"}
          >
            {showControlsHeader ? <XMarkIcon className="w-6 h-6" /> : <Cog6ToothIcon className="w-6 h-6" />}
            <span className="ml-2 hidden sm:inline">{showControlsHeader ? "Ocultar" : "Configurações"}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Controls Header */}
      <header 
        ref={controlsHeaderRef}
        className={`shadow-lg p-3 md:p-4 transition-all duration-300 ease-in-out bg-theme-header-bg ${showControlsHeader ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 p-0 md:p-0 pointer-events-none'}`} 
        style={{ zIndex: Z_INDICES.controlsHeader }}
      >
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
            <div className="flex space-x-1 md:space-x-2 items-center">
               <button
                onClick={() => setShowCharacterBarControls(!showCharacterBarControls)}
                className={`p-2 rounded-md font-semibold flex items-center transition-colors duration-150 bg-theme-button-bg hover:bg-theme-button-hover-bg text-theme-text`}
                style={{ fontSize: getScaledFontSize('sm')}}
                title={showCharacterBarControls ? "Ocultar controles nas barras" : "Mostrar controles nas barras"}
              >
                {showCharacterBarControls ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                <span className="ml-1 hidden md:inline" style={{fontSize: getScaledFontSize('xs')}}>Contr. Barras</span>
              </button>
              <div className="relative" ref={themeSelectorRef}>
                <button
                  onClick={() => setIsThemeSelectorOpen(!isThemeSelectorOpen)}
                  className={`p-2 rounded-md font-semibold flex items-center transition-colors duration-150 bg-theme-button-bg hover:bg-theme-button-hover-bg text-theme-text`}
                  style={{ fontSize: getScaledFontSize('sm')}}
                  aria-expanded={isThemeSelectorOpen}
                  title="Selecionar Tema"
                >
                  <div className="flex items-center space-x-1 mr-1">
                    {currentTheme.colors.previewColors.map((color, idx) => (
                      <div key={idx} className="w-3 h-3 rounded-sm border border-theme-border" style={{ backgroundColor: color, transform: `scale(${globalUiScale})` }}></div>
                    ))}
                  </div>
                  {isThemeSelectorOpen ? <ChevronUpHeroIcon className="w-4 h-4 ml-1" /> : <ChevronDownHeroIcon className="w-4 h-4 ml-1" />}
                </button>
                {isThemeSelectorOpen && (
                  <div className="absolute right-0 mt-2 w-64 border rounded-md shadow-lg p-2 max-h-80 overflow-y-auto bg-theme-card-bg border-theme-border" style={{ zIndex: Z_INDICES.dropdowns }}>
                    {themes.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => { setCurrentThemeId(theme.id); setIsThemeSelectorOpen(false); }}
                        className={`block w-full text-left px-3 py-2 rounded text-theme-text ${currentThemeId === theme.id ? 'font-semibold bg-theme-button-hover-bg' : 'bg-transparent hover:bg-theme-button-bg'}`}
                        style={{ 
                          fontSize: getScaledFontSize('sm')
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span>{theme.name}</span>
                          <div className="flex space-x-1">
                            {theme.colors.previewColors.map((color, idx) => (
                              <div key={idx} className="w-3 h-3 rounded-sm border border-theme-border" style={{ backgroundColor: color }}></div>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={toggleYearReferenceMode}
                className={`px-3 py-2 rounded-md font-semibold flex items-center transition-colors duration-150 bg-theme-button-bg hover:bg-theme-button-hover-bg text-theme-text`}
                style={{ fontSize: getScaledFontSize('sm')}}
              >
                Anos: {yearReferenceMode === 'AC' ? 'aC' : 'Relativo'}
              </button>
              <div className="relative" ref={eventSelectorRef}>
                <button
                  onClick={() => setIsEventSelectorOpen(!isEventSelectorOpen)}
                  className={`p-2 rounded-md font-semibold flex items-center transition-colors duration-150 bg-theme-button-bg hover:bg-theme-button-hover-bg text-theme-text`}
                  style={{ fontSize: getScaledFontSize('sm')}}
                  aria-expanded={isEventSelectorOpen}
                  title="Filtrar Eventos"
                >
                  <FunnelIcon className="w-6 h-6" />
                  {isEventSelectorOpen ? <ChevronUpHeroIcon className="w-4 h-4 ml-1" /> : <ChevronDownHeroIcon className="w-4 h-4 ml-1" />}
                </button>
                {isEventSelectorOpen && (
                  <div className="absolute right-0 mt-2 w-72 md:w-96 border rounded-md shadow-lg p-4 max-h-96 overflow-y-auto bg-theme-card-bg border-theme-border" style={{ zIndex: Z_INDICES.dropdowns }}>
                    <h3 style={{ fontSize: getScaledFontSize('lg') }} className={`font-semibold mb-3 text-theme-card-header`}>Selecionar Eventos</h3>
                    {groupedEvents.map(({ category, events: categoryEvents }) => ( 
                      <div key={category} className="mb-3">
                        <h4 style={{ fontSize: getScaledFontSize('base')}} className={`capitalize font-medium mb-1 border-b pb-1 text-theme-accent border-b-theme-border`}>{category}</h4>
                        {categoryEvents.map(event => (
                          <label key={event.id} className="flex items-center space-x-2 p-1 hover:opacity-75 rounded cursor-pointer text-theme-text">
                            <input 
                              type="checkbox"
                              className="form-checkbox h-4 w-4 rounded focus:ring-offset-0 focus:ring-2 input-checkbox-themed"
                              style={{transform: `scale(${globalUiScale})`}}
                              checked={selectedEventIds.includes(event.id)}
                              onChange={() => handleEventSelectionChange(event.id)}
                            />
                            <span style={{fontSize: getScaledFontSize('sm')}}>{event.name}</span>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative" ref={personVisibilityPanelRef}>
                <button
                  onClick={() => setIsPersonVisibilityPanelOpen(!isPersonVisibilityPanelOpen)}
                  className={`p-2 rounded-md font-semibold flex items-center transition-colors duration-150 bg-theme-button-bg hover:bg-theme-button-hover-bg text-theme-text`}
                  style={{ fontSize: getScaledFontSize('sm')}}
                  aria-expanded={isPersonVisibilityPanelOpen}
                  title="Visibilidade de Personagens"
                >
                  <UsersIcon className="w-6 h-6" />
                  {isPersonVisibilityPanelOpen ? <ChevronUpHeroIcon className="w-4 h-4 ml-1" /> : <ChevronDownHeroIcon className="w-4 h-4 ml-1" />}
                </button>
                {isPersonVisibilityPanelOpen && (
                  <div className="absolute right-0 mt-2 w-72 md:w-96 border rounded-md shadow-lg p-4 max-h-96 overflow-y-auto bg-theme-card-bg border-theme-border" style={{ zIndex: Z_INDICES.dropdowns }}>
                    <h3 style={{ fontSize: getScaledFontSize('lg') }} className={`font-semibold mb-3 text-theme-card-header`}>Mostrar/Ocultar Personagens</h3>
                    <button 
                        onClick={() => setHiddenCharacterIds([])}
                        className="w-full mb-3 px-3 py-1.5 rounded-md font-semibold transition-colors duration-150 bg-theme-button-bg hover:bg-theme-button-hover-bg text-theme-text"
                        style={{ fontSize: getScaledFontSize('sm')}}
                    >
                        Mostrar Todos os Personagens
                    </button>
                    {peopleData.map(person => (
                      <label key={person.id} className="flex items-center space-x-2 p-1 hover:opacity-75 rounded cursor-pointer text-theme-text">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 rounded focus:ring-offset-0 focus:ring-2 input-checkbox-themed"
                          style={{transform: `scale(${globalUiScale})`}}
                          checked={!hiddenCharacterIds.includes(person.id)} 
                          onChange={() => toggleCharacterVisibility(person.id)}
                        />
                        <span style={{fontSize: getScaledFontSize('sm')}} className={`${person.isCovenantLine ? 'font-semibold opacity-90' : 'opacity-70'}`}>{person.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div> 
          </div> 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 mt-2">
            <div className="flex-1 min-w-[180px] md:min-w-[200px]">
                <label htmlFor="globalUiScaleSlider" className={`block font-medium mb-0.5 text-theme-text`} style={{fontSize: getScaledFontSize('xs')}}>
                    Escala Geral UI: {globalUiScale.toFixed(1)}x
                </label>
                <input 
                    type="range" 
                    id="globalUiScaleSlider" min="0" max="100" step="1" 
                    value={globalUiScaleSliderValue} 
                    onChange={(e) => setGlobalUiScaleSliderValue(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-theme-accent bg-theme-border"
                />
            </div>
            <div className="flex-1 min-w-[180px] md:min-w-[200px]">
                <label htmlFor="horizontalScaleSlider" className={`block font-medium mb-0.5 text-theme-text`} style={{fontSize: getScaledFontSize('xs')}}>
                    Escala de Tempo (Zoom): {effectiveHorizontalScaleDisplay}x
                </label>
                <input 
                    type="range" 
                    id="horizontalScaleSlider" min="0" max="100" step="1" 
                    value={horizontalSliderValue} 
                    onChange={(e) => setHorizontalSliderValue(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-theme-accent bg-theme-border"
                />
            </div>
            <div className="flex-1 min-w-[180px] md:min-w-[200px]">
                <label htmlFor="verticalScaleSlider" className={`block font-medium mb-0.5 text-theme-text`} style={{fontSize: getScaledFontSize('xs')}}>
                     Escala Vertical (Detalhes): {effectiveVerticalScaleDisplay}x
                </label>
                <input 
                    type="range" 
                    id="verticalScaleSlider" min="0" max="100" step="1" 
                    value={verticalSliderValue} 
                    onChange={(e) => setVerticalSliderValue(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-theme-accent bg-theme-border"
                />
            </div>
          </div> 
        </div> 
      </header>

      <main 
        className="flex-grow overflow-hidden" 
        style={{ paddingTop: `${controlsHeaderHeight}px`, position: 'relative' }} // Added position:relative for child z-indexing context
      >
        <TimelineView 
          people={peopleData}
          events={eventsData.filter(event => selectedEventIds.includes(event.id))}
          onSelectPerson={handleSelectPerson}
          onSelectEvent={handleSelectEvent}
          yearReferenceMode={yearReferenceMode}
          personBarPalette={currentTheme.colors.personBarPalette}
          horizontalScale={baseHorizontalScale} 
          verticalScale={baseVerticalScale}
          globalUiScale={globalUiScale}
          hiddenCharacterIds={hiddenCharacterIds}
          onToggleCharacterVisibility={toggleCharacterVisibility}
          showCharacterBarControls={showCharacterBarControls}
          activePersonLifeLines={activePersonLifeLines}
          onTogglePersonLifeLine={togglePersonLifeLine}
        />
      </main>

      <CharacterCard person={selectedPerson} onClose={closeCards} />
      <EventCard event={selectedEvent} onClose={closeCards} onSelectPerson={handleSelectPerson} />

      <footer className={`text-center p-3 bg-theme-header-bg text-theme-accent`} style={{ fontSize: getScaledFontSize('xs') }}>
        Exploração Visual das Narrativas Fundacionais do Livro de Gênesis.
      </footer>
    </div>
  );
};

export default App;