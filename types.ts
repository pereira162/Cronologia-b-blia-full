// types.ts
// Este arquivo define as interfaces e tipos TypeScript usados em toda a aplicação
// para garantir a consistência e a segurança dos dados.

// Interface para representar um personagem bíblico.
export interface Person {
  id: string; 
  name: string; 
  nameMeaning?: string; 
  birthYear?: number; 
  deathYear?: number; 
  ageAtParenthood?: number; 
  totalLifespan?: number; 
  fatherId?: string; 
  motherId?: string; 
  spouseIds?: string[]; 
  childrenIds?: string[]; 
  keyEventIds?: string[]; 
  description?: string; 
  bibleReference?: string; 
  isCovenantLine?: boolean; 
  color?: string; 
}

export type EventCategory = 'principal' | 'secundario' | 'menor';

export interface BibleEvent {
  id: string; 
  name: string; 
  year?: number; 
  description: string; 
  characterIds: string[]; 
  genesisChapter?: string; 
  bibleReference?: string; 
  icon?: React.ReactNode; 
  category: EventCategory; 
}

export interface FamilyLink {
  source: string; 
  target: string; 
  type: 'parent-child' | 'spouse'; 
}

export type YearReferenceMode = 
  'AC' |       
  'Relative';  

export interface ThemeColors {
  appBg: string; 
  headerBg: string; 
  timelineGradientStart: string; 
  timelineGradientEnd: string; 
  textColor: string; 
  accentColor: string; 
  personBarPalette: string[]; 
  buttonBg: string; 
  buttonHoverBg: string; 
  cardBg: string; 
  cardHeaderColor: string; 
  borderColor: string; 
  previewColors: [string, string, string]; 
}

export interface Theme {
  id: string; 
  name: string; 
  colors: ThemeColors; 
}

export interface SiblingExpansionIconProps {
  expanded: boolean; 
  onClick: (e: React.MouseEvent) => void; 
  className?: string; 
}

export interface ToggleCharacterVisibilityIconProps {
  isVisible: boolean; 
  onClick: (e: React.MouseEvent) => void; 
  className?: string; 
}

export interface PersonVisibilityPanelIconProps {
  isOpen: boolean; 
  className?: string; 
}

export interface ToggleBarControlsIconProps {
  controlsVisible: boolean; 
  className?: string; 
}

export interface LifeLineToggleIconProps {
  active: boolean; 
  onClick: (e: React.MouseEvent) => void; 
  className?: string; 
  globalUiScale?: number; // Adicionado para escalar o ícone
}

// Props para o ícone de alternar a visibilidade do painel de configurações.
export interface ToggleConfigsIconProps {
  isOpen: boolean;
  className?: string;
}

// Props para o ícone de "pin" (usado para fixar a régua de anos).
export interface PinIconProps {
  isFixed: boolean; // Indica se o elemento está fixo/sticky
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  title?: string;
  style?: React.CSSProperties; // Para permitir z-index
}

// Props esperadas pelo componente TimelineView
export interface TimelineViewProps {
  people: Person[];
  events: BibleEvent[];
  onSelectPerson: (person: Person) => void;
  onSelectEvent: (event: BibleEvent) => void;
  yearReferenceMode: YearReferenceMode;
  personBarPalette: string[];
  horizontalScale: number; // Escala horizontal base (do slider)
  verticalScale: number;   // Escala vertical base (do slider)
  globalUiScale: number;   // Escala global da UI (do slider)
  hiddenCharacterIds: string[];
  onToggleCharacterVisibility: (personId: string) => void;
  showCharacterBarControls: boolean;
  activePersonLifeLines: Record<string, boolean>;
  onTogglePersonLifeLine: (personId: string) => void;
}