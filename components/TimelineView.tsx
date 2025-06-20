// components/TimelineView.tsx
// Este componente é responsável por renderizar a visualização principal da linha do tempo,
// incluindo personagens, eventos, a régua de anos e interações como zoom e seleção.

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Person, BibleEvent, YearReferenceMode, TimelineViewProps, EventCardPosition, TimeComparisonItem } from '../types'; // Removed unused IconProps
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  CloudArrowDownIcon, // Corrected from CloudRainIcon
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
const YEAR_MARKER_INTERVAL_MAJOR = 500; // Intervalo para marcadores de ano principais
const YEAR_MARKER_INTERVAL_MINOR = 100; // Intervalo para marcadores de ano secundários
const HIDDEN_ICON_RADIUS_BASE = 6; // Raio base para o ícone "+" de personagem oculto no arco

// Ruler zone visibility state interface
interface RulerZoneVisibility {
  events: boolean;
  births: boolean;
  deaths: boolean;
}

// Utility function to calculate text width for dynamic event card sizing
const calculateTextWidth = (text: string, fontSize: string, fontFamily: string = 'Arial, sans-serif'): number => {
  // Create a temporary canvas element to measure text
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return text.length * 8; // Fallback to rough estimate
  
  context.font = `${fontSize} ${fontFamily}`;
  const metrics = context.measureText(text);
  canvas.remove(); // Clean up
  
  return metrics.width;
};

// Dynamic sizing for event labels based on text content
const getEventLabelDimensions = (eventName: string, globalUiScale: number) => {
  const eventTextFontSize = `calc(1.4rem * ${globalUiScale})`;
  const baseFontSizePx = 1.4 * globalUiScale * 16; // Convert rem to px (assuming 16px base)
  
  // Calculate width based on text content with padding
  const textWidth = calculateTextWidth(eventName, `${baseFontSizePx}px`);
  const minWidth = 80 * globalUiScale; // Minimum width
  const maxWidth = 200 * globalUiScale; // Maximum width
  const padding = 16 * globalUiScale; // Horizontal padding
  
  const dynamicWidth = Math.max(minWidth, Math.min(maxWidth, textWidth + padding));
  
  return {
    width: dynamicWidth,
    height: 200 * globalUiScale, // Keep height consistent for now
    fontSize: eventTextFontSize
  };
};

