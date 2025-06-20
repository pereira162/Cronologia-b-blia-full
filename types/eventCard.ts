// types/eventCard.ts
// Types for event card positioning and interaction

export interface EventCardPosition {
  eventId: string;
  x: number;
  y: number;
  alignment: 'left' | 'center' | 'right';
  isDragging?: boolean;
}

export interface EventCardInteraction {
  onPositionChange: (eventId: string, position: Partial<EventCardPosition>) => void;
  onAlignmentChange: (eventId: string, alignment: 'left' | 'center' | 'right') => void;
  getPosition: (eventId: string) => EventCardPosition | null;
}
