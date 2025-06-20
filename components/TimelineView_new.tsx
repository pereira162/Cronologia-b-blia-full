// components/TimelineView.tsx
// Este componente é responsável por renderizar a visualização principal da linha do tempo,
// incluindo personagens, eventos, a régua de anos e interações como zoom e seleção.

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Person, BibleEvent, YearReferenceMode, TimelineViewProps } from '../types';
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  CloudArrowDownIcon,
  LinkIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import {
  LINE_THICKNESS_CLASSES,
  BASE_DIMENSIONS,
  Z_INDICES,
  BASE_PIXELS_PER_100_YEARS,
  CHARACTER_BAR_TEXT_PADDING_WITH_CONTROLS,
  CHARACTER_BAR_TEXT_PADDING_WITHOUT_CONTROLS
} from '../stylingConstants';

// Constantes estáticas para a linha do tempo
const STATIC_REFERENCE_AC_YEAR = 3848; 
const YEAR_MARKER_INTERVAL_MAJOR = 500;
const YEAR_MARKER_INTERVAL_MINOR = 100;
const HIDDEN_ICON_RADIUS_BASE = 6;

// Função para calcular as métricas da linha do tempo
const calculateTimelineMetrics = (allPeople: Person[], allEvents: BibleEvent[], yearMode: YearReferenceMode, effectiveHorizontalScale: number) => {
  const peopleWithYears = allPeople.filter(p => p.birthYear !== undefined);
  const eventsWithYears = allEvents.filter(e => e.year !== undefined);

  if (peopleWithYears.length === 0 && eventsWithYears.length === 0) {
    const defaultSpan = 1000;
    return {
      displayStartYear: yearMode === 'AC' ? STATIC_REFERENCE_AC_YEAR + 100 : -100,
      displayEndYear: yearMode === 'AC' ? STATIC_REFERENCE_AC_YEAR - defaultSpan : defaultSpan -100,
      totalPixelWidth: BASE_PIXELS_PER_100_YEARS * (defaultSpan/100) * effectiveHorizontalScale,
      referenceACForConversion: STATIC_REFERENCE_AC_YEAR,
    };
  }

  const referenceACForConversion = STATIC_REFERENCE_AC_YEAR;
  const getDisplayYearHelper = (relativeYear?: number): number | undefined => {
    if (relativeYear === undefined) return undefined;
    return yearMode === 'AC' ? referenceACForConversion - relativeYear : relativeYear;
  };

  const allBirthYears = peopleWithYears.map(p => getDisplayYearHelper(p.birthYear)).filter(y => y !== undefined) as number[];
  const allDeathYears = peopleWithYears.map(p => {
    if (p.deathYear !== undefined) return getDisplayYearHelper(p.deathYear);
    if (p.birthYear !== undefined && p.totalLifespan !== undefined) return getDisplayYearHelper(p.birthYear + p.totalLifespan);
    return undefined;
  }).filter(y => y !== undefined) as number[];
  const allEventYears = eventsWithYears.map(e => e.year ? getDisplayYearHelper(e.year) : undefined).filter(y => y !== undefined) as number[];

  let earliestDisplayYear = Math.min(...allBirthYears, ...allDeathYears, ...allEventYears, yearMode === 'AC' ? 0 : referenceACForConversion);
  let latestDisplayYear = Math.max(...allBirthYears, ...allDeathYears, ...allEventYears, yearMode === 'AC' ? referenceACForConversion : 0);

  if (allBirthYears.length === 0 && allEventYears.length === 0 && peopleWithYears.length === 0) {
     earliestDisplayYear = yearMode === 'AC' ? STATIC_REFERENCE_AC_YEAR - 500 : 0;
     latestDisplayYear = yearMode === 'AC' ? STATIC_REFERENCE_AC_YEAR + 500 : 500;
  }

  const padding = 100;
  if (yearMode === 'AC') {
    [earliestDisplayYear, latestDisplayYear] = [Math.min(earliestDisplayYear, latestDisplayYear), Math.max(earliestDisplayYear, latestDisplayYear)];
     earliestDisplayYear = Math.floor((earliestDisplayYear - padding) / 100) * 100;
     latestDisplayYear = Math.ceil((latestDisplayYear + padding) / 100) * 100;
  } else {
     earliestDisplayYear = Math.floor((earliestDisplayYear - padding) / 100) * 100;
     latestDisplayYear = Math.ceil((latestDisplayYear + padding) / 100) * 100;
  }

  const displayStartYear = yearMode === 'AC' ? latestDisplayYear : earliestDisplayYear;
  const displayEndYear = yearMode === 'AC' ? earliestDisplayYear : latestDisplayYear;

  const totalDataSpan = Math.abs(displayStartYear - displayEndYear);
  const estimatedPixelWidth = BASE_PIXELS_PER_100_YEARS * (totalDataSpan / 100) * effectiveHorizontalScale;

  return {
    displayStartYear,
    displayEndYear,
    totalPixelWidth: Math.max(1000 * effectiveHorizontalScale, estimatedPixelWidth),
    referenceACForConversion
  };
};

