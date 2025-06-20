// hooks/index.ts
// Central export point for all custom hooks
// Following React 19 best practices for clean imports

export { useOnClickOutside } from './useOnClickOutside';
export { useLocalStorage } from './useLocalStorage';
export { useFontSize } from './useFontSize';

// Bible API hooks - supporting both old and new implementations
export { useBibleApi } from './useBibleApi'; // Legacy support
export { useBibleDigitalApi } from './useBibleDigitalApi'; // New Bible Digital API

// Default export for the new Bible API
export { useBibleDigitalApi as useBible } from './useBibleDigitalApi';

export type { FontSizeScale, FontSizeConfig } from './useFontSize';
export type { BibleVerse, BibleApiState } from './useBibleApi';
export type { BibleContent, UseBibleDigitalApiReturn } from './useBibleDigitalApi';
