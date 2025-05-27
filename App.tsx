// App.tsx
// Componente principal da aplicação. Gerencia o estado global, como o modo de visualização,
// personagem/evento selecionado, tema atual e filtros. Renderiza o cabeçalho,
// a visualização principal (TimelineView) e os modais de cartão.

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Person, BibleEvent, YearReferenceMode, EventCategory, Theme, PersonVisibilityPanelIconProps, ToggleBarControlsIconProps, ToggleConfigsIconProps } from './types';
import { peopleData, eventsData } from './data'; 
import { themes } from './themes'; 
import TimelineView from './components/TimelineView';
import CharacterCard from './components/CharacterCard';
import EventCard from './components/EventCard';
import { FONT_SIZE_CLASSES, SEMANTIC_COLOR_VARS, Z_INDICES, MIN_HORIZONTAL_SCALE, MAX_HORIZONTAL_SCALE, MIN_VERTICAL_SCALE, MAX_VERTICAL_SCALE, MIN_GLOBAL_UI_SCALE, MAX_GLOBAL_UI_SCALE } from './stylingConstants';

// --- Ícones Helper ---
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096V18.75M12 3c-2.755 0-5.455.232-8.083.678-.533.09-.917.556.917 1.096V18.75m0 0a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>;
const ChevronUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>;

