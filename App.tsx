// App.tsx
// Componente principal da aplicação. Gerencia o estado global, como o modo de visualização,
// personagem/evento selecionado, tema atual e filtros. Renderiza o cabeçalho,
// a visualização principal (TimelineView) e os modais de cartão.
// 
// ATUALIZADO: React 19 - Aproveitando refs mutáveis e otimizações de performance
// ATUALIZADO: Material Design 3 - Novos componentes visuais e sistema de temas

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Person, BibleEvent, YearReferenceMode, EventCategory } from './types';
import { useOnClickOutside, useFontSize } from './hooks';
import { peopleData, eventsData } from './data'; 
import { useMaterialTheme } from './utils/materialThemeProvider';
import {
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon as ChevronDownHeroIcon,
  ChevronUpIcon as ChevronUpHeroIcon,
  UsersIcon,
  SunIcon,
  MoonIcon,
  LockClosedIcon,
  LockOpenIcon,
  Bars3Icon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import TimelineView from './components/TimelineView';
import CharacterCard from './components/CharacterCard';
import EventCard from './components/EventCard';
import { MaterialButton, FontSizeControl, BibleVerseModal } from './components';
import { Z_INDICES, MIN_HORIZONTAL_SCALE, MAX_HORIZONTAL_SCALE, MIN_VERTICAL_SCALE, MAX_VERTICAL_SCALE, MIN_GLOBAL_UI_SCALE, MAX_GLOBAL_UI_SCALE } from './stylingConstants';

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
  // Material Design 3 theme management
  const { effectiveTheme, toggleTheme } = useMaterialTheme();
  // Create a theme object for legacy compatibility
  const currentTheme = {
    id: effectiveTheme,
    name: effectiveTheme === 'dark' ? 'Escuro Moderno (Padrão)' : 'Claro Clássico',
    colors: {      // These will be read from CSS custom properties by Material components
      personBarPalette: [
        'var(--person-bar-color-1)',    // Blue with good contrast
        'var(--person-bar-color-2)',    // Dark Blue
        'var(--person-bar-color-3)',    // Dark Green  
        'var(--person-bar-color-4)',    // Dark Red
        'var(--person-bar-color-5)',    // Dark Orange
        'var(--person-bar-color-6)',    // Dark Purple
      ]
    }
  };
  
  // Font size control
  const { fontSize } = useFontSize();

  const [yearReferenceMode, setYearReferenceMode] = useState<YearReferenceMode>('AC');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);  const [selectedEvent, setSelectedEvent] = useState<BibleEvent | null>(null);
  const [isFontSizeControlOpen, setIsFontSizeControlOpen] = useState(false);
  const [isYearRulerSticky, setIsYearRulerSticky] = useState(true);
  const [bibleVerseModal, setBibleVerseModal] = useState<{ isOpen: boolean; reference: string }>({ isOpen: false, reference: '' });
  const fontSizeControlRef = useOnClickOutside<HTMLDivElement>(() => setIsFontSizeControlOpen(false));
  
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
  const controlsHeaderRef = useRef<HTMLElement>(null);
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
  };  // React 19: Otimizando funções com useCallback para melhor performance
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

  const handleBibleReferenceClick = useCallback((reference: string) => {
    setBibleVerseModal({ isOpen: true, reference });
  }, []);

  const closeBibleVerseModal = useCallback(() => {
    setBibleVerseModal({ isOpen: false, reference: '' });
  }, []);
  
  const eventCategories: EventCategory[] = ['principal', 'secundario', 'menor'];
  const groupedEvents = useMemo(() => {
    return eventCategories.map(category => ({
      category,
      events: eventsData.filter(event => event.category === category)
    }));  }, []);
    // Helper to get scaled font sizes based on the current font size config
  const getScaledFontSize = (scale: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl') => {
    // Verificação de segurança para evitar erro se fontSize for undefined
    if (!fontSize || !fontSize.baseSize || !fontSize.multiplier) {
      // Retorna um valor padrão se fontSize não estiver disponível
      const defaultSizes = {
        xs: '12px',
        sm: '14px', 
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px'
      };
      return defaultSizes[scale];
    }
    
    const scaleMap = {
      xs: 0.75,
      sm: 0.875,
      base: 1,
      lg: 1.125,
      xl: 1.25,
      '2xl': 1.5,
      '3xl': 1.875
    };
    return `${fontSize.baseSize * scaleMap[scale] * fontSize.multiplier}px`;
  };


  return (
    <div className="flex flex-col h-screen bg-theme-app-bg text-theme-text">
      {/* Top bar with Title and Control Buttons */}
      <div className="shadow-sm border-b bg-theme-header-bg border-theme-border" style={{ zIndex: Z_INDICES.topHeader }}>
        <div className="container mx-auto px-3 md:px-4 py-2 md:py-3">
          <div className="flex justify-between items-center gap-2">
            {/* Title */}
            <h1 className="dynamic-text-lg md:dynamic-text-xl font-md-display-medium text-theme-header-text truncate">
              Cronologia Bíblica Interativa
            </h1>
            
            {/* Control Buttons */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              {/* Font Size Control */}
              <div className="relative" ref={fontSizeControlRef}>
                <MaterialButton
                  variant="outlined"
                  size="small"
                  onClick={() => setIsFontSizeControlOpen(!isFontSizeControlOpen)}
                  theme={currentTheme}
                  ariaLabel="Ajustar tamanho da fonte"
                >
                  Aa
                </MaterialButton>
                {isFontSizeControlOpen && (
                  <div className="absolute right-0 mt-2 w-48" style={{ zIndex: Z_INDICES.dropdowns }}>
                    <FontSizeControl theme={currentTheme} />
                  </div>
                )}
              </div>              {/* Theme Toggle Button */}
              <MaterialButton
                variant="outlined"
                size="small"
                onClick={toggleTheme}
                icon={effectiveTheme === 'dark' ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
                theme={currentTheme}
                ariaLabel={effectiveTheme === 'dark' ? "Trocar para Claro Clássico" : "Trocar para Escuro Moderno (Padrão)"}
              >
                {/* Icon only button */}
              </MaterialButton>

              {/* Show/Hide Character Bar Controls */}
              <MaterialButton
                variant="outlined"
                size="small"
                onClick={() => setShowCharacterBarControls(!showCharacterBarControls)}
                icon={showCharacterBarControls ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                theme={currentTheme}
                ariaLabel={showCharacterBarControls ? "Ocultar informações especiais" : "Mostrar informações especiais"}
              >
                {/* Icon only button */}
              </MaterialButton>
                  {/* Stick Year Ruler Button */}
              <MaterialButton
                variant="outlined"
                size="small"
                onClick={() => {
                  console.log('Botão régua clicado! Estado atual:', isYearRulerSticky);
                  setIsYearRulerSticky(!isYearRulerSticky);
                  console.log('Novo estado será:', !isYearRulerSticky);
                }}
                icon={isYearRulerSticky ? <LockClosedIcon className="w-4 h-4" /> : <LockOpenIcon className="w-4 h-4" />}
                theme={currentTheme}
                ariaLabel={isYearRulerSticky ? "Desafixar Régua de Anos" : "Fixar Régua de Anos"}
              >
                {/* Icon only button */}
              </MaterialButton>
              
              {/* Toggle Configurations Button */}
              <MaterialButton
                variant="filled"
                size="medium"
                onClick={() => setShowControlsHeader(!showControlsHeader)}
                icon={showControlsHeader ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
                theme={currentTheme}
                ariaLabel={showControlsHeader ? "Ocultar Configurações" : "Mostrar Configurações"}
              >
                {/* Icon only button */}
              </MaterialButton>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Controls Header */}
      <header 
        ref={controlsHeaderRef}
        className={`shadow-lg transition-all duration-300 ease-in-out bg-theme-header-bg ${showControlsHeader ? 'max-h-[500px] opacity-100 px-3 md:px-4 py-2 md:py-3' : 'max-h-0 opacity-0 overflow-hidden pointer-events-none'}`} 
        style={{ zIndex: Z_INDICES.controlsHeader }}
      >        <div className="container mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
            <div className="flex space-x-1 md:space-x-2 items-center">
              {/* Year Reference Mode Toggle */}
              <MaterialButton
                variant="outlined"
                size="small"
                onClick={toggleYearReferenceMode}
                theme={currentTheme}
                ariaLabel="Alternar modo de referência de anos"
              >
                {yearReferenceMode === 'AC' ? 'aC' : 'Relativo'}
              </MaterialButton>

              {/* Event Filter */}
              <div className="relative" ref={eventSelectorRef}>
                <MaterialButton
                  variant="outlined"
                  size="small"
                  onClick={() => setIsEventSelectorOpen(!isEventSelectorOpen)}
                  icon={<CalendarDaysIcon className="w-5 h-5" />}
                  iconPosition="start"
                  theme={currentTheme}
                  ariaLabel="Filtrar Eventos"
                >
                  {isEventSelectorOpen ? <ChevronUpHeroIcon className="w-4 h-4 ml-1" /> : <ChevronDownHeroIcon className="w-4 h-4 ml-1" />}
                </MaterialButton>
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
              </div>              {/* Person Visibility Panel */}
              <div className="relative" ref={personVisibilityPanelRef}>
                <MaterialButton
                  variant="outlined"
                  size="small"
                  onClick={() => setIsPersonVisibilityPanelOpen(!isPersonVisibilityPanelOpen)}
                  icon={<UsersIcon className="w-5 h-5" />}
                  iconPosition="start"
                  theme={currentTheme}
                  ariaLabel="Visibilidade de Personagens"
                >
                  {isPersonVisibilityPanelOpen ? <ChevronUpHeroIcon className="w-4 h-4 ml-1" /> : <ChevronDownHeroIcon className="w-4 h-4 ml-1" />}
                </MaterialButton>                {isPersonVisibilityPanelOpen && (
                  <div className="absolute right-0 mt-2 w-72 md:w-96 border rounded-md shadow-lg p-4 max-h-96 overflow-y-auto bg-theme-card-bg border-theme-border" style={{ zIndex: Z_INDICES.dropdowns }}>
                    <h3 style={{ fontSize: getScaledFontSize('lg') }} className={`font-semibold mb-3 text-theme-card-header`}>Mostrar/Ocultar Personagens</h3>
                    <MaterialButton
                      variant="filled"
                      size="small"
                      onClick={() => setHiddenCharacterIds([])}
                      theme={currentTheme}
                      className="w-full mb-3"
                      ariaLabel="Mostrar todos os personagens"
                    >
                      Mostrar Todos os Personagens
                    </MaterialButton>
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
      </header>      <main 
        className="flex-grow overflow-hidden" 
        style={{ position: 'relative' }}
      ><TimelineView 
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
          onBibleReferenceClick={handleBibleReferenceClick}
          isYearRulerSticky={isYearRulerSticky}
        />
      </main>      <CharacterCard 
        person={selectedPerson} 
        onClose={closeCards} 
        onBibleReferenceClick={handleBibleReferenceClick}
      />      <EventCard 
        event={selectedEvent} 
        onClose={closeCards} 
        onSelectPerson={handleSelectPerson}
        onBibleReferenceClick={handleBibleReferenceClick}
      />

      {/* Bible Verse Modal */}
      <BibleVerseModal 
        isOpen={bibleVerseModal.isOpen}
        reference={bibleVerseModal.reference}
        onClose={closeBibleVerseModal}
        theme={currentTheme}
      />

      <footer className={`text-center p-3 bg-theme-header-bg text-theme-accent`} style={{ fontSize: getScaledFontSize('xs') }}>
        Exploração Visual das Narrativas Fundacionais do Livro de Gênesis.
      </footer>
    </div>
  );
};

export default App;