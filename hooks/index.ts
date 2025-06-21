// hooks/index.ts
// Central export point for all custom hooks
// Following React 19 best practices for clean imports

export { useOnClickOutside } from './useOnClickOutside';
export { useLocalStorage } from './useLocalStorage';
export { useFontSize } from './useFontSize';

// Bible API hooks - new implementation only
export { useBibleApi } from './useBibleApi'; // New Bible Digital API

export type { FontSizeScale, FontSizeConfig } from './useFontSize';