// Ícone para o botão de alternar a visibilidade do painel de configurações
const ToggleConfigsIcon: React.FC<ToggleConfigsIconProps> = ({ isOpen, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    {isOpen ? ( // Ícone de "X" para fechar
       <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    ) : ( // Ícone de engrenagem para abrir
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    )}
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);


const PersonVisibilityPanelIcon: React.FC<PersonVisibilityPanelIconProps> = ({ isOpen, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    {isOpen ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228" />
    )}
     {isOpen && <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />}
  </svg>
);
const ControlsToggleIcon: React.FC<ToggleBarControlsIconProps> = ({ controlsVisible, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    {controlsVisible ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 2.396-1.682 4.41-3.999 5.173A4.49 4.49 0 0112 18a4.49 4.49 0 01-5.001-1.827C4.682 16.41 3 14.396 3 12c0-2.396 1.682-4.41 3.999-5.173A4.49 4.49 0 0112 6a4.49 4.49 0 015.001.827C19.318 7.59 21 9.604 21 12z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l3.65-3.65m-9.414-9.414L12 12.016m2.121-2.121a3 3 0 00-4.242 0m4.242 0a3 3 0 000 4.242M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
    )}
  </svg>
);

function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

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
  const [currentThemeId, setCurrentThemeId] = useState<string>(themes[0].id);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const themeSelectorRef = useRef<HTMLDivElement>(null);
  
  const initialSelectedEventIds = useMemo(() => 
    eventsData.filter(event => event.category === 'principal').map(event => event.id)
  , []); 
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>(initialSelectedEventIds);
  const [isEventSelectorOpen, setIsEventSelectorOpen] = useState(false);
  const eventSelectorRef = useRef<HTMLDivElement>(null);

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

  const [hiddenCharacterIds, setHiddenCharacterIds] = useState<string[]>([]);
  const [isPersonVisibilityPanelOpen, setIsPersonVisibilityPanelOpen] = useState(false);
  const personVisibilityPanelRef = useRef<HTMLDivElement>(null);

  const [showCharacterBarControls, setShowCharacterBarControls] = useState(true);
  const [activePersonLifeLines, setActivePersonLifeLines] = useState<Record<string, boolean>>({});
  
  const [showControlsHeader, setShowControlsHeader] = useState(true);
  const controlsHeaderRef = useRef<HTMLElement>(null);
  const [controlsHeaderHeight, setControlsHeaderHeight] = useState(0);

  useOnClickOutside(themeSelectorRef, () => setIsThemeSelectorOpen(false));
  useOnClickOutside(eventSelectorRef, () => setIsEventSelectorOpen(false));
  useOnClickOutside(personVisibilityPanelRef, () => setIsPersonVisibilityPanelOpen(false)); 

  const toggleCharacterVisibility = (personId: string) => {
    setHiddenCharacterIds(prevHiddenIds =>
      prevHiddenIds.includes(personId)
        ? prevHiddenIds.filter(id => id !== personId)
        : [...prevHiddenIds, personId]
    );
  };
  
  const togglePersonLifeLine = (personId: string) => {
    setActivePersonLifeLines(prev => ({ ...prev, [personId]: !prev[personId] }));
  };

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

  const toggleYearReferenceMode = () => {
    setYearReferenceMode(prevMode => prevMode === 'AC' ? 'Relative' : 'AC');
  };

  const handleEventSelectionChange = (eventId: string) => {
    setSelectedEventIds(prevSelectedIds => 
      prevSelectedIds.includes(eventId) 
        ? prevSelectedIds.filter(id => id !== eventId)
        : [...prevSelectedIds, eventId]
    );
  };
  
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
    <div className="flex flex-col h-screen" style={{ color: SEMANTIC_COLOR_VARS.textColor, backgroundColor: SEMANTIC_COLOR_VARS.appBg }}>
      {/* Top bar with Title and Toggle Configs Button */}
      <div 
        className="p-3 md:p-4 shadow-md"
        style={{ backgroundColor: SEMANTIC_COLOR_VARS.headerBg, zIndex: Z_INDICES.controlsHeader + 1 }} // Ensure title bar is above controls header
      >
        <div className="container mx-auto flex justify-between items-center">
           <h1 
            style={{ color: SEMANTIC_COLOR_VARS.accentColor, fontSize: getScaledFontSize('2xl') }}
            className="font-bold tracking-tight" // Removed text-2xl md:text-3xl to rely on getScaledFontSize
           >
            Gênesis Interativo
           </h1>
          <button
            onClick={() => setShowControlsHeader(!showControlsHeader)}
            className={`p-2 rounded-md font-semibold flex items-center transition-colors duration-150`}
            style={{ backgroundColor: SEMANTIC_COLOR_VARS.buttonBg, color: SEMANTIC_COLOR_VARS.textColor, fontSize: getScaledFontSize('sm')}}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonHoverBg}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonBg}
            title={showControlsHeader ? "Ocultar Configurações" : "Mostrar Configurações"}
          >
            <ToggleConfigsIcon isOpen={showControlsHeader} />
            <span className="ml-2 hidden sm:inline">{showControlsHeader ? "Ocultar" : "Configurações"}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Controls Header */}
      <header 
        ref={controlsHeaderRef}
        className={`shadow-lg p-3 md:p-4 transition-all duration-300 ease-in-out ${showControlsHeader ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 p-0 md:p-0 pointer-events-none'}`} 
        style={{ backgroundColor: SEMANTIC_COLOR_VARS.headerBg, zIndex: Z_INDICES.controlsHeader }}
      >
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
            <div className="flex space-x-1 md:space-x-2 items-center">
               <button
                onClick={() => setShowCharacterBarControls(!showCharacterBarControls)}
                className={`p-2 rounded-md font-semibold flex items-center transition-colors duration-150`}
                style={{ backgroundColor: SEMANTIC_COLOR_VARS.buttonBg, color: SEMANTIC_COLOR_VARS.textColor, fontSize: getScaledFontSize('sm')}}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonHoverBg}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonBg}
                title={showCharacterBarControls ? "Ocultar controles nas barras" : "Mostrar controles nas barras"}
              >
                <ControlsToggleIcon controlsVisible={showCharacterBarControls} />
                <span className="ml-1 hidden md:inline" style={{fontSize: getScaledFontSize('xs')}}>Contr. Barras</span>
              </button>
              <div className="relative" ref={themeSelectorRef}>
                <button
                  onClick={() => setIsThemeSelectorOpen(!isThemeSelectorOpen)}
                  className={`p-2 rounded-md font-semibold flex items-center transition-colors duration-150`}
                  style={{ backgroundColor: SEMANTIC_COLOR_VARS.buttonBg, color: SEMANTIC_COLOR_VARS.textColor, fontSize: getScaledFontSize('sm')}}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonHoverBg}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonBg}
                  aria-expanded={isThemeSelectorOpen}
                  title="Selecionar Tema"
                >
                  <div className="flex items-center space-x-1 mr-1">
                    {currentTheme.colors.previewColors.map((color, idx) => (
                      <div key={idx} className="w-3 h-3 rounded-sm border" style={{ backgroundColor: color, borderColor: SEMANTIC_COLOR_VARS.borderColor, transform: `scale(${globalUiScale})` }}></div>
                    ))}
                  </div>
                  {isThemeSelectorOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                {isThemeSelectorOpen && (
                  <div className="absolute right-0 mt-2 w-64 border rounded-md shadow-lg p-2 max-h-80 overflow-y-auto" style={{ backgroundColor: SEMANTIC_COLOR_VARS.cardBg, borderColor: SEMANTIC_COLOR_VARS.borderColor, zIndex: Z_INDICES.dropdowns }}>
                    {themes.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => { setCurrentThemeId(theme.id); setIsThemeSelectorOpen(false); }}
                        className={`block w-full text-left px-3 py-2 rounded hover:opacity-80 ${currentThemeId === theme.id ? 'font-semibold' : ''}`}
                        style={{ 
                          color: SEMANTIC_COLOR_VARS.textColor, 
                          backgroundColor: currentThemeId === theme.id ? SEMANTIC_COLOR_VARS.buttonHoverBg : 'transparent',
                          fontSize: getScaledFontSize('sm')
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = currentThemeId === theme.id ? SEMANTIC_COLOR_VARS.buttonHoverBg : SEMANTIC_COLOR_VARS.buttonBg}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = currentThemeId === theme.id ? SEMANTIC_COLOR_VARS.buttonHoverBg : 'transparent'}
                      >
                        <div className="flex items-center justify-between">
                          <span>{theme.name}</span>
                          <div className="flex space-x-1">
                            {theme.colors.previewColors.map((color, idx) => (
                              <div key={idx} className="w-3 h-3 rounded-sm border" style={{ backgroundColor: color, borderColor: SEMANTIC_COLOR_VARS.borderColor }}></div>
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
                className={`px-3 py-2 rounded-md font-semibold flex items-center transition-colors duration-150`}
                style={{ backgroundColor: SEMANTIC_COLOR_VARS.buttonBg, color: SEMANTIC_COLOR_VARS.textColor, fontSize: getScaledFontSize('sm')}}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonHoverBg}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonBg}
              >
                Anos: {yearReferenceMode === 'AC' ? 'aC' : 'Relativo'}
              </button>
              <div className="relative" ref={eventSelectorRef}>
                <button
                  onClick={() => setIsEventSelectorOpen(!isEventSelectorOpen)}
                  className={`p-2 rounded-md font-semibold flex items-center transition-colors duration-150`}
                  style={{ backgroundColor: SEMANTIC_COLOR_VARS.buttonBg, color: SEMANTIC_COLOR_VARS.textColor, fontSize: getScaledFontSize('sm')}}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonHoverBg}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonBg}
                  aria-expanded={isEventSelectorOpen}
                  title="Filtrar Eventos"
                >
                  <FilterIcon />
                  {isEventSelectorOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                {isEventSelectorOpen && (
                  <div className="absolute right-0 mt-2 w-72 md:w-96 border rounded-md shadow-lg p-4 max-h-96 overflow-y-auto" style={{ backgroundColor: SEMANTIC_COLOR_VARS.cardBg, borderColor: SEMANTIC_COLOR_VARS.borderColor, zIndex: Z_INDICES.dropdowns }}>
                    <h3 style={{ color: SEMANTIC_COLOR_VARS.cardHeaderColor, fontSize: getScaledFontSize('lg') }} className={`font-semibold mb-3`}>Selecionar Eventos</h3>
                    {groupedEvents.map(({ category, events: categoryEvents }) => ( 
                      <div key={category} className="mb-3">
                        <h4 style={{ color: SEMANTIC_COLOR_VARS.accentColor, borderColor: SEMANTIC_COLOR_VARS.borderColor, fontSize: getScaledFontSize('base')}} className={`capitalize font-medium mb-1 border-b pb-1`}>{category}</h4>
                        {categoryEvents.map(event => (
                          <label key={event.id} className="flex items-center space-x-2 p-1 hover:opacity-75 rounded cursor-pointer" style={{color: SEMANTIC_COLOR_VARS.textColor}}>
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
                  className={`p-2 rounded-md font-semibold flex items-center transition-colors duration-150`}
                  style={{ backgroundColor: SEMANTIC_COLOR_VARS.buttonBg, color: SEMANTIC_COLOR_VARS.textColor, fontSize: getScaledFontSize('sm')}}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonHoverBg}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonBg}
                  aria-expanded={isPersonVisibilityPanelOpen}
                  title="Visibilidade de Personagens"
                >
                  <PersonVisibilityPanelIcon isOpen={isPersonVisibilityPanelOpen} />
                  {isPersonVisibilityPanelOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                {isPersonVisibilityPanelOpen && (
                  <div className="absolute right-0 mt-2 w-72 md:w-96 border rounded-md shadow-lg p-4 max-h-96 overflow-y-auto" style={{ backgroundColor: SEMANTIC_COLOR_VARS.cardBg, borderColor: SEMANTIC_COLOR_VARS.borderColor, zIndex: Z_INDICES.dropdowns }}>
                    <h3 style={{ color: SEMANTIC_COLOR_VARS.cardHeaderColor, fontSize: getScaledFontSize('lg') }} className={`font-semibold mb-3`}>Mostrar/Ocultar Personagens</h3>
                    <button 
                        onClick={() => setHiddenCharacterIds([])}
                        className="w-full mb-3 px-3 py-1.5 rounded-md font-semibold transition-colors duration-150"
                        style={{ backgroundColor: SEMANTIC_COLOR_VARS.buttonBg, color: SEMANTIC_COLOR_VARS.textColor, fontSize: getScaledFontSize('sm')}}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonHoverBg}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = SEMANTIC_COLOR_VARS.buttonBg}
                    >
                        Mostrar Todos os Personagens
                    </button>
                    {peopleData.map(person => (
                      <label key={person.id} className="flex items-center space-x-2 p-1 hover:opacity-75 rounded cursor-pointer" style={{color: SEMANTIC_COLOR_VARS.textColor}}>
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
                <label htmlFor="globalUiScaleSlider" className={`block font-medium mb-0.5`} style={{color: SEMANTIC_COLOR_VARS.textColor, fontSize: getScaledFontSize('xs')}}>
                    Escala Geral UI: {globalUiScale.toFixed(1)}x
                </label>
                <input 
                    type="range" 
                    id="globalUiScaleSlider" min="0" max="100" step="1" 
                    value={globalUiScaleSliderValue} 
                    onChange={(e) => setGlobalUiScaleSliderValue(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: SEMANTIC_COLOR_VARS.accentColor, background: SEMANTIC_COLOR_VARS.borderColor }}
                />
            </div>
            <div className="flex-1 min-w-[180px] md:min-w-[200px]">
                <label htmlFor="horizontalScaleSlider" className={`block font-medium mb-0.5`} style={{color: SEMANTIC_COLOR_VARS.textColor, fontSize: getScaledFontSize('xs')}}>
                    Escala de Tempo (Zoom): {effectiveHorizontalScaleDisplay}x
                </label>
                <input 
                    type="range" 
                    id="horizontalScaleSlider" min="0" max="100" step="1" 
                    value={horizontalSliderValue} 
                    onChange={(e) => setHorizontalSliderValue(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: SEMANTIC_COLOR_VARS.accentColor, background: SEMANTIC_COLOR_VARS.borderColor }}
                />
            </div>
            <div className="flex-1 min-w-[180px] md:min-w-[200px]">
                <label htmlFor="verticalScaleSlider" className={`block font-medium mb-0.5`} style={{color: SEMANTIC_COLOR_VARS.textColor, fontSize: getScaledFontSize('xs')}}>
                     Escala Vertical (Detalhes): {effectiveVerticalScaleDisplay}x
                </label>
                <input 
                    type="range" 
                    id="verticalScaleSlider" min="0" max="100" step="1" 
                    value={verticalSliderValue} 
                    onChange={(e) => setVerticalSliderValue(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: SEMANTIC_COLOR_VARS.accentColor, background: SEMANTIC_COLOR_VARS.borderColor }}
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

      <footer className={`text-center p-3`} style={{ backgroundColor: SEMANTIC_COLOR_VARS.headerBg, color: SEMANTIC_COLOR_VARS.accentColor, fontSize: getScaledFontSize('xs') }}>
        Exploração Visual das Narrativas Fundacionais do Livro de Gênesis.
      </footer>
    </div>
  );
};

export default App;