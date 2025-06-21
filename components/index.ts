// components/index.ts
// Central exports for all components

// Original components
export { default as CharacterCard } from './CharacterCard';
export { default as EventCard } from './EventCard';
export { default as TimelineView } from './TimelineView';

// New Material Design 3 components
export { MaterialButton } from './MaterialButton';
export { BibleVerseModal } from './BibleVerseModal';
export { FontSizeControl } from './FontSizeControl';

// Enhanced Material Design 3 components (new implementations)
export { MaterialButton as MaterialButtonEnhanced } from './MaterialButton-enhanced';
export { 
  MaterialCard, 
  MaterialCardHeader, 
  MaterialCardContent, 
  MaterialCardActions 
} from './MaterialCard';
export { CharacterCardEnhanced } from './CharacterCard-enhanced';