type PersonDisplayData = Person & {
  isVisible: boolean;
  displayBirthAC?: number;
  displayDeathAC?: number;
  displayBirthRelative?: number;
  displayDeathRelative?: number;
  x: number;
  y: number;
  barWidthPx: number;
  barColor: string;
  nonCovenantChildren: Person[];
  isDeathUnknown: boolean;
};

// Componente React TimelineView
const TimelineView: React.FC<TimelineViewProps> = ({
  people: allPeople, 
  events, 
  onSelectPerson, 
  onSelectEvent, 
  yearReferenceMode, 
  personBarPalette,
  horizontalScale: baseHorizontalScale, 
  verticalScale: baseVerticalScale, 
  globalUiScale,
  hiddenCharacterIds, 
  onToggleCharacterVisibility,
  showCharacterBarControls, 
  activePersonLifeLines, 
  onTogglePersonLifeLine,
  isYearRulerSticky: externalIsYearRulerSticky
}) => {
  
  const effectiveHorizontalScale = baseHorizontalScale * globalUiScale;
  const effectiveVerticalScale = baseVerticalScale * globalUiScale;

  const { displayStartYear, displayEndYear, totalPixelWidth, referenceACForConversion } = useMemo(
    () => calculateTimelineMetrics(allPeople, events, yearReferenceMode, effectiveHorizontalScale),
    [allPeople, events, yearReferenceMode, effectiveHorizontalScale]
  );
  const totalDataSpan = Math.abs(displayStartYear - displayEndYear);

  // Estado interno para controlar se a régua está fixa
  const [isYearRulerSticky, setIsYearRulerSticky] = useState(externalIsYearRulerSticky ?? true);
  
  // Sincronizar estado interno com prop externa
  useEffect(() => {
    console.log('useEffect - externalIsYearRulerSticky mudou para:', externalIsYearRulerSticky);
    if (externalIsYearRulerSticky !== undefined) {
      setIsYearRulerSticky(externalIsYearRulerSticky);
    }
  }, [externalIsYearRulerSticky]);

  // Log para debug
  useEffect(() => {
    console.log('Estado atual da régua:', isYearRulerSticky);
  }, [isYearRulerSticky]);

  // Dimensões escalonadas
  const SCALED_BAR_HEIGHT = BASE_DIMENSIONS.characterBarHeight * effectiveVerticalScale;
  const SCALED_SIBLING_BAR_HEIGHT = BASE_DIMENSIONS.siblingBarHeight * effectiveVerticalScale;
  const SCALED_BAR_VERTICAL_GAP = BASE_DIMENSIONS.barVerticalGap * effectiveVerticalScale;
  const SCALED_SIBLING_VERTICAL_GAP = BASE_DIMENSIONS.siblingVerticalGap * effectiveVerticalScale;
  const SCALED_YEAR_HEADER_HEIGHT = BASE_DIMENSIONS.yearHeaderHeight * globalUiScale; 
  
  const SCALED_PERSON_BLOCK_ACTUAL_START_Y = useMemo(() => {
    if (isYearRulerSticky) {
      return SCALED_YEAR_HEADER_HEIGHT + (BASE_DIMENSIONS.personBlockGapBelowStickyRuler * effectiveVerticalScale) + 20;
    } else {
      return (BASE_DIMENSIONS.personBlockGapWithNonStickyRuler * effectiveVerticalScale) + 30;
    }
  }, [isYearRulerSticky, SCALED_YEAR_HEADER_HEIGHT, effectiveVerticalScale]);
  
  const SCALED_EVENT_LABEL_MAX_HEIGHT = BASE_DIMENSIONS.eventLabelEstimatedHeight * globalUiScale;
  const SCALED_EVENT_MIN_VERTICAL_GAP = BASE_DIMENSIONS.eventMinVerticalGap * effectiveVerticalScale;

  // Font sizes
  const characterNameFontSize = `calc(var(--dynamic-font-size-lg) * ${globalUiScale})`;  
  const lifespanTextFontSize = `calc(var(--dynamic-font-size-sm) * ${globalUiScale})`;   
  const siblingNameFontSize = `calc(var(--dynamic-font-size-md) * ${globalUiScale})`;  
  const yearMarkerMajorFontSize = `calc(var(--dynamic-font-size-md) * ${globalUiScale})`;  
  const yearMarkerMinorFontSize = `calc(var(--dynamic-font-size-sm) * ${globalUiScale})`;  
  const eventIconFontSize = `calc(var(--dynamic-font-size-md) * ${globalUiScale})`;  
  const eventTextFontSize = `calc(var(--dynamic-font-size-xl) * ${globalUiScale})`;  
  const dateLineLabelFontSize = `calc(var(--dynamic-font-size-xs) * ${globalUiScale})`;  

  const [expandedSiblingGroups, setExpandedSiblingGroups] = useState<Record<string, boolean>>({});
  const mainTimelineContentRef = useRef<HTMLDivElement>(null); 
  const [timelineHeight, setTimelineHeight] = useState(0);

  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rulerContentRef = useRef<HTMLDivElement>(null);

  // Sistema de sincronização de scroll
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const rulerContainer = rulerContentRef.current;
    
    if (!scrollContainer || !rulerContainer) return;
    
    let isScrolling = false;
    
    const syncScroll = (sourceScrollLeft: number) => {
      if (isScrolling) return;
      
      isScrolling = true;
      setScrollPosition(sourceScrollLeft);
      
      if (scrollContainer.scrollLeft !== sourceScrollLeft) {
        scrollContainer.scrollLeft = sourceScrollLeft;
      }
      
      if (rulerContainer && rulerContainer.scrollLeft !== sourceScrollLeft) {
        rulerContainer.scrollLeft = sourceScrollLeft;
      }
      
      requestAnimationFrame(() => {
        isScrolling = false;
      });
    };
    
    const handleMainScroll = () => {
      syncScroll(scrollContainer.scrollLeft);
    };
    
    const handleRulerScroll = () => {
      syncScroll(rulerContainer?.scrollLeft || 0);
    };
    
    scrollContainer.addEventListener('scroll', handleMainScroll, { passive: true });
    rulerContainer.addEventListener('scroll', handleRulerScroll, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleMainScroll);
      rulerContainer.removeEventListener('scroll', handleRulerScroll);
    };
  }, []);

  // Funções auxiliares
  const getFloatingNamePosition = (personX: number, personWidth: number, nameWidth: number = 150) => {
    const visibleStart = scrollPosition;
    
    if (personX < visibleStart && (personX + personWidth) > visibleStart) {
      return Math.min(visibleStart + 10, personX + personWidth - nameWidth);
    }
    
    return personX;
  };

  const calculateEventAlignment = (events: any[], currentEventIndex: number, eventX: number) => {
    const PROXIMITY_THRESHOLD = 100;
    
    let alignmentStyle = 'center';
    let offsetX = 0;
    
    for (let i = 0; i < events.length; i++) {
      if (i === currentEventIndex) continue;
      
      const otherEvent = events[i];
      const otherEventX = getPixelX(getDisplayYear(otherEvent.year));
      const distance = Math.abs(eventX - otherEventX);
      
      if (distance < PROXIMITY_THRESHOLD) {
        if (eventX < otherEventX) {
          alignmentStyle = 'right';
          offsetX = -60;
        } else {
          alignmentStyle = 'left';
          offsetX = 60;
        }
        break;
      }
    }
    
    return { alignmentStyle, offsetX };
  };

  const calculateIndividualYearAlignment = (allYearsData: { year: number, x: number, id: string, type: string }[], currentIndex: number) => {
    const PROXIMITY_THRESHOLD = 60;
    const currentYearData = allYearsData[currentIndex];
    
    let alignmentClass = 'text-center';
    let containerWidth = '80px';
    
    for (let i = 0; i < allYearsData.length; i++) {
      if (i === currentIndex) continue;
      
      const otherYearData = allYearsData[i];
      const distance = Math.abs(currentYearData.x - otherYearData.x);
      
      if (distance < PROXIMITY_THRESHOLD) {
        containerWidth = '120px';
        if (currentYearData.year < otherYearData.year) {
          alignmentClass = 'text-right';
        } else {
          alignmentClass = 'text-left';
        }
        break;
      }
    }
    
    return { alignmentClass, containerWidth };
  };

  const getDisplayYear = (relativeYear?: number): number | undefined => {
    if (relativeYear === undefined) return undefined;
    return yearReferenceMode === 'AC' ? referenceACForConversion - relativeYear : relativeYear;
  };

  const getPixelX = (yearToDisplay?: number): number => {
    if (yearToDisplay === undefined || totalDataSpan <= 0) return 0;
    if (yearReferenceMode === 'AC') {
      return ((displayStartYear - yearToDisplay) / totalDataSpan) * totalPixelWidth;
    } else {
      return ((yearToDisplay - displayStartYear) / totalDataSpan) * totalPixelWidth;
    }
  };

  const sortedAllPeople = useMemo(() =>
    [...allPeople].sort((a, b) => (a.birthYear || 0) - (b.birthYear || 0)),
  [allPeople]);

  const yearMarkers = useMemo(() => {
    const markers = [];
    if (totalDataSpan <=0) return []; 
    const start = Math.min(displayStartYear, displayEndYear);
    const end = Math.max(displayStartYear, displayEndYear);

    let currentMinorInterval = YEAR_MARKER_INTERVAL_MINOR;
    if (effectiveHorizontalScale < 0.5) currentMinorInterval = 200;
    if (effectiveHorizontalScale < 0.3) currentMinorInterval = 500;
    if (effectiveHorizontalScale > 2) currentMinorInterval = 50;

    for (let yr = Math.floor(start / currentMinorInterval) * currentMinorInterval; yr <= Math.ceil(end / currentMinorInterval) * currentMinorInterval; yr += currentMinorInterval) {
       if (yr >= start && yr <= end ) { 
        markers.push({
          year: yr,
          isMajor: yr % YEAR_MARKER_INTERVAL_MAJOR === 0 || (effectiveHorizontalScale < 0.3 && yr % 500 === 0), 
          x: getPixelX(yr)
        });
      }
    }
    return markers.sort((a,b) => a.x - b.x); 
  }, [displayStartYear, displayEndYear, totalPixelWidth, yearReferenceMode, effectiveHorizontalScale, getPixelX, totalDataSpan]);

  // Renderização da régua de anos
  const renderYearRuler = () => {
    return (
      <div
        style={{ 
          height: `${SCALED_YEAR_HEADER_HEIGHT}px`, 
          width: `${totalPixelWidth}px`,
        }}
        className="flex items-end px-4 bg-theme-header-bg relative"
        aria-hidden="true"
      >
        {/* Anos principais e menores */}
        {yearMarkers.map(marker => (
          <div key={`year-marker-${marker.year}-${marker.x}`} style={{ position: 'absolute', left: `${marker.x}px`, bottom: marker.isMajor ? '0px' : '8px'}} className="h-full flex flex-col items-center justify-end">
              <span 
                className={`${marker.isMajor ? 'text-theme-year-marker-major dynamic-text-md' : 'text-theme-year-marker-minor dynamic-text-sm'}`}
                style={{ 
                fontSize: marker.isMajor ? yearMarkerMajorFontSize : yearMarkerMinorFontSize,
                fontWeight: marker.isMajor ? 'bold' : 'normal',
                opacity: marker.isMajor ? 1 : 0.8,
              }}>
              {Math.round(marker.year)} {yearReferenceMode === 'AC' ? <span className="dynamic-text-xs" style={{fontSize: `calc(var(--dynamic-font-size-xs) * ${globalUiScale})`}}>aC</span> : ''}
            </span>
            <div 
              className={`w-px ${marker.isMajor ? 'bg-theme-year-marker-major' : 'bg-theme-year-marker-minor'}`} 
              style={{ height: marker.isMajor ? BASE_DIMENSIONS.timelineMarkerMajorHeight * globalUiScale : (BASE_DIMENSIONS.timelineMarkerMinorHeight * globalUiScale) }}
            ></div>
          </div>
        ))}

        {/* Eventos */}
        {events.map((event, eventIndex) => { 
          const eventDisplayYear = getDisplayYear(event.year);
          if (eventDisplayYear === undefined) return null;
          const eventX = getPixelX(eventDisplayYear);
          
          const { alignmentStyle, offsetX } = calculateEventAlignment(events, eventIndex, eventX);
          
          let transform = 'translateX(-50%)';
          if (alignmentStyle === 'left') {
            transform = 'translateX(-100%)';
          } else if (alignmentStyle === 'right') {
            transform = 'translateX(0%)';
          }
          
          return (
            <div 
              key={`event-ruler-${event.id}-${isYearRulerSticky ? 'sticky' : 'normal'}`} 
              style={{ 
                position: 'absolute', 
                left: `${eventX + offsetX}px`, 
                bottom: '50px',
                transform: transform
              }} 
              className="flex flex-col items-center"
            >
              <span className="px-1 rounded bg-theme-timeline-label-bg text-theme-timeline-label-text dynamic-text-sm whitespace-nowrap" 
                    style={{fontSize: yearMarkerMinorFontSize}}>
                {Math.round(eventDisplayYear)} {yearReferenceMode === 'AC' ? 'aC' : ''}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex overflow-hidden relative bg-theme-app-bg">
      <div 
        className="flex-grow h-full relative overflow-hidden" 
        role="region" 
        aria-label="Linha do Tempo Genealógica"
      >
        {/* Régua cronológica sticky - apenas quando isYearRulerSticky é true */}
        {isYearRulerSticky && (
          <div 
            className="w-full overflow-x-auto overflow-y-hidden"
            style={{
              position: 'sticky',
              top: 0,
              zIndex: Z_INDICES.yearHeader,
              height: `${SCALED_YEAR_HEADER_HEIGHT}px`
            }}
            ref={rulerContentRef}
          >
            {renderYearRuler()}
          </div>
        )}

        {/* Conteúdo principal */}
        <div 
          className="flex-grow overflow-x-auto overflow-y-auto" 
          id="timeline-scroll-container" 
          ref={scrollContainerRef}
        >
          {/* Régua cronológica não-sticky - apenas quando isYearRulerSticky é false */}
          {!isYearRulerSticky && (
            <div 
              className="w-full overflow-x-auto overflow-y-hidden"
              style={{
                position: 'relative',
                zIndex: Z_INDICES.yearHeader,
                height: `${SCALED_YEAR_HEADER_HEIGHT}px`
              }}
              ref={rulerContentRef}
            >
              {renderYearRuler()}
            </div>
          )}

          <div
            ref={mainTimelineContentRef}
            className="relative timeline-bg-gradient"
            style={{
              width: `${totalPixelWidth}px`,
              minHeight: `${timelineHeight}px`, 
              paddingTop: isYearRulerSticky ? `0px` : `20px`,
              zIndex: Z_INDICES.timelineBackground,
            }}
          >
            {/* Placeholder para o resto do conteúdo da timeline */}
            <div style={{ height: '400px', background: 'rgba(0,0,0,0.1)' }}>
              <p style={{ padding: '20px', color: 'var(--theme-text)' }}>
                Conteúdo da timeline aqui...
                <br />
                Régua está: {isYearRulerSticky ? 'FIXA (sticky)' : 'NÃO FIXA (scrollable)'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