// --- Ícones Helper --- (Old icon components removed)

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

  if (allBirthYears.length === 0 && allEventYears.length === 0 && peopleWithYears.length === 0) { // fallback if no data
     earliestDisplayYear = yearMode === 'AC' ? STATIC_REFERENCE_AC_YEAR - 500 : 0;
     latestDisplayYear = yearMode === 'AC' ? STATIC_REFERENCE_AC_YEAR + 500 : 500;
  }

  const padding = 100; // Add some padding to the timeline range
  if (yearMode === 'AC') {
    // For AC mode, smaller year numbers are later in time. We want the "earliest" time (largest number) and "latest" time (smallest number).
    [earliestDisplayYear, latestDisplayYear] = [Math.min(earliestDisplayYear, latestDisplayYear), Math.max(earliestDisplayYear, latestDisplayYear)];
     // Ensure range includes some buffer
     earliestDisplayYear = Math.floor((earliestDisplayYear - padding) / 100) * 100; // e.g. 3898 -> 3800
     latestDisplayYear = Math.ceil((latestDisplayYear + padding) / 100) * 100; // e.g. 0 -> 100 or 2000 -> 2100
  } else {
    // For Relative mode, smaller year numbers are earlier.
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
    totalPixelWidth: Math.max(1000 * effectiveHorizontalScale, estimatedPixelWidth), // Ensure a minimum width
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
  people: allPeople, events, onSelectPerson, onSelectEvent, yearReferenceMode, personBarPalette,
  horizontalScale: baseHorizontalScale, verticalScale: baseVerticalScale, globalUiScale,
  hiddenCharacterIds, onToggleCharacterVisibility,
  showCharacterBarControls, activePersonLifeLines, onTogglePersonLifeLine,
  isYearRulerSticky: externalIsYearRulerSticky,
  eventCardPositions,
  onEventCardPositionChange,
  timeComparison,
  onTimeComparisonItemSelect
}) => {
  
  const effectiveHorizontalScale = baseHorizontalScale * globalUiScale;
  const effectiveVerticalScale = baseVerticalScale * globalUiScale;

  const { displayStartYear, displayEndYear, totalPixelWidth, referenceACForConversion } = useMemo(
    () => calculateTimelineMetrics(allPeople, events, yearReferenceMode, effectiveHorizontalScale),
    [allPeople, events, yearReferenceMode, effectiveHorizontalScale]
  );
  const totalDataSpan = Math.abs(displayStartYear - displayEndYear);
  const [isYearRulerSticky, setIsYearRulerSticky] = useState(externalIsYearRulerSticky ?? true);
  
  // Sync internal state with external prop - força atualização
  useEffect(() => {
    setIsYearRulerSticky(externalIsYearRulerSticky ?? true);
  }, [externalIsYearRulerSticky]);

  // Dimensões escalonadas
  const SCALED_BAR_HEIGHT = BASE_DIMENSIONS.characterBarHeight * effectiveVerticalScale;
  const SCALED_SIBLING_BAR_HEIGHT = BASE_DIMENSIONS.siblingBarHeight * effectiveVerticalScale;
  const SCALED_BAR_VERTICAL_GAP = BASE_DIMENSIONS.barVerticalGap * effectiveVerticalScale;
  const SCALED_SIBLING_VERTICAL_GAP = BASE_DIMENSIONS.siblingVerticalGap * effectiveVerticalScale;
  
  const SCALED_EVENT_LABEL_MAX_HEIGHT = BASE_DIMENSIONS.eventLabelEstimatedHeight * globalUiScale;
  const SCALED_EVENT_MIN_VERTICAL_GAP = BASE_DIMENSIONS.eventMinVerticalGap * effectiveVerticalScale;

  // Font sizes using dynamic font system + globalUiScale - Updates automatically
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
  // Event card dragging state
  const [draggingEventId, setDraggingEventId] = useState<string | null>(null);
  const [dragStartY, setDragStartY] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rulerContentRef = useRef<HTMLDivElement>(null);
  
  // Ruler zone visibility state
  const [rulerZoneVisibility, setRulerZoneVisibility] = useState<RulerZoneVisibility>({
    events: true,
    births: true,
    deaths: true
  });
  
  // Robust scroll synchronization system - always syncs ruler when visible
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const rulerContainer = rulerContentRef.current;
    
    if (!scrollContainer || !rulerContainer) return;
    
    let isScrolling = false;
    
    const syncScroll = (sourceScrollLeft: number) => {
      if (isScrolling) return;
      
      isScrolling = true;
      
      // Update scroll position state for floating elements
      setScrollPosition(sourceScrollLeft);
      
      // Perfect synchronization: both containers use exact same scroll position
      if (scrollContainer.scrollLeft !== sourceScrollLeft) {
        scrollContainer.scrollLeft = sourceScrollLeft;
      }
      
      // Always sync ruler since it's always visible now
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
    
    // Add scroll listeners with passive: true for better performance
    scrollContainer.addEventListener('scroll', handleMainScroll, { passive: true });
    rulerContainer.addEventListener('scroll', handleRulerScroll, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleMainScroll);
      rulerContainer.removeEventListener('scroll', handleRulerScroll);
    };
  }, []);// Calculate floating name position
  const getFloatingNamePosition = (personX: number, personWidth: number, nameWidth: number = 150) => {
    const visibleStart = scrollPosition;
    
    // If person bar starts before visible area and extends into it
    if (personX < visibleStart && (personX + personWidth) > visibleStart) {
      return Math.min(visibleStart + 10, personX + personWidth - nameWidth);
    }
    
    // If person bar is fully visible or starts in visible area
    return personX;
  };
  // Sistema de detecção de proximidade e alinhamento anti-sobreposição
  const calculateEventAlignment = (events: any[], currentEventIndex: number, eventX: number) => {
    const PROXIMITY_THRESHOLD = 100; // Distância em pixels para considerar próximo
    
    let alignmentStyle = 'center'; // Padrão: centralizado
    let offsetX = 0;
    
    // Verificar eventos próximos
    for (let i = 0; i < events.length; i++) {
      if (i === currentEventIndex) continue;
      
      const otherEvent = events[i];
      const otherEventX = getPixelX(getDisplayYear(otherEvent.year));
      const distance = Math.abs(eventX - otherEventX);
      
      if (distance < PROXIMITY_THRESHOLD) {
        // Eventos próximos detectados - aplicar estratégia anti-sobreposição
        if (eventX < otherEventX) {
          // Evento atual está mais no passado - alinhar à direita
          alignmentStyle = 'right';
          offsetX = -60; // Move para a direita da linha
        } else {
          // Evento atual está mais no futuro - alinhar à esquerda
          alignmentStyle = 'left';
          offsetX = 60; // Move para a esquerda da linha
        }
        break; // Primeira proximidade encontrada já define o alinhamento
      }
    }
      return { alignmentStyle, offsetX };
  };
  
  // Event card dragging and positioning functions
  const getEventCardPosition = (eventId: string): EventCardPosition => {
    return eventCardPositions[eventId] || {
      eventId,
      x: 0,
      y: 100, // Default vertical offset from timeline
      alignment: 'center',
      isDragging: false
    };
  };
  const handleEventCardDragStart = (eventId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setDraggingEventId(eventId);
    setDragStartY(event.clientY);
    
    // Update position to show dragging state
    onEventCardPositionChange(eventId, { isDragging: true });
  };

  const handleEventCardDrag = (event: MouseEvent) => {
    if (!draggingEventId) return;
    
    const deltaY = event.clientY - dragStartY;
    const currentPosition = getEventCardPosition(draggingEventId);
    
    // Calculate new Y position with constraints
    let newY = currentPosition.y + deltaY;
    
    // Prevent dragging too high (minimum 20px from top)
    newY = Math.max(20, newY);
    
    // Prevent dragging below timeline (maximum timeline height - 50px)
    newY = Math.min(timelineHeight - 50, newY);
    
    // Check for collisions with other event cards and adjust
    newY = avoidEventCardCollisions(draggingEventId, newY);
    
    onEventCardPositionChange(draggingEventId, { y: newY });
    setDragStartY(event.clientY);
  };
  const handleEventCardDragEnd = () => {
    if (!draggingEventId) return;
    
    onEventCardPositionChange(draggingEventId, { isDragging: false });
    setDraggingEventId(null);
    setDragStartY(0);
  };

  const avoidEventCardCollisions = (currentEventId: string, proposedY: number): number => {
    const CARD_HEIGHT = 40; // Approximate event card height
    const MIN_GAP = 10; // Minimum gap between cards
    
    // Get all other event card positions
    const otherPositions = Object.values(eventCardPositions).filter(pos => pos.eventId !== currentEventId);
    
    for (const otherPos of otherPositions) {
      const distance = Math.abs(proposedY - otherPos.y);
      
      if (distance < CARD_HEIGHT + MIN_GAP) {
        // Collision detected, find a safe position
        if (proposedY > otherPos.y) {
          // Move below the other card
          proposedY = otherPos.y + CARD_HEIGHT + MIN_GAP;
        } else {
          // Move above the other card
          proposedY = otherPos.y - CARD_HEIGHT - MIN_GAP;
        }
      }
    }
    
    return proposedY;
  };

  const handleEventCardAlignmentChange = (eventId: string, alignment: 'left' | 'center' | 'right') => {
    onEventCardPositionChange(eventId, { alignment });
  };
  // Add global event listeners for dragging
  useEffect(() => {
    if (draggingEventId) {
      const handleMouseMove = (e: MouseEvent) => handleEventCardDrag(e);
      const handleMouseUp = () => handleEventCardDragEnd();
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
    return undefined;
  }, [draggingEventId, dragStartY]);

  // Sistema simplificado de detecção de proximidade para datas na régua
  const calculateIndividualYearAlignment = (allYearsData: { year: number, x: number, id: string, type: string }[], currentIndex: number) => {
    const PROXIMITY_THRESHOLD = 60; // Distância em pixels para considerar próximo
    const currentYearData = allYearsData[currentIndex];
    
    let alignmentClass = 'text-center'; // Padrão: centralizado
    let containerWidth = '80px'; // Largura padrão do container
    
    // Verificar TODOS os outros anos individualmente (nascimento, morte de qualquer personagem)
    for (let i = 0; i < allYearsData.length; i++) {
      if (i === currentIndex) continue; // Pular o próprio ano
      
      const otherYearData = allYearsData[i];
      const distance = Math.abs(currentYearData.x - otherYearData.x);
      
      if (distance < PROXIMITY_THRESHOLD) {
        // Proximidade detectada - aplicar estratégia baseada no ANO, não no personagem
        containerWidth = '120px'; // Container maior para acomodar o deslocamento
        if (currentYearData.year < otherYearData.year) {
          // Ano atual está mais no PASSADO → alinhar à DIREITA
          alignmentClass = 'text-right';
        } else {
          // Ano atual está mais no FUTURO → alinhar à ESQUERDA  
          alignmentClass = 'text-left';
        }
        break; // Primeira proximidade encontrada já define o alinhamento
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
    }  };

  // Calculate Y positions - must be defined before useMemos that depend on it
  // Simplified calculation to avoid circular dependencies
  const SCALED_PERSON_BLOCK_ACTUAL_START_Y: number = useMemo(() => {
    const baseRulerHeight = BASE_DIMENSIONS.yearHeaderHeight * globalUiScale;
    if (isYearRulerSticky) {
      return baseRulerHeight + (BASE_DIMENSIONS.personBlockGapBelowStickyRuler * effectiveVerticalScale) - 90 + 20;
    } else {
      return (BASE_DIMENSIONS.personBlockGapWithNonStickyRuler * effectiveVerticalScale) + 30;
    }
  }, [isYearRulerSticky, globalUiScale, effectiveVerticalScale]);

  const sortedAllPeople = useMemo(() =>
    [...allPeople].sort((a, b) => (a.birthYear || 0) - (b.birthYear || 0)),
  [allPeople]);

  const mainCovenantPeopleDisplayDataWithVisibility = useMemo(() => {
    return sortedAllPeople
      .filter(p => p.isCovenantLine)
      .map((person, index) => {
        const isVisible = !hiddenCharacterIds.includes(person.id);
        const personBirthDisplay = getDisplayYear(person.birthYear);
        let personDeathDisplay: number | undefined;

        if (person.deathYear !== undefined) {
          personDeathDisplay = getDisplayYear(person.deathYear);
        } else if (person.birthYear !== undefined && person.totalLifespan !== undefined) {
          personDeathDisplay = getDisplayYear(person.birthYear + person.totalLifespan);
        } else if (person.birthYear !== undefined) {
          // Fallback if no death/lifespan info, assume a short visible bar
          personDeathDisplay = getDisplayYear(person.birthYear + 100); // e.g., 100 years default lifespan for display
        }

        const x = getPixelX(personBirthDisplay);
        let barWidthPx = 0;
        if (personDeathDisplay !== undefined && personBirthDisplay !== undefined) {
          barWidthPx = Math.abs(getPixelX(personDeathDisplay) - getPixelX(personBirthDisplay));
        }
        barWidthPx = Math.max(BASE_DIMENSIONS.minBarWidthPx * effectiveVerticalScale, barWidthPx);

        const barColor = personBarPalette[index % personBarPalette.length];

        // Find children for this person from the *globally sorted* list
        const actualChildren = (person.childrenIds || [])
            .map(childId => sortedAllPeople.find(p => p.id === childId))
            .filter(Boolean) as Person[];
        const nonCovenantChildren = actualChildren.filter(c => !c.isCovenantLine);

        return {
          ...person,
          isVisible,
          displayBirthAC: yearReferenceMode === 'AC' ? personBirthDisplay : undefined,
          displayDeathAC: yearReferenceMode === 'AC' ? personDeathDisplay : undefined,
          displayBirthRelative: yearReferenceMode === 'Relative' ? personBirthDisplay : undefined,
          displayDeathRelative: yearReferenceMode === 'Relative' ? personDeathDisplay : undefined,
          x,
          y: 0, // Y will be calculated later based on visibility and expansion
          barWidthPx,
          barColor,
          nonCovenantChildren,
          isDeathUnknown: person.deathYear === undefined && (person.totalLifespan === undefined),
        } as PersonDisplayData;
      });
  }, [sortedAllPeople, yearReferenceMode, referenceACForConversion, personBarPalette, effectiveVerticalScale, hiddenCharacterIds, getDisplayYear, getPixelX, displayStartYear, totalDataSpan, totalPixelWidth]);

  // Calculate Y positions for visible main covenant people
  const visibleMainCovenantPeopleDisplayData = useMemo(() => {
    let currentY = SCALED_PERSON_BLOCK_ACTUAL_START_Y;
    return mainCovenantPeopleDisplayDataWithVisibility
      .filter(p => p.isVisible)
      .map(p => {
        const y = currentY;
        currentY += SCALED_BAR_HEIGHT + SCALED_BAR_VERTICAL_GAP;
        // Add space for expanded siblings if any
        if (expandedSiblingGroups[p.id]) {
          const visibleSiblings = p.nonCovenantChildren.filter(s => !hiddenCharacterIds.includes(s.id));
          if (visibleSiblings.length > 0) {
            currentY += (visibleSiblings.length * (SCALED_SIBLING_BAR_HEIGHT + SCALED_SIBLING_VERTICAL_GAP)) + SCALED_BAR_VERTICAL_GAP; // Extra gap after sibling block
          }
        }
        return { ...p, y };
      });
  }, [mainCovenantPeopleDisplayDataWithVisibility, expandedSiblingGroups, hiddenCharacterIds, effectiveVerticalScale, SCALED_BAR_HEIGHT, SCALED_BAR_VERTICAL_GAP, SCALED_SIBLING_BAR_HEIGHT, SCALED_SIBLING_VERTICAL_GAP, SCALED_PERSON_BLOCK_ACTUAL_START_Y]);

// Fix: Hoist processedEventsData definition before its use in timelineHeight useEffect.
// Fix: Remove timelineHeight dependency from processedEventsData and adjust logic.
const processedEventsData = useMemo(() => {
    const sortedInputEvents = [...events]
      .map(event => {
        const eventDisplayYear = getDisplayYear(event.year);
        if (eventDisplayYear === undefined) return null;
        return { ...event, eventDisplayYear, xPos: getPixelX(eventDisplayYear) };
      })
      .filter((event): event is NonNullable<typeof event> => event !== null)
      .sort((a, b) => a.xPos - b.xPos);

    const allBarsForCollision = visibleMainCovenantPeopleDisplayData.flatMap(p => {
        const characterBars: Array<{ x: number, y: number, width: number, height: number, id: string }> = [{
            x: p.x, y: p.y, width: p.barWidthPx, height: SCALED_BAR_HEIGHT, id: `main-${p.id}`
        }];
        if (expandedSiblingGroups[p.id]) {
            let sY = p.y + SCALED_BAR_HEIGHT + SCALED_BAR_VERTICAL_GAP;
            p.nonCovenantChildren
                .filter(s => !hiddenCharacterIds.includes(s.id))
                .forEach(sibling => {
                    const siblingBirthDisplay = getDisplayYear(sibling.birthYear);
                    const siblingX = siblingBirthDisplay !== undefined ? getPixelX(siblingBirthDisplay) : p.x; 
                    
                    let siblingDeathDisplay: number | undefined;
                    if(sibling.deathYear !== undefined) siblingDeathDisplay = getDisplayYear(sibling.deathYear);
                    else if (sibling.birthYear !== undefined && sibling.totalLifespan !== undefined) siblingDeathDisplay = getDisplayYear(sibling.birthYear + sibling.totalLifespan);
                    else if (sibling.birthYear !== undefined) siblingDeathDisplay = getDisplayYear(sibling.birthYear + 100); 

                    let siblingBarWidthPx = 0;
                    if (siblingDeathDisplay !== undefined && siblingBirthDisplay !== undefined) {
                        siblingBarWidthPx = Math.abs(getPixelX(siblingDeathDisplay) - getPixelX(siblingBirthDisplay));
                    }
                    siblingBarWidthPx = Math.max(BASE_DIMENSIONS.minSiblingBarWidthPx * effectiveVerticalScale, siblingBarWidthPx);

                    characterBars.push({
                        x: siblingX, y: sY, width: siblingBarWidthPx, height: SCALED_SIBLING_BAR_HEIGHT, id: `sibling-${sibling.id}`
                    });
                    sY += SCALED_SIBLING_BAR_HEIGHT + SCALED_SIBLING_VERTICAL_GAP;
                });
        }
        return characterBars;
    });

    const placedEventTitlesLayout: Array<{ x: number, y: number, width: number, height: number, id: string, eventLineX: number }> = [];
    const pixelsFor30Years = (30 / totalDataSpan) * totalPixelWidth;    return sortedInputEvents.map(event => {
        const eventX = event.xPos;
        // Dynamic sizing based on event name length
        const labelDimensions = getEventLabelDimensions(event.name, globalUiScale);
        const eventLabelWidth = labelDimensions.width; 
        const eventLabelHeight = labelDimensions.height;

        const checkCollision = (
            targetX: number, targetY: number, targetW: number, targetH: number, 
            itemX: number, itemY: number, itemW: number, itemH: number,
            isEventTitleCollisionCheck: boolean = false, currentEventLineX?: number, itemEventLineX?: number
        ) => {
            const horizontalOverlap = targetX < itemX + itemW && targetX + targetW > itemX;
            if (!horizontalOverlap) return false;

            if (isEventTitleCollisionCheck && currentEventLineX !== undefined && itemEventLineX !== undefined) {
                 const horizontalLineDistance = Math.abs(currentEventLineX - itemEventLineX);
                 if (horizontalLineDistance >= pixelsFor30Years) { // If event lines are far apart, labels can overlap horizontally if Y is different enough
                     const verticalNoOverlap = targetY + targetH + SCALED_EVENT_MIN_VERTICAL_GAP <= itemY || targetY >= itemY + itemH + SCALED_EVENT_MIN_VERTICAL_GAP;
                     if (verticalNoOverlap) return false; // No collision if Y is far enough
                 }
                 // If lines are close, or if Y is close, then check standard vertical overlap
            }

            const verticalOverlap = 
                (targetY < itemY + itemH + SCALED_EVENT_MIN_VERTICAL_GAP) && 
                (targetY + targetH + SCALED_EVENT_MIN_VERTICAL_GAP > itemY);
            return verticalOverlap;
        };
        
        const anchorBars = allBarsForCollision.filter(bar => eventX >= bar.x && eventX <= bar.x + bar.width);
        let candidatePositions: { y: number, score: number, anchorY?: number }[] = [];

        anchorBars.forEach(bar => {
            const yAbove = bar.y - eventLabelHeight - SCALED_EVENT_MIN_VERTICAL_GAP;
            const yBelow = bar.y + bar.height + SCALED_EVENT_MIN_VERTICAL_GAP;
            candidatePositions.push({ y: yAbove, score: Math.abs(yAbove - bar.y), anchorY: bar.y }); 
            candidatePositions.push({ y: yBelow, score: Math.abs(yBelow - (bar.y + bar.height)), anchorY: bar.y + bar.height});
        });
        
        const topFallbackY = Math.max(5 * effectiveVerticalScale, SCALED_PERSON_BLOCK_ACTUAL_START_Y - eventLabelHeight - SCALED_EVENT_MIN_VERTICAL_GAP);
        candidatePositions.push({ y: topFallbackY, score: 10000 });

        candidatePositions.sort((a,b) => a.score - b.score); 

        let bestY = topFallbackY; 
        let foundSlot = false;

        for (const pos of candidatePositions) {
            // Only check for positions above the timeline's effective start (y < 0)
            if (pos.y < 0) continue; 
            // Removed: pos.y + eventLabelHeight > timelineHeight - (10 * effectiveVerticalScale)

            let isCollidingThisCandidate = false;
            for (const bar of allBarsForCollision) {
                if (checkCollision(eventX - eventLabelWidth/2, pos.y, eventLabelWidth, eventLabelHeight, bar.x, bar.y, bar.width, bar.height)) {
                    isCollidingThisCandidate = true;
                    break;
                }
            }
            if (isCollidingThisCandidate) continue;

            for (const placedEvent of placedEventTitlesLayout) {
                 if (checkCollision(eventX - eventLabelWidth/2, pos.y, eventLabelWidth, eventLabelHeight, placedEvent.x - placedEvent.width/2, placedEvent.y, placedEvent.width, placedEvent.height, true, eventX, placedEvent.eventLineX)) {
                    isCollidingThisCandidate = true;
                    break;
                }
            }

            if (!isCollidingThisCandidate) {
                bestY = pos.y;
                foundSlot = true;
                break;
            }
        }
        
        if (!foundSlot) {
            let iterY = topFallbackY;
            const yIncrement = 10 * effectiveVerticalScale;
            const MAX_ITERATIVE_PLACEMENT_ATTEMPTS = 200; // Use a fixed number of attempts

            for (let i = 0; i < MAX_ITERATIVE_PLACEMENT_ATTEMPTS; i++) {
                let isCollidingIter = false;
                for (const bar of allBarsForCollision) { if (checkCollision(eventX - eventLabelWidth/2, iterY, eventLabelWidth, eventLabelHeight, bar.x, bar.y, bar.width, bar.height)) { isCollidingIter = true; break; }}
                if (isCollidingIter) { iterY += yIncrement; continue; }
                for (const placedEvent of placedEventTitlesLayout) { if (checkCollision(eventX - eventLabelWidth/2, iterY, eventLabelWidth, eventLabelHeight, placedEvent.x - placedEvent.width/2, placedEvent.y, placedEvent.width, placedEvent.height, true, eventX, placedEvent.eventLineX)) { isCollidingIter = true; break; }}
                
                if (!isCollidingIter) { bestY = iterY; break;}
                iterY += yIncrement;
            }
        }

        placedEventTitlesLayout.push({ x: eventX, y: bestY, width: eventLabelWidth, height: eventLabelHeight, id: event.id, eventLineX: eventX });
        return { ...event, eventNameY: bestY };
    });
  }, [
    events, getDisplayYear, getPixelX, visibleMainCovenantPeopleDisplayData, 
    expandedSiblingGroups, hiddenCharacterIds, effectiveVerticalScale, globalUiScale,
    SCALED_BAR_HEIGHT, SCALED_SIBLING_BAR_HEIGHT, SCALED_BAR_VERTICAL_GAP, SCALED_SIBLING_VERTICAL_GAP,
    SCALED_EVENT_LABEL_MAX_HEIGHT, SCALED_EVENT_MIN_VERTICAL_GAP, SCALED_PERSON_BLOCK_ACTUAL_START_Y,
    totalDataSpan, totalPixelWidth // timelineHeight removed from dependencies
  ]);


 // Calculate total timeline height based on visible elements
 useEffect(() => {
    let currentY = SCALED_PERSON_BLOCK_ACTUAL_START_Y;
    let maxHeight = currentY;

    // Create a temporary list of visible people to calculate Y positions just for height
    const tempVisiblePeopleForHeight = mainCovenantPeopleDisplayDataWithVisibility
      .filter(p => p.isVisible)
      .map(p => {
        const yPos = currentY;
        currentY += SCALED_BAR_HEIGHT + SCALED_BAR_VERTICAL_GAP;
        if (expandedSiblingGroups[p.id]) {
          const visibleSiblings = p.nonCovenantChildren.filter(s => !hiddenCharacterIds.includes(s.id));
          if (visibleSiblings.length > 0) {
            currentY += (visibleSiblings.length * (SCALED_SIBLING_BAR_HEIGHT + SCALED_SIBLING_VERTICAL_GAP)) + SCALED_BAR_VERTICAL_GAP;
          }
        }
        return { ...p, y: yPos }; // Assign calculated Y for this temporary list
      });

    if (tempVisiblePeopleForHeight.length > 0) {
        const lastPerson = tempVisiblePeopleForHeight[tempVisiblePeopleForHeight.length - 1];
        maxHeight = lastPerson.y + SCALED_BAR_HEIGHT; // Height up to the bottom of the last main person
        // If the last person has expanded siblings, add their height
        if (expandedSiblingGroups[lastPerson.id]) {
            const visibleSiblings = lastPerson.nonCovenantChildren.filter(s => !hiddenCharacterIds.includes(s.id));
            if (visibleSiblings.length > 0) {
                 maxHeight += (visibleSiblings.length * (SCALED_SIBLING_BAR_HEIGHT + SCALED_SIBLING_VERTICAL_GAP)) + SCALED_BAR_VERTICAL_GAP;
            }
        }
    } else if (mainCovenantPeopleDisplayDataWithVisibility.length > 0 && !mainCovenantPeopleDisplayDataWithVisibility.every(p => !p.isVisible)) {
         // If there are covenant people defined, but all are hidden
         maxHeight = SCALED_PERSON_BLOCK_ACTUAL_START_Y + SCALED_BAR_HEIGHT; // Default to at least one bar height
    } else {
        // No covenant people or all are hidden.
        maxHeight = SCALED_PERSON_BLOCK_ACTUAL_START_Y + 50 * effectiveVerticalScale; // Some minimal height if empty
    }
    
    // Consider events for height calculation if they are rendered very low
    processedEventsData.forEach(event => {
      if (event) {
        maxHeight = Math.max(maxHeight, event.eventNameY + SCALED_EVENT_LABEL_MAX_HEIGHT + SCALED_EVENT_MIN_VERTICAL_GAP);
      }
    });

    setTimelineHeight(Math.max(200 * effectiveVerticalScale, maxHeight + 100 * effectiveVerticalScale)); 
  }, [mainCovenantPeopleDisplayDataWithVisibility, expandedSiblingGroups, hiddenCharacterIds, effectiveVerticalScale, SCALED_BAR_HEIGHT, SCALED_BAR_VERTICAL_GAP, SCALED_SIBLING_BAR_HEIGHT, SCALED_SIBLING_VERTICAL_GAP, SCALED_PERSON_BLOCK_ACTUAL_START_Y, processedEventsData, SCALED_EVENT_LABEL_MAX_HEIGHT, SCALED_EVENT_MIN_VERTICAL_GAP]);


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

  const toggleSiblingExpansion = (parentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSiblingGroups(prev => ({ ...prev, [parentId]: !prev[parentId] }));  };

  const getEventIcon = (eventName: string, className: string = "w-5 h-5") => {
    const lowerEventName = eventName.toLowerCase();
    if (lowerEventName.includes('criação')) return <GlobeAltIcon className={className} />;
    if (lowerEventName.includes('queda')) return <ExclamationTriangleIcon className={className} />;
    if (lowerEventName.includes('dilúvio')) return <CloudArrowDownIcon className={className} />; // Corrected usage
    if (lowerEventName.includes('pacto')) return <LinkIcon className={className} />;
    if (lowerEventName.includes('torre')) return <BuildingOfficeIcon className={className} />;
    return <CalendarDaysIcon className={className} />;
  }

  // Removido: customYearLabel - não mais usado com nova estrutura de 3 zonas

  const findNextVisibleCovenantDescendant = (
    currentPersonId: string,
    allCovenantData: PersonDisplayData[],
    visibleCovenantData: PersonDisplayData[]
  ): PersonDisplayData | null => {
    let searchId = currentPersonId;
    while (searchId) {
      const directChildInCovenant = allCovenantData.find(p => p.fatherId === searchId && p.isCovenantLine);
      if (!directChildInCovenant) return null;
      if (visibleCovenantData.some(vp => vp.id === directChildInCovenant.id)) {
        return visibleCovenantData.find(vp => vp.id === directChildInCovenant.id)!;
      }
      searchId = directChildInCovenant.id; 
    }
    return null;
  };

  const findHiddenCovenantPeopleBetween = (
    startVisiblePerson: PersonDisplayData,
    endVisiblePerson: PersonDisplayData,
    allCovenantData: PersonDisplayData[] 
  ): PersonDisplayData[] => {
    const hiddenPeople: PersonDisplayData[] = [];
    let currentId = startVisiblePerson.id;

    while (currentId && currentId !== endVisiblePerson.id) {
      const directChildInCovenant = allCovenantData.find(p => p.fatherId === currentId && p.isCovenantLine);
      if (!directChildInCovenant || directChildInCovenant.id === endVisiblePerson.id) {
        break;
      }
      if (!directChildInCovenant.isVisible) { 
        hiddenPeople.push(directChildInCovenant);
      }
      currentId = directChildInCovenant.id;
    }
    return hiddenPeople;
  };


  const renderParentChildArcAndDots = () => {
    const elements: React.ReactElement[] = [];
    const mainLineChildYOffset = SCALED_BAR_HEIGHT / 2;
    const siblingChildYOffset = SCALED_SIBLING_BAR_HEIGHT / 2;
    const ICON_SCALED_RADIUS = HIDDEN_ICON_RADIUS_BASE * Math.max(0.7, Math.min(1.3, effectiveVerticalScale * 0.8)); 
    const ICON_PLUS_HALF_SIZE = ICON_SCALED_RADIUS * 0.6;

    visibleMainCovenantPeopleDisplayData.forEach(person => {
      const nextVisibleDescendant = findNextVisibleCovenantDescendant(person.id, mainCovenantPeopleDisplayDataWithVisibility, visibleMainCovenantPeopleDisplayData);

      if (nextVisibleDescendant) {
        const parentArcStartX = person.x + 5; 
        const parentArcStartY = person.y + mainLineChildYOffset;
        const childArcEndX = nextVisibleDescendant.x + 5; 
        const childArcEndY = nextVisibleDescendant.y + mainLineChildYOffset;

        const controlX = (parentArcStartX + childArcEndX) / 2;
        const controlY = Math.max(parentArcStartY, childArcEndY) + (30 * effectiveVerticalScale * Math.sqrt(Math.abs(childArcEndY-parentArcStartY)/100 + 1)); 

        elements.push(
          <path
            key={`arc-main-${person.id}-${nextVisibleDescendant.id}`}
            d={`M ${parentArcStartX} ${parentArcStartY} Q ${controlX} ${controlY} ${childArcEndX} ${childArcEndY}`}
            className="stroke-theme-accent"
            strokeWidth={Math.max(1, parseFloat(LINE_THICKNESS_CLASSES.normal.replace('w-','')) * effectiveVerticalScale * 0.8)}
            fill="none"
            opacity="0.5"
          />
        );

        const hiddenIntermediaries = findHiddenCovenantPeopleBetween(person, nextVisibleDescendant, mainCovenantPeopleDisplayDataWithVisibility);
        hiddenIntermediaries.forEach(hiddenChar => {
          if (hiddenChar.birthYear === undefined || person.birthYear === undefined || nextVisibleDescendant.birthYear === undefined || nextVisibleDescendant.birthYear === person.birthYear) {
            return; 
          }
          let t = (hiddenChar.birthYear - person.birthYear) / (nextVisibleDescendant.birthYear - person.birthYear);
          t = Math.max(0.05, Math.min(0.95, t)); 

          const dotX = Math.pow(1-t,2)*parentArcStartX + 2*(1-t)*t*controlX + Math.pow(t,2)*childArcEndX;
          const dotY = Math.pow(1-t,2)*parentArcStartY + 2*(1-t)*t*controlY + Math.pow(t,2)*childArcEndY;

          elements.push(
            <g
              key={`plus-icon-${hiddenChar.id}`}
              className="cursor-pointer pointer-events-auto" 
              onClick={(e) => {
                e.stopPropagation();
                onToggleCharacterVisibility(hiddenChar.id);
              }}
              transform={`translate(${dotX}, ${dotY})`}
              aria-label={`Mostrar ${hiddenChar.name}`}
              role="button"
            >
              <title>Mostrar {hiddenChar.name}</title>
              <circle
                cx={0} cy={0} r={ICON_SCALED_RADIUS}
                className="fill-theme-card-bg stroke-theme-accent"
                strokeWidth="1.5" opacity="0.9"
              />
              <line
                x1={-ICON_PLUS_HALF_SIZE} y1={0} x2={ICON_PLUS_HALF_SIZE} y2={0}
                className="stroke-theme-accent" strokeWidth="1.5" strokeLinecap="round"
              />
              <line
                x1={0} y1={-ICON_PLUS_HALF_SIZE} x2={0} y2={ICON_PLUS_HALF_SIZE}
                className="stroke-theme-accent" strokeWidth="1.5" strokeLinecap="round"
              />
            </g>
          );
        });
      }

      if (expandedSiblingGroups[person.id] && person.nonCovenantChildren.length > 0) {
        let currentSiblingYOffset = person.y + SCALED_BAR_HEIGHT + SCALED_BAR_VERTICAL_GAP;
        const visibleSiblings = person.nonCovenantChildren.filter(s => !hiddenCharacterIds.includes(s.id));

        visibleSiblings.forEach((sibling) => {
          const siblingBirthDisplay = getDisplayYear(sibling.birthYear);
          const siblingX = siblingBirthDisplay !== undefined ? getPixelX(siblingBirthDisplay) : person.x; 
          const siblingActualY = currentSiblingYOffset;

          const parentArcStartX = person.x + person.barWidthPx / 2; 
          const parentArcStartY = person.y + mainLineChildYOffset;
          const childArcEndX = siblingX; 
          const childArcEndY = siblingActualY + siblingChildYOffset;

          const controlPtX = (parentArcStartX + childArcEndX) / 2;
          const controlPtY = parentArcStartY + (childArcEndY - parentArcStartY) * 0.7; 

          elements.push(
            <path
              key={`arc-sibling-${person.id}-${sibling.id}`}
              d={`M ${parentArcStartX} ${parentArcStartY} Q ${controlPtX} ${controlPtY} ${childArcEndX} ${childArcEndY}`}
              className="stroke-theme-text" 
              strokeWidth={Math.max(1, parseFloat(LINE_THICKNESS_CLASSES.thin.replace('w-','')) * effectiveVerticalScale * 0.7)}
              fill="none"
              opacity="0.4"
            />
          );
          currentSiblingYOffset += SCALED_SIBLING_BAR_HEIGHT + SCALED_SIBLING_VERTICAL_GAP;
        });
      }
    });
    return elements;
  };


  const renderPersonBarWithLifespan = (p: PersonDisplayData, isSibling: boolean, paletteIndexOffset = 0, siblingYPos?: number) => {
    const currentBarHeight = isSibling ? SCALED_SIBLING_BAR_HEIGHT : SCALED_BAR_HEIGHT;
    const actualY = isSibling && siblingYPos !== undefined ? siblingYPos : p.y;

    const personFromSortedList = sortedAllPeople.find(sp => sp.id === p.id);
    const baseIndex = personFromSortedList ? sortedAllPeople.indexOf(personFromSortedList) : 0;
    const barColorIndex = baseIndex + paletteIndexOffset;
    const barColor = p.barColor || personBarPalette[barColorIndex % personBarPalette.length];

    const hasVisibleExpandableSiblings = !isSibling && p.nonCovenantChildren && p.nonCovenantChildren.filter((s: Person) => !hiddenCharacterIds.includes(s.id)).length > 0;

    const displayBirthYearText = yearReferenceMode === 'AC' ? p.displayBirthAC : p.displayBirthRelative;
    const displayDeathYearText = yearReferenceMode === 'AC' ? p.displayDeathAC : p.displayDeathRelative;
    const yearSuffix = yearReferenceMode === 'AC' ? 'aC' : '';

    let lifespanText = '';
    if (p.birthYear !== undefined && p.totalLifespan !== undefined) {
        lifespanText = `(${p.totalLifespan} anos)`;
    } else if (p.birthYear !== undefined && p.deathYear !== undefined) {
        const calculatedLifespan = p.deathYear - p.birthYear;
        lifespanText = `(${calculatedLifespan} anos)`;
    }

    const birthYearFormatted = displayBirthYearText !== undefined ? Math.round(displayBirthYearText) : '?';
    const deathYearFormatted = displayDeathYearText !== undefined ? Math.round(displayDeathYearText) : (p.isDeathUnknown ? '?' : 'Vida desconhecida');
    const lifespanInfo = `${birthYearFormatted}${yearSuffix} - ${deathYearFormatted}${yearSuffix} ${lifespanText}`;

    const textContainerPadding = showCharacterBarControls && !isSibling ? CHARACTER_BAR_TEXT_PADDING_WITH_CONTROLS : CHARACTER_BAR_TEXT_PADDING_WITHOUT_CONTROLS;

    const nameFs = isSibling ? siblingNameFontSize : characterNameFontSize;
    const lifespanFs = isSibling ? `calc(0.6rem * ${globalUiScale})` : lifespanTextFontSize;


    const elements: React.ReactElement[] = [];
    elements.push(
      <div
        key={`bar-${p.id}`}
        style={{
          position: 'absolute',
          left: `${p.x}px`,
          top: `${actualY}px`,
          width: `${p.barWidthPx}px`,
          height: `${currentBarHeight}px`,
          backgroundColor: barColor,
          zIndex: Z_INDICES.timelineCharacterBars,
        }}
        className="text-theme-character-bar-text flex items-center justify-start rounded shadow-md hover:opacity-80 transition-opacity"
        title={`${p.name}\n${lifespanInfo}`}
        role="button"
        tabIndex={0}
        onClick={(e) => {
          // Handle time comparison if active
          if (timeComparison?.isActive && onTimeComparisonItemSelect) {
            const clickX = e.clientX - e.currentTarget.getBoundingClientRect().left;
            const clickPercentage = clickX / p.barWidthPx;
            
            // Determine if clicking closer to birth or death
            const isBirthClick = clickPercentage < 0.5;
            
            if (isBirthClick && p.birthYear !== undefined) {
              const timeComparisonItem: TimeComparisonItem = {
                id: `${p.id}-birth`,
                type: 'person-birth',
                name: `Nascimento de ${p.name}`,
                year: p.birthYear
              };
              onTimeComparisonItemSelect(timeComparisonItem);
            } else if (!isBirthClick && (p.deathYear !== undefined || p.totalLifespan !== undefined)) {
              const deathYear = p.deathYear || (p.birthYear ? p.birthYear + (p.totalLifespan || 0) : undefined);
              if (deathYear !== undefined) {
                const timeComparisonItem: TimeComparisonItem = {
                  id: `${p.id}-death`,
                  type: 'person-death',
                  name: `Morte de ${p.name}`,
                  year: deathYear
                };
                onTimeComparisonItemSelect(timeComparisonItem);
              }
            }
          } else {
            // Normal person selection
            onSelectPerson(p);
          }
        }}
        onKeyDown={(e) => { 
          if (e.key === 'Enter' || e.key === ' ') {
            if (timeComparison?.isActive && onTimeComparisonItemSelect && p.birthYear !== undefined) {
              // Default to birth for keyboard access
              const timeComparisonItem: TimeComparisonItem = {
                id: `${p.id}-birth`,
                type: 'person-birth',
                name: `Nascimento de ${p.name}`,
                year: p.birthYear
              };
              onTimeComparisonItemSelect(timeComparisonItem);
            } else {
              onSelectPerson(p);
            }
          }
        }}
      >        <div className={`flex items-center h-full ${showCharacterBarControls && !isSibling ? 'w-auto min-w-[60px]' : 'w-auto'}`}>
          {showCharacterBarControls && !isSibling && (            <div style={{ transform: `scale(${Math.min(globalUiScale * 0.6, 1.0)})`, transformOrigin: 'left center' }} className="flex items-center">
                {/* 
                  Botões de Controle de Personagem - Personalização:
                  - Para alterar o tamanho dos ícones: mude w-8 h-8 para w-6 h-6 (menor) ou w-10 h-10 (maior)
                  - Para alterar o padding dos botões: mude p-3 para p-2 (menor) ou p-4 (maior) 
                  - Para alterar as cores: modifique a propriedade 'color' no style
                  - Para alterar o efeito de sombra: modifique a propriedade 'filter' no style
                */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleCharacterVisibility(p.id); }}
                    className="md-interactive character-button p-3 focus:outline-none rounded-md"
                    style={{
                      filter: 'drop-shadow(0 0 1px white) drop-shadow(0 0 2px white)',
                      color: '#000000'
                    }}
                    title={p.isVisible ? "Ocultar personagem" : "Mostrar personagem"}
                    aria-pressed={!p.isVisible}
                >
                    {p.isVisible ? <EyeSlashIcon className="w-8 h-8" /> : <EyeIcon className="w-8 h-8" />}
                </button><button
                    onClick={(e) => { e.stopPropagation(); onTogglePersonLifeLine(p.id); }}
                    className="md-interactive character-button p-3 focus:outline-none transition-colors rounded-md"
                    style={{
                      filter: 'drop-shadow(0 0 1px white) drop-shadow(0 0 2px white)',
                      color: activePersonLifeLines[p.id] ? '#fbbf24' : '#000000'
                    }}
                    title={activePersonLifeLines[p.id] ? "Ocultar linhas de vida" : "Mostrar linhas de vida"}
                    aria-pressed={!!activePersonLifeLines[p.id]}
                >
                    {activePersonLifeLines[p.id] ? <ArrowsPointingOutIcon className="w-8 h-8" /> : <ArrowsPointingInIcon className="w-8 h-8" />}
                </button>                {hasVisibleExpandableSiblings && (
                  <button 
                    onClick={(e) => toggleSiblingExpansion(p.id, e)} 
                    className="md-interactive character-button p-3 focus:outline-none rounded-md" 
                    style={{
                      filter: 'drop-shadow(0 0 1px white) drop-shadow(0 0 2px white)',
                      color: '#000000'
                    }}
                    title={expandedSiblingGroups[p.id] ? "Recolher irmãos" : "Expandir irmãos"} 
                    aria-expanded={!!expandedSiblingGroups[p.id]}
                  >
                    {expandedSiblingGroups[p.id] ? <MinusCircleIcon className="w-8 h-8" /> : <PlusCircleIcon className="w-8 h-8" />}
                  </button>
                )}
            </div>
          )}
        </div>        <div
          className={`flex-grow flex flex-col justify-center h-full cursor-pointer ${textContainerPadding} overflow-hidden min-w-0`}
          style={{
            transform: showCharacterBarControls ? 
              `translateX(${Math.max(0, getFloatingNamePosition(p.x, p.barWidthPx) - p.x)}px)` : 
              'none',
            maxWidth: showCharacterBarControls ? 
              `calc(${p.barWidthPx}px - 80px)` :  // Reserve space for controls
              `calc(${p.barWidthPx}px - 20px)`,   // Just basic padding
            // When moving left (negative transform), align text to right
            // When at original position or moving right, align text to left
            textAlign: showCharacterBarControls && (getFloatingNamePosition(p.x, p.barWidthPx) - p.x) < 0 ? 'right' : 'left'
          }}
        ><span className="dynamic-text-lg font-md-title-medium truncate leading-tight" style={{ fontSize: nameFs }}>
            {p.name}
          </span>{(p.isCovenantLine || isSibling) && showCharacterBarControls && ( 
            <span className="truncate leading-tight text-theme-lifespan-text dynamic-text-sm" style={{ 
              fontSize: lifespanFs,
              maxWidth: '100%'
            }}>
              {lifespanInfo}
            </span>
          )}
        </div>
        {p.isDeathUnknown && showCharacterBarControls && <span className="ml-auto mr-2 text-theme-lifespan-text" style={{ fontSize: lifespanFs }}>?</span>}
      </div>    );

    // Removido: datas de nascimento e morte ao lado dos personagens    // Agora aparecem apenas na régua cronológica quando linhas de vida estão ativas
    
    return elements;
  };

  // Calculate counts for each zone
  const rulerZoneCounts = useMemo(() => {
    const eventCount = events.length;
    
    let birthCount = 0;
    let deathCount = 0;
    
    // Count births and deaths from all people (simplified for now)
    allPeople.forEach((p: any) => {
      if (p.birthYear !== undefined) birthCount++;
      if (p.deathYear !== undefined || (p.birthYear !== undefined && p.totalLifespan !== undefined)) {
        deathCount++;
      }
    });
    
    return { eventCount, birthCount, deathCount };
  }, [events, allPeople]);

  // Calculate dynamic ruler height based on visible zones
  const dynamicRulerHeight: number = useMemo(() => {
    let baseHeight = 60; // Base height for year markers
    
    if (rulerZoneVisibility.events && rulerZoneCounts.eventCount > 0) {
      baseHeight += 35; // Add space for event zone
    }
    
    if ((rulerZoneVisibility.births && rulerZoneCounts.birthCount > 0) || 
        (rulerZoneVisibility.deaths && rulerZoneCounts.deathCount > 0)) {
      baseHeight += 35; // Add space for birth/death zone
    }
      return baseHeight * globalUiScale;  }, [rulerZoneVisibility, rulerZoneCounts, globalUiScale]);// Function to toggle ruler zone visibility
  const toggleRulerZoneVisibility = (zone: keyof RulerZoneVisibility) => {
    setRulerZoneVisibility(prev => ({
      ...prev,
      [zone]: !prev[zone]
    }));
  };

  return (
    <div className="w-full h-full flex overflow-hidden relative bg-theme-app-bg">
      <div 
        className="flex-grow h-full relative overflow-hidden" 
        role="region" 
        aria-label="Linha do Tempo Genealógica"
      >        {/* Régua cronológica - sempre visível, sticky ou não */}
        <div 
          className={`w-full overflow-x-auto overflow-y-hidden ${isYearRulerSticky ? 'sticky' : 'relative'}`}          style={{
            top: isYearRulerSticky ? '0px' : 'auto',
            zIndex: Z_INDICES.yearHeader,
            height: `${dynamicRulerHeight}px`
          }}
          ref={rulerContentRef}
        >          <div
            style={{ 
              height: `${dynamicRulerHeight}px`, 
              width: `${totalPixelWidth}px`,
            }}            className="flex items-end px-4 bg-theme-header-bg relative"
            aria-hidden="true"
          >
            {/* Zone indicators with counts - positioned at top right of ruler */}
            <div className="absolute top-2 right-4 flex gap-2 z-10">
              {/* Events indicator */}
              {rulerZoneCounts.eventCount > 0 && (
                <button
                  onClick={() => toggleRulerZoneVisibility('events')}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    rulerZoneVisibility.events 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  } hover:opacity-80`}
                  title={`${rulerZoneVisibility.events ? 'Hide' : 'Show'} events in ruler (${rulerZoneCounts.eventCount})`}
                >
                  📅 {rulerZoneCounts.eventCount}
                </button>
              )}
              {/* Births indicator */}
              {rulerZoneCounts.birthCount > 0 && (
                <button
                  onClick={() => toggleRulerZoneVisibility('births')}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    rulerZoneVisibility.births 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  } hover:opacity-80`}
                  title={`${rulerZoneVisibility.births ? 'Hide' : 'Show'} births in ruler (${rulerZoneCounts.birthCount})`}
                >
                  ⭐ {rulerZoneCounts.birthCount}
                </button>
              )}
              {/* Deaths indicator */}
              {rulerZoneCounts.deathCount > 0 && (
                <button
                  onClick={() => toggleRulerZoneVisibility('deaths')}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    rulerZoneVisibility.deaths 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  } hover:opacity-80`}
                  title={`${rulerZoneVisibility.deaths ? 'Hide' : 'Show'} deaths in ruler (${rulerZoneCounts.deathCount})`}
                >
                  † {rulerZoneCounts.deathCount}
                </button>
              )}
            </div>
            {/* ZONA 1: Anos principais (500/1000) e menores (100) com linhas verticais */}
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
                {/* Linhas verticais para anos principais E menores */}
                <div 
                  className={`w-px ${marker.isMajor ? 'bg-theme-year-marker-major' : 'bg-theme-year-marker-minor'}`} 
                  style={{ height: marker.isMajor ? BASE_DIMENSIONS.timelineMarkerMajorHeight * globalUiScale : (BASE_DIMENSIONS.timelineMarkerMinorHeight * globalUiScale) }}
                ></div>
              </div>
            ))}            {/* ZONA 2: Eventos - 50px acima da base (centralizados e com anti-sobreposição) */}
            {rulerZoneVisibility.events && events.map((event, eventIndex) => {
              const eventDisplayYear = getDisplayYear(event.year);
              if (eventDisplayYear === undefined) return null;
              const eventX = getPixelX(eventDisplayYear);
              
              // Calcular alinhamento baseado em proximidade
              const { alignmentStyle, offsetX } = calculateEventAlignment(events, eventIndex, eventX);
              
              // Determinar transform baseado no alinhamento
              let transform = 'translateX(-50%)'; // Padrão: centralizado
              if (alignmentStyle === 'left') {
                transform = 'translateX(-100%)'; // Alinhado à esquerda
              } else if (alignmentStyle === 'right') {
                transform = 'translateX(0%)'; // Alinhado à direita
              }
              
              return (
                <div 
                  key={`event-ruler-${event.id}`} 
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
            })}            {/* ZONA 3: Nascimento e Morte - 75px acima da base (verificação individual de todos os anos) */}
            {(rulerZoneVisibility.births || rulerZoneVisibility.deaths) && (() => {
              // Coletar TODOS os anos individuais (nascimento e morte) de TODOS os personagens
              const allYearsData: { year: number, x: number, id: string, type: string, personId: string, element: React.ReactElement }[] = [];
              
              visibleMainCovenantPeopleDisplayData.filter(p => activePersonLifeLines[p.id] && showCharacterBarControls).forEach(p => {
                const birthDisplayYear = yearReferenceMode === 'AC' ? p.displayBirthAC : p.displayBirthRelative;
                const deathDisplayYear = yearReferenceMode === 'AC' ? p.displayDeathAC : p.displayDeathRelative;
                const yearSuffix = yearReferenceMode === 'AC' ? 'aC' : '';
                
                // Adicionar ano de NASCIMENTO se existir e se births está visível
                if (rulerZoneVisibility.births && birthDisplayYear !== undefined) {
                  const birthX = getPixelX(birthDisplayYear);
                  allYearsData.push({
                    year: birthDisplayYear,
                    x: birthX,
                    id: `birth-${p.id}`,
                    type: 'birth',
                    personId: p.id,
                    element: (
                      <span className="dynamic-text-xs text-white bg-green-600 px-1 rounded text-center whitespace-nowrap"
                            style={{ fontSize: dateLineLabelFontSize }}>
                        ⭐{Math.round(birthDisplayYear)}{yearSuffix}
                      </span>
                    )
                  });
                }
                
                // Adicionar ano de MORTE se existir, for diferente do nascimento e se deaths está visível
                if (rulerZoneVisibility.deaths && deathDisplayYear !== undefined && deathDisplayYear !== birthDisplayYear) {
                  const deathX = getPixelX(deathDisplayYear);
                  allYearsData.push({
                    year: deathDisplayYear,
                    x: deathX,
                    id: `death-${p.id}`,
                    type: 'death',
                    personId: p.id,
                    element: (
                      <span className="dynamic-text-xs text-white bg-red-600 px-1 rounded text-center whitespace-nowrap"
                            style={{ fontSize: dateLineLabelFontSize }}>
                        †{Math.round(deathDisplayYear)}{yearSuffix}
                      </span>
                    )
                  });
                }
              });              // Renderizar cada ano com verificação individual de proximidade
              return allYearsData.map((yearData, index) => {
                // Verificar proximidade deste ano com TODOS os outros anos (de qualquer personagem)
                const { alignmentClass, containerWidth } = calculateIndividualYearAlignment(allYearsData, index);
                
                // Calcular offset baseado na largura do container para centralizar corretamente
                const containerWidthPx = parseInt(containerWidth);
                const leftOffset = containerWidthPx / 2;
                
                return (
                  <div 
                    key={yearData.id} 
                    style={{ 
                      position: 'absolute', 
                      left: `${yearData.x - leftOffset}px`, // Centralizar baseado na largura real do container
                      bottom: '75px',
                      width: containerWidth
                    }} 
                    className={`${alignmentClass}`}
                    title={`${yearData.type === 'birth' ? 'Nascimento' : 'Morte'} - ${yearData.personId} (Ano ${yearData.year})`}
                  >
                    {yearData.element}
                  </div>
                );
              });
            })()}          </div>
        </div>
        
        {/* Conteúdo principal - agora sempre sincronizado */}
        <div 
          className="flex-grow overflow-x-auto overflow-y-auto" 
          id="timeline-scroll-container" 
          ref={scrollContainerRef}
        >
          <div
            ref={mainTimelineContentRef}
            className="relative timeline-bg-gradient"            style={{
              width: `${totalPixelWidth}px`,
              minHeight: `${timelineHeight}px`, 
              paddingTop: isYearRulerSticky ? `0px` : `20px`, // Padding mínimo quando régua está escondida
              zIndex: Z_INDICES.timelineBackground,
            }}
          >
            {/* Horizontal Grid Lines */}
            {Array.from({ length: Math.floor(timelineHeight / (SCALED_BAR_HEIGHT + SCALED_BAR_VERTICAL_GAP)) + 15 }).map((_, i) => (
                <div
                key={`h-grid-${i}`}
                style={{ 
                    top: `${SCALED_PERSON_BLOCK_ACTUAL_START_Y + (i * (SCALED_BAR_HEIGHT + SCALED_BAR_VERTICAL_GAP)) - (SCALED_BAR_VERTICAL_GAP / 2) - (SCALED_BAR_HEIGHT / 2) }px`, 
                    width: `${totalPixelWidth}px`, 
                    zIndex: Z_INDICES.gridLines, 
                }}
                className="absolute left-0 right-0 border-b border-theme-grid-line"
                aria-hidden="true"
                ></div>
            ))}
            {/* Vertical Grid Lines */}
           {yearMarkers.filter(m => m.isMajor).map(marker => ( 
             <div
              key={`v-grid-${marker.year}`}
              className="absolute bottom-0 border-l border-theme-grid-line"
              style={{ left: `${marker.x}px`, top: `0px`, height: `${timelineHeight}px`, zIndex: Z_INDICES.gridLines}}
              aria-hidden="true"
             ></div>
           ))}

          {visibleMainCovenantPeopleDisplayData.filter(p => activePersonLifeLines[p.id]).map(p => {
            const birthX = getPixelX(yearReferenceMode === 'AC' ? p.displayBirthAC : p.displayBirthRelative);
            const deathX = getPixelX(yearReferenceMode === 'AC' ? p.displayDeathAC : p.displayDeathRelative);
            return (
              <React.Fragment key={`lines-${p.id}`}>
                {birthX !== undefined && <div aria-hidden="true" className={`absolute bottom-0 ${LINE_THICKNESS_CLASSES.normal} bg-theme-person-line-active`} style={{ left: `${birthX}px`, top: `0px`, height: `${timelineHeight}px`, zIndex: Z_INDICES.activePersonLines, opacity: 0.7 }}></div>}
                {deathX !== undefined && <div aria-hidden="true" className={`absolute bottom-0 ${LINE_THICKNESS_CLASSES.normal} bg-theme-person-line-active`} style={{ left: `${deathX}px`, top: `0px`, height: `${timelineHeight}px`, zIndex: Z_INDICES.activePersonLines, opacity: 0.7 }}></div>}
              </React.Fragment>
            );
          })}          {processedEventsData.map((event) => {
            if (!event) return null; 
            const xPos = event.xPos;
              // Get stored position for this event card
            const eventCardPosition = getEventCardPosition(event.id);
            
            // Calculate final positioning based on alignment and stored position
            let cardX = xPos;
            let transform = 'translateX(-50%)'; // Default: centered
            
            switch (eventCardPosition.alignment) {
              case 'left':
                cardX = xPos - 100; // Offset to the left
                transform = 'translateX(0%)';
                break;
              case 'right':
                cardX = xPos + 100; // Offset to the right
                transform = 'translateX(-100%)';
                break;
              case 'center':
              default:
                cardX = xPos; // Centered on timeline
                transform = 'translateX(-50%)';
                break;
            }
            
            const cardY = eventCardPosition.y;
            const isDragging = eventCardPosition.isDragging;
            
            return (
              <React.Fragment key={`event-full-${event.id}`}>
                <div
                  className={`absolute bottom-0 ${LINE_THICKNESS_CLASSES.normal} cursor-pointer group bg-theme-event-line`}
                  style={{ left: `${xPos}px`, top: `0px`, height: `${timelineHeight}px`, zIndex: Z_INDICES.eventVerticalLines, opacity: 0.7 }}
                  onClick={() => onSelectEvent(event)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectEvent(event);}}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver detalhes do evento ${event.name}`}

                >
                    <div
                        style={{ 
                            position: 'absolute', 
                            left: `50%`, 
                            top: `-28px`, 
                            zIndex: Z_INDICES.eventIconsAndLabels, 
                            transformOrigin: 'bottom center', 
                            transform: `translate(-50%, 0px) scale(${globalUiScale})` 
                        }}
                        className="flex flex-col items-center"
                        title={`${event.name} (Ano ${Math.round(event.eventDisplayYear)} ${yearReferenceMode === 'AC' ? 'aC' : ''})`}
                        aria-hidden="true"
                        >
                        <div className={`group-hover:scale-125 transition-transform text-theme-event-line`} style={{fontSize: eventIconFontSize}}>{getEventIcon(event.name, `w-${Math.round(5 * globalUiScale)} h-${Math.round(5 * globalUiScale)}`)}</div>
                    </div>                </div>
                  {/* Draggable event card */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${cardX}px`, 
                    top: `${cardY}px`,
                    zIndex: isDragging ? Z_INDICES.modals : Z_INDICES.eventIconsAndLabels,
                    transform: transform,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    fontSize: eventTextFontSize,
                    userSelect: 'none',
                    width: `${getEventLabelDimensions(event.name, globalUiScale).width}px`, // Dynamic width
                    minHeight: `${Math.max(32 * globalUiScale, 32)}px`, // Dynamic minimum height
                  }}
                  className={`px-2 py-1 bg-theme-event-label-bg text-theme-event-label-text rounded shadow-lg border border-theme-border
                    flex items-center space-x-2 transition-all duration-200 hover:shadow-xl group
                    ${isDragging ? 'scale-105 shadow-2xl' : ''}`}
                  onMouseDown={(e) => handleEventCardDragStart(event.id, e)}                  onClick={(e) => {
                    e.stopPropagation();
                      // Handle time comparison if active
                    if (timeComparison?.isActive && onTimeComparisonItemSelect && event.year !== undefined) {
                      const timeComparisonItem: TimeComparisonItem = {
                        id: event.id,
                        type: 'event',
                        name: event.name,
                        year: event.year
                      };
                      onTimeComparisonItemSelect(timeComparisonItem);
                    } else {
                      // Normal event selection
                      onSelectEvent(event);
                    }
                  }}
                  onKeyDown={(e) => { 
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      onSelectEvent(event);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  title={`${event.name} - Arraste para reposicionar`}
                  aria-label={`Evento ${event.name} - Clique para detalhes ou arraste para reposicionar`}
                >
                  {/* Drag handle */}
                  <div className="text-xs text-theme-text opacity-50 cursor-grab">⋮⋮</div>
                  
                  {/* Event name - dynamic sizing to fit content */}
                  <span 
                    className="overflow-hidden text-ellipsis"
                    style={{
                      maxWidth: `${getEventLabelDimensions(event.name, globalUiScale).width - 60}px`, // Account for drag handle and buttons
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {event.name}
                  </span>
                  
                  {/* Alignment controls */}
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventCardAlignmentChange(event.id, 'left');
                      }}
                      className={`w-3 h-3 text-xs hover:bg-theme-accent hover:text-white rounded transition-colors
                        ${eventCardPosition.alignment === 'left' ? 'bg-theme-accent text-white' : 'bg-theme-app-bg text-theme-text'}`}
                      title="Alinhar à esquerda"
                      aria-label="Alinhar evento à esquerda"
                    >
                      ◀
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventCardAlignmentChange(event.id, 'center');
                      }}
                      className={`w-3 h-3 text-xs hover:bg-theme-accent hover:text-white rounded transition-colors
                        ${eventCardPosition.alignment === 'center' ? 'bg-theme-accent text-white' : 'bg-theme-app-bg text-theme-text'}`}
                      title="Centralizar"
                      aria-label="Centralizar evento"
                    >
                      ●
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventCardAlignmentChange(event.id, 'right');
                      }}
                      className={`w-3 h-3 text-xs hover:bg-theme-accent hover:text-white rounded transition-colors
                        ${eventCardPosition.alignment === 'right' ? 'bg-theme-accent text-white' : 'bg-theme-app-bg text-theme-text'}`}
                      title="Alinhar à direita"
                      aria-label="Alinhar evento à direita"
                    >
                      ▶
                    </button>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          <svg width={totalPixelWidth} height={timelineHeight} className="absolute top-0 left-0 pointer-events-none" style={{zIndex: Z_INDICES.parentChildArcs}} aria-hidden="true">
            <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" className="fill-theme-accent" opacity="0.6" />
                </marker>
            </defs>
            {renderParentChildArcAndDots()}
          </svg>

          {visibleMainCovenantPeopleDisplayData.flatMap((p) => {
            const parentElements = renderPersonBarWithLifespan(p, false);
            let siblingElements: React.ReactElement[] = [];

            if (expandedSiblingGroups[p.id] && p.nonCovenantChildren.length > 0) {
                let currentSiblingY = p.y + SCALED_BAR_HEIGHT + SCALED_BAR_VERTICAL_GAP;
                const visibleSiblings = p.nonCovenantChildren.filter(s => !hiddenCharacterIds.includes(s.id));                siblingElements = visibleSiblings.map((sibling) => {
                    const siblingBirthDisplay = getDisplayYear(sibling.birthYear);
                    let siblingDeathDisplay: number | undefined;
                    if(sibling.deathYear !== undefined) siblingDeathDisplay = getDisplayYear(sibling.deathYear);
                    else if (sibling.birthYear !== undefined && sibling.totalLifespan !== undefined) siblingDeathDisplay = getDisplayYear(sibling.birthYear + sibling.totalLifespan);
                    else if (sibling.birthYear !== undefined) siblingDeathDisplay = getDisplayYear(sibling.birthYear + 100); 

                    const siblingX = siblingBirthDisplay !== undefined ? getPixelX(siblingBirthDisplay) : p.x; 
                    const siblingY = currentSiblingY;
                    currentSiblingY += SCALED_SIBLING_BAR_HEIGHT + SCALED_SIBLING_VERTICAL_GAP;

                    let siblingBarWidthPx = 0;
                    if (siblingDeathDisplay !== undefined && siblingBirthDisplay !== undefined) {
                        siblingBarWidthPx = Math.abs(getPixelX(siblingDeathDisplay) - getPixelX(siblingBirthDisplay));
                    }
                    siblingBarWidthPx = Math.max(BASE_DIMENSIONS.minSiblingBarWidthPx * effectiveVerticalScale, siblingBarWidthPx);

                    const siblingDisplayData: PersonDisplayData = {
                        ...sibling,
                        isVisible: true, 
                        ...(yearReferenceMode === 'AC' && siblingBirthDisplay !== undefined && { displayBirthAC: siblingBirthDisplay }),
                        ...(yearReferenceMode === 'AC' && siblingDeathDisplay !== undefined && { displayDeathAC: siblingDeathDisplay }),
                        ...(yearReferenceMode === 'Relative' && siblingBirthDisplay !== undefined && { displayBirthRelative: siblingBirthDisplay }),
                        ...(yearReferenceMode === 'Relative' && siblingDeathDisplay !== undefined && { displayDeathRelative: siblingDeathDisplay }),
                        x: siblingX,
                        y: siblingY,
                        barWidthPx: siblingBarWidthPx,
                        barColor: personBarPalette[(sortedAllPeople.findIndex(sp => sp.id === sibling.id)) % personBarPalette.length], 
                        nonCovenantChildren: [], 
                        isDeathUnknown: sibling.deathYear === undefined && sibling.totalLifespan === undefined,
                    };
                    return renderPersonBarWithLifespan(siblingDisplayData, true, 0, siblingY);
                }).flat();}
            return [...parentElements, ...siblingElements];
          })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;