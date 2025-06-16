// useFontSize.ts
// Custom hook for font size management with Material Design 3 typography scale
// Follows React 19 best practices with local storage persistence

import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

// Material Design 3 Typography Scale - Simplified to 5 levels
export type FontSizeScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface FontSizeConfig {
  scale: FontSizeScale;
  baseSize: number;
  multiplier: number;
  description: string;
}

const fontSizeConfigs: Record<FontSizeScale, FontSizeConfig> = {
  xs: {
    scale: 'xs',
    baseSize: 13,
    multiplier: 0.8125,
    description: 'Muito Pequeno'
  },
  sm: {
    scale: 'sm',
    baseSize: 14,
    multiplier: 0.875,
    description: 'Pequeno'
  },
  md: {
    scale: 'md',
    baseSize: 16,
    multiplier: 1.0,
    description: 'Médio (Padrão)'
  },
  lg: {
    scale: 'lg',
    baseSize: 18,
    multiplier: 1.125,
    description: 'Grande'
  },
  xl: {
    scale: 'xl',
    baseSize: 20,
    multiplier: 1.25,
    description: 'Muito Grande'
  }
};

/**
 * Custom hook for managing font size with accessibility support
 * 
 * @returns Object with current font size configuration and setter function
 * 
 * @example
 * const { fontSize, setFontSize, getFontSize } = useFontSize();
 * const titleSize = getFontSize('title'); // Gets scaled title size
 */
export function useFontSize() {
  const [currentScale, setCurrentScale] = useLocalStorage<FontSizeScale>('fontSizeScale', 'md');
  
  // Verificação de segurança para garantir que currentScale é válido
  const safeCurrentScale = fontSizeConfigs[currentScale] ? currentScale : 'md';
  const currentConfig = fontSizeConfigs[safeCurrentScale];
  
  // Update CSS variables when font size changes
  useEffect(() => {
    if (currentConfig && currentConfig.baseSize && currentConfig.multiplier) {
      const root = document.documentElement;
      root.style.setProperty('--dynamic-font-size-base', `${currentConfig.baseSize}px`);
      root.style.setProperty('--dynamic-font-size-multiplier', currentConfig.multiplier.toString());
    }
  }, [currentConfig]);
  
  /**
   * Get scaled font size for specific text type
   * @param textType - Type of text (following Material Design 3 typography)
   * @returns Scaled font size in pixels
   */  const getFontSize = (textType: 'body' | 'title' | 'headline' | 'display' | 'label'): number => {
    // Verificação de segurança para currentConfig
    if (!currentConfig || !currentConfig.baseSize || !currentConfig.multiplier) {
      // Valores fallback baseados no tamanho médio
      const fallbackBase = 16;
      const fallbackMultiplier = 1;
      
      switch (textType) {
        case 'display':
          return Math.round(fallbackBase * 2.5 * fallbackMultiplier);
        case 'headline':
          return Math.round(fallbackBase * 2 * fallbackMultiplier);
        case 'title':
          return Math.round(fallbackBase * 1.5 * fallbackMultiplier);
        case 'body':
          return Math.round(fallbackBase * fallbackMultiplier);
        case 'label':
          return Math.round(fallbackBase * 0.875 * fallbackMultiplier);
        default:
          return Math.round(fallbackBase * fallbackMultiplier);
      }
    }
    
    const baseSize = currentConfig.baseSize;
    const multiplier = currentConfig.multiplier;
    
    switch (textType) {
      case 'display':
        return Math.round(baseSize * 2.5 * multiplier); // Large headlines
      case 'headline':
        return Math.round(baseSize * 2 * multiplier); // Section headers
      case 'title':
        return Math.round(baseSize * 1.5 * multiplier); // Card titles, etc
      case 'body':
        return Math.round(baseSize * multiplier); // Main content
      case 'label':
        return Math.round(baseSize * 0.875 * multiplier); // Small labels
      default:
        return Math.round(baseSize * multiplier);
    }
  };
  
  /**
   * Get CSS rem value for font size
   * @param textType - Type of text
   * @returns CSS rem value as string
   */
  const getFontSizeRem = (textType: 'body' | 'title' | 'headline' | 'display' | 'label'): string => {
    return `${getFontSize(textType) / 16}rem`;
  };
  
  return {
    fontSize: currentConfig,
    setFontSize: setCurrentScale,
    getFontSize,
    getFontSizeRem,
    availableScales: Object.values(fontSizeConfigs),
  };
}
