// components/TimelineView.tsx
// Este componente é responsável por renderizar a visualização principal da linha do tempo,
// incluindo personagens, eventos, a régua de anos e interações como zoom e seleção.

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Person, BibleEvent, YearReferenceMode, TimelineViewProps } from '../types'; // Removed unused IconProps
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  LockOpenIcon,
  LockClosedIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  CloudRainIcon,
  LinkIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import {
  FONT_SIZE_CLASSES,
  LINE_THICKNESS_CLASSES,
  BASE_DIMENSIONS,
  SEMANTIC_COLOR_VARS,
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
  showCharacterBarControls, activePersonLifeLines, onTogglePersonLifeLine
}) => {
  
  const effectiveHorizontalScale = baseHorizontalScale * globalUiScale;
  const effectiveVerticalScale = baseVerticalScale * globalUiScale;

  const { displayStartYear, displayEndYear, totalPixelWidth, referenceACForConversion } = useMemo(
    () => calculateTimelineMetrics(allPeople, events, yearReferenceMode, effectiveHorizontalScale),
    [allPeople, events, yearReferenceMode, effectiveHorizontalScale]
  );
  const totalDataSpan = Math.abs(displayStartYear - displayEndYear);

  const [isYearRulerSticky, setIsYearRulerSticky] = useState(true);

  // Dimensões escalonadas
  const SCALED_BAR_HEIGHT = BASE_DIMENSIONS.characterBarHeight * effectiveVerticalScale;
  const SCALED_SIBLING_BAR_HEIGHT = BASE_DIMENSIONS.siblingBarHeight * effectiveVerticalScale;
  const SCALED_BAR_VERTICAL_GAP = BASE_DIMENSIONS.barVerticalGap * effectiveVerticalScale;
  const SCALED_SIBLING_VERTICAL_GAP = BASE_DIMENSIONS.siblingVerticalGap * effectiveVerticalScale;
  const SCALED_YEAR_HEADER_HEIGHT = BASE_DIMENSIONS.yearHeaderHeight * globalUiScale; 
  
  const SCALED_PERSON_BLOCK_ACTUAL_START_Y = useMemo(() => {
    if (isYearRulerSticky) {
      // When ruler is sticky, it's out of flow. Content starts below it.
      // SCALED_YEAR_HEADER_HEIGHT is height of ruler.
      // personBlockGapBelowStickyRuler is the gap *below* the sticky ruler.
      return SCALED_YEAR_HEADER_HEIGHT + (BASE_DIMENSIONS.personBlockGapBelowStickyRuler * effectiveVerticalScale);
    } else {
      // When ruler is not sticky, mainTimelineContentRef already has paddingTop for ruler's height.
      // So, personBlockGapWithNonStickyRuler is the gap *within* that padded area.
      return BASE_DIMENSIONS.personBlockGapWithNonStickyRuler * effectiveVerticalScale;
    }
  }, [isYearRulerSticky, SCALED_YEAR_HEADER_HEIGHT, effectiveVerticalScale]);
  
  const SCALED_EVENT_LABEL_MAX_HEIGHT = BASE_DIMENSIONS.eventLabelEstimatedHeight * globalUiScale;
  const SCALED_EVENT_MIN_VERTICAL_GAP = BASE_DIMENSIONS.eventMinVerticalGap * effectiveVerticalScale;

  // Font sizes scaled by globalUiScale
  const characterNameFontSize = `calc(1.2rem * ${globalUiScale})`; 
  const lifespanTextFontSize = `calc(0.7rem * ${globalUiScale})`;  
  const siblingNameFontSize = `calc(0.75rem * ${globalUiScale})`; 
  const yearMarkerMajorFontSize = `calc(0.8rem * ${globalUiScale})`; 
  const yearMarkerMinorFontSize = `calc(0.7rem * ${globalUiScale})`; 
  const eventIconFontSize = `calc(1rem * ${globalUiScale})`; 
  const eventTextFontSize = `calc(1.4rem * ${globalUiScale})`; 
  const dateLineLabelFontSize = `calc(0.65rem * ${globalUiScale})`; 

  const [expandedSiblingGroups, setExpandedSiblingGroups] = useState<Record<string, boolean>>({});
  const mainTimelineContentRef = useRef<HTMLDivElement>(null); 
  const [timelineHeight, setTimelineHeight] = useState(0);

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
    const pixelsFor30Years = (30 / totalDataSpan) * totalPixelWidth;

    return sortedInputEvents.map(event => {
        const eventX = event.xPos;
        const eventLabelWidth = 20 * globalUiScale; 
        const eventLabelHeight = SCALED_EVENT_LABEL_MAX_HEIGHT;

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
    setExpandedSiblingGroups(prev => ({ ...prev, [parentId]: !prev[parentId] }));
  };

  const getEventIcon = (eventName: string, className: string = "w-5 h-5") => {
    const lowerEventName = eventName.toLowerCase();
    if (lowerEventName.includes('criação')) return <GlobeAltIcon className={className} />;
    if (lowerEventName.includes('queda')) return <ExclamationTriangleIcon className={className} />;
    if (lowerEventName.includes('dilúvio')) return <CloudRainIcon className={className} />;
    if (lowerEventName.includes('pacto')) return <LinkIcon className={className} />;
    if (lowerEventName.includes('torre')) return <BuildingOfficeIcon className={className} />;
    return <CalendarDaysIcon className={className} />;
  }

  const customYearLabel = (yearVal: number | undefined, type: 'event' = 'event') => {
    if (yearVal === undefined) return null;
    const xPos = getPixelX(yearVal);
    // const labelColor = SEMANTIC_COLOR_VARS.eventLine; // Replaced by text-theme-event-line
    return (
      <div
        key={`${type}-year-${yearVal}-${xPos}`}
        style={{ position: 'absolute', left: `${xPos}px`, top: '25px', zIndex: Z_INDICES.yearHeader + 1 }}
        className="transform -translate-x-1/2 text-theme-event-line"
      >
        <span className="px-1 rounded bg-black/60" style={{fontSize: yearMarkerMinorFontSize}}>
          {Math.round(yearVal)} {yearReferenceMode === 'AC' ? 'aC' : ''}
        </span>
         <div className="w-px h-3 mx-auto bg-theme-event-line"></div>
      </div>
    );
  };

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
    const elements: JSX.Element[] = [];
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


    const elements = [];
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
        className="text-white flex items-center justify-start rounded shadow-md hover:opacity-80 transition-opacity"
        title={`${p.name}\n${lifespanInfo}`}
        role="button"
        tabIndex={0}
        onClick={() => onSelectPerson(p)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectPerson(p);}}
      >
        <div className={`flex items-center h-full ${showCharacterBarControls && !isSibling ? 'w-auto min-w-[60px]' : 'w-auto'}`}>
          {showCharacterBarControls && !isSibling && (
            <div style={{ transform: `scale(${globalUiScale * 0.8})` }} className="flex items-center">
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleCharacterVisibility(p.id); }}
                    className="p-1 text-gray-300 hover:text-red-400 focus:outline-none"
                    title={p.isVisible ? "Ocultar personagem" : "Mostrar personagem"}
                    aria-pressed={!p.isVisible}
                >
                    {p.isVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onTogglePersonLifeLine(p.id); }}
                    className={`p-1.5 focus:outline-none transition-colors ${activePersonLifeLines[p.id] ? 'text-yellow-400' : 'text-gray-300 hover:text-white'}`}
                    title={activePersonLifeLines[p.id] ? "Ocultar linhas de vida" : "Mostrar linhas de vida"}
                    aria-pressed={!!activePersonLifeLines[p.id]}
                >
                    {activePersonLifeLines[p.id] ? <ArrowsPointingOutIcon className="w-5 h-5" /> : <ArrowsPointingInIcon className="w-5 h-5" />}
                </button>
                {hasVisibleExpandableSiblings && (
                  <button 
                    onClick={(e) => toggleSiblingExpansion(p.id, e)} 
                    className="p-0.5 focus:outline-none text-gray-300 hover:text-white" 
                    title={expandedSiblingGroups[p.id] ? "Recolher irmãos" : "Expandir irmãos"} 
                    aria-expanded={!!expandedSiblingGroups[p.id]}
                  >
                    {expandedSiblingGroups[p.id] ? <MinusCircleIcon className="w-5 h-5" /> : <PlusCircleIcon className="w-5 h-5" />}
                  </button>
                )}
            </div>
          )}
        </div>
        <div
          className={`flex-grow flex flex-col justify-center h-full cursor-pointer ${textContainerPadding} overflow-hidden`}
        >
          <span className="font-semibold truncate leading-tight" style={{ fontSize: nameFs }}>
            {p.name}
          </span>
          {(p.isCovenantLine || isSibling) && ( 
            <span className="opacity-80 truncate leading-tight" style={{ fontSize: lifespanFs }}>
              {lifespanInfo}
            </span>
          )}
        </div>
        {p.isDeathUnknown && <span className="ml-auto mr-2 opacity-70" style={{ fontSize: lifespanFs }}>?</span>}
      </div>
    );

    if (activePersonLifeLines[p.id] && displayBirthYearText !== undefined && !isSibling) {
      elements.push(
        <div
          key={`birthyear-${p.id}`}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: `${p.x - 5}px`, 
            top: `${actualY + currentBarHeight / 2}px`,
            transform: 'translate(-100%, -50%)', 
            zIndex: Z_INDICES.timelineCharacterBars + 1, 
            backgroundColor: 'var(--app-bg-color, #000)', // Keep direct var for dynamic theme switch
            padding: '2px 4px',
            borderRadius: '3px',
            fontSize: dateLineLabelFontSize
          }}
          className="whitespace-nowrap shadow-md text-theme-person-line-active"
        >
          {Math.round(displayBirthYearText)}{yearSuffix}
        </div>
      );
    }

    if (activePersonLifeLines[p.id] && !isSibling) { 
        elements.push(
          <div
            key={`deathyear-${p.id}`}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: `${p.x + p.barWidthPx + 5}px`, 
              top: `${actualY + currentBarHeight / 2}px`,
              transform: 'translateY(-50%)', 
              zIndex: Z_INDICES.timelineCharacterBars + 1,
              backgroundColor: 'var(--app-bg-color, #000)', // Keep direct var
              padding: '2px 4px',
              borderRadius: '3px',
              fontSize: dateLineLabelFontSize
            }}
            className="whitespace-nowrap shadow-md text-theme-person-line-active"
          >
            &#10013; {displayDeathYearText !== undefined ? Math.round(displayDeathYearText) : '?'}{yearSuffix}
          </div>
        );
    }
    return elements;
  };

  const yearRulerContent = (
    <div
      className="flex items-end px-4" 
      style={{ 
        height: `${SCALED_YEAR_HEADER_HEIGHT}px`, 
        width: `${totalPixelWidth}px`, 
        position: isYearRulerSticky ? 'sticky' : 'absolute', 
        top: 0, 
        left: 0,
        zIndex: Z_INDICES.yearHeader 
      }}
      className="bg-theme-header-bg"
      aria-hidden="true"
    >
      {yearMarkers.map(marker => (
        <div key={`year-marker-${marker.year}-${marker.x}`} style={{ position: 'absolute', left: `${marker.x}px`, bottom: '0px'}} className="h-full flex flex-col items-center justify-end">
            <span 
              className={marker.isMajor ? 'text-theme-year-marker-major' : 'text-theme-year-marker-minor'}
              style={{ 
              fontSize: marker.isMajor ? yearMarkerMajorFontSize : yearMarkerMinorFontSize,
              fontWeight: marker.isMajor ? 'bold' : 'normal',
              opacity: marker.isMajor ? 1 : 0.8,
            }}>
            {Math.round(marker.year)} {yearReferenceMode === 'AC' ? <span style={{fontSize: `calc(0.6rem * ${globalUiScale})`}}>aC</span> : ''}
          </span>
          <div 
            className={`w-px ${marker.isMajor ? 'h-8 bg-theme-year-marker-major' : 'h-4 bg-theme-year-marker-minor'}`} 
            style={{ height: marker.isMajor ? BASE_DIMENSIONS.timelineMarkerMajorHeight * globalUiScale : BASE_DIMENSIONS.timelineMarkerMinorHeight * globalUiScale }}
          ></div>
        </div>
      ))}
      {events.map(event => { 
        const eventDisplayYear = getDisplayYear(event.year);
        if (eventDisplayYear === undefined) return null;
        return customYearLabel(eventDisplayYear, 'event');
      })}
    </div>
  );


  return (
    <div className="w-full h-full flex overflow-hidden relative bg-theme-app-bg">
      <div className="flex-grow h-full overflow-auto relative" id="timeline-scroll-container" role="region" aria-label="Linha do Tempo Genealógica">
        
        <button
          onClick={() => setIsYearRulerSticky(!isYearRulerSticky)}
          className="transition-colors duration-150 focus:outline-none hover:opacity-80 p-1.5 rounded-md bg-theme-button-bg text-theme-text"
          title={isYearRulerSticky ? "Desafixar Régua de Anos" : "Fixar Régua de Anos"}
          aria-pressed={isYearRulerSticky}
          style={{
            position: 'sticky', 
            top: `${8 * globalUiScale}px`, 
            left: `${totalPixelWidth - (36 * globalUiScale) - (8*globalUiScale)}px`, // Positioned to the right, considering button width and padding
            width: `${36 * globalUiScale}px`, // Approximate width for a square button
            height: `${36 * globalUiScale}px`,
            zIndex: Z_INDICES.yearHeader + 5,
          }}
        >
          {isYearRulerSticky ? <LockClosedIcon className="w-5 h-5 mx-auto" /> : <LockOpenIcon className="w-5 h-5 mx-auto" />}
        </button>
        
        {yearRulerContent}
        
        <div
          ref={mainTimelineContentRef}
          className="relative timeline-bg-gradient"
          style={{
            width: `${totalPixelWidth}px`,
            minHeight: `${timelineHeight}px`, 
            paddingTop: isYearRulerSticky ? `0px` : `${SCALED_YEAR_HEADER_HEIGHT}px`, 
            zIndex: Z_INDICES.timelineBackground,
          }}
        >
            {/* Horizontal Grid Lines */}
            {Array.from({ length: Math.floor(timelineHeight / (SCALED_BAR_HEIGHT + SCALED_BAR_VERTICAL_GAP)) + 15 }).map((_, i) => (
                <div
                key={`h-grid-${i}`}
                className="absolute left-0 right-0 border-b"
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
          })}

          {processedEventsData.map((event) => {
            if (!event) return null; 
            const xPos = event.xPos;
            const eventNameY = event.eventNameY;
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
                    </div>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: `${xPos + 8 * globalUiScale}px`, 
                    top: `${eventNameY}px`,
                    zIndex: Z_INDICES.eventIconsAndLabels,
                    writingMode: 'vertical-rl', 
                    transform: 'rotate(180deg)', 
                    maxHeight: `${SCALED_EVENT_LABEL_MAX_HEIGHT}px`,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', 
                    fontSize: eventTextFontSize 
                  }}
                  className={`px-0.5 py-1 bg-black/60 rounded shadow cursor-pointer text-theme-text`}
                  onClick={() => onSelectEvent(event)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectEvent(event);}}
                  role="button"
                  tabIndex={0}
                  title={event.name}
                  aria-label={`Ver detalhes do evento ${event.name} (texto vertical)`}
                >
                  {event.name}
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
            let siblingElements: JSX.Element[] = [];

            if (expandedSiblingGroups[p.id] && p.nonCovenantChildren.length > 0) {
                let currentSiblingY = p.y + SCALED_BAR_HEIGHT + SCALED_BAR_VERTICAL_GAP;
                const visibleSiblings = p.nonCovenantChildren.filter(s => !hiddenCharacterIds.includes(s.id));

                siblingElements = visibleSiblings.flatMap((sibling) => {
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
                        displayBirthAC: yearReferenceMode === 'AC' ? siblingBirthDisplay : undefined,
                        displayDeathAC: yearReferenceMode === 'AC' ? siblingDeathDisplay : undefined,
                        displayBirthRelative: yearReferenceMode === 'Relative' ? siblingBirthDisplay : undefined,
                        displayDeathRelative: yearReferenceMode === 'Relative' ? siblingDeathDisplay : undefined,
                        x: siblingX,
                        y: siblingY,
                        barWidthPx: siblingBarWidthPx,
                        barColor: personBarPalette[(sortedAllPeople.findIndex(sp => sp.id === sibling.id)) % personBarPalette.length], 
                        nonCovenantChildren: [], 
                        isDeathUnknown: sibling.deathYear === undefined && sibling.totalLifespan === undefined,
                    };
                    return renderPersonBarWithLifespan(siblingDisplayData, true, 0, siblingY);
                });
            }
            return [...parentElements, ...siblingElements];
          })}
        </div>
      </div>
    </div>
  );
};

export default TimelineView;