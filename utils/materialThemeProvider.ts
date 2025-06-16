// materialThemeProvider.ts
// Material Design 3 Theme Provider utility
// Manages theme application using CSS custom properties and data attributes

export type MaterialTheme = 'light' | 'dark';

export class MaterialThemeProvider {
  private static instance: MaterialThemeProvider;
  private currentTheme: MaterialTheme = 'dark'; // Dark theme as default
  private mediaQuery: MediaQueryList | null = null;
  private listeners: Set<(theme: MaterialTheme) => void> = new Set();

  private constructor() {
    if (typeof window !== 'undefined') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));
      
      // Initialize theme from localStorage or system preference
      this.initializeTheme();
    }
  }

  static getInstance(): MaterialThemeProvider {
    if (!MaterialThemeProvider.instance) {
      MaterialThemeProvider.instance = new MaterialThemeProvider();
    }
    return MaterialThemeProvider.instance;
  }  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('material-theme') as MaterialTheme;
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('dark'); // Default to dark theme (Escuro Moderno was the original default)
    }
  }
  private handleSystemThemeChange = (): void => {
    // No longer needed since we removed auto theme
    // This method can be kept for future extensibility
  };
  private applyTheme(): void {
    const root = document.documentElement;
    const effectiveTheme = this.currentTheme; // Direct assignment since no auto mode
    
    // Set data attribute for CSS targeting
    root.setAttribute('data-theme', effectiveTheme);
    
    // Set additional attributes for compatibility
    root.setAttribute('data-color-scheme', effectiveTheme);
      // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(effectiveTheme);
    
    // Notify listeners
    this.listeners.forEach(listener => listener(this.currentTheme));
  }

  private updateMetaThemeColor(theme: 'light' | 'dark'): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      // Use CSS custom property values
      const themeColor = theme === 'dark' ? '#121212' : '#FEFBFF';
      metaThemeColor.setAttribute('content', themeColor);
    }
  }

  setTheme(theme: MaterialTheme): void {
    this.currentTheme = theme;
    localStorage.setItem('material-theme', theme);
    this.applyTheme();
  }

  getTheme(): MaterialTheme {
    return this.currentTheme;
  }

  getEffectiveTheme(): 'light' | 'dark' {
    return this.currentTheme; // Direct return since no auto mode
  }

  addThemeChangeListener(listener: (theme: MaterialTheme) => void): () => void {
    this.listeners.add(listener);
    
    // Return cleanup function
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Utility method to get current color values
  getColorValue(tokenName: string): string {
    if (typeof window !== 'undefined') {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(tokenName)
        .trim();
    }
    return '';
  }

  // Utility method to set custom color tokens
  setCustomColorToken(tokenName: string, value: string): void {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty(tokenName, value);
    }
  }

  // Utility method to remove custom color tokens
  removeCustomColorToken(tokenName: string): void {
    if (typeof window !== 'undefined') {
      document.documentElement.style.removeProperty(tokenName);
    }
  }  // Get all available themes
  static getAvailableThemes(): { value: MaterialTheme; label: string }[] {
    return [
      { value: 'light', label: 'Claro Clássico' },
      { value: 'dark', label: 'Escuro Moderno (Padrão)' },
    ];
  }

  // Check if dark mode is preferred by system
  isSystemDarkMode(): boolean {
    return this.mediaQuery?.matches ?? false;
  }

  // Force refresh theme application
  refreshTheme(): void {
    this.applyTheme();
  }

  destroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
    }
    this.listeners.clear();
  }
}

// React hook for theme management
import { useState, useEffect } from 'react';

export const useMaterialTheme = () => {
  const themeProvider = MaterialThemeProvider.getInstance();
  const [theme, setTheme] = useState<MaterialTheme>(themeProvider.getTheme());
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(
    themeProvider.getEffectiveTheme()
  );

  useEffect(() => {
    const unsubscribe = themeProvider.addThemeChangeListener((newTheme) => {
      setTheme(newTheme);
      setEffectiveTheme(themeProvider.getEffectiveTheme());
    });

    return unsubscribe;
  }, [themeProvider]);
  const changeTheme = (newTheme: MaterialTheme) => {
    themeProvider.setTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    themeProvider.setTheme(newTheme);
  };

  return {
    theme,
    effectiveTheme,
    changeTheme,
    toggleTheme,
    availableThemes: MaterialThemeProvider.getAvailableThemes(),
    isSystemDarkMode: themeProvider.isSystemDarkMode(),
    getColorValue: themeProvider.getColorValue.bind(themeProvider),
    setCustomColorToken: themeProvider.setCustomColorToken.bind(themeProvider),
    removeCustomColorToken: themeProvider.removeCustomColorToken.bind(themeProvider),
  };
};

// Utility function to create Material color object from CSS tokens
export const createMaterialColorFromTokens = () => {
  const themeProvider = MaterialThemeProvider.getInstance();
  
  return {
    primary: themeProvider.getColorValue('--md-sys-color-primary'),
    onPrimary: themeProvider.getColorValue('--md-sys-color-on-primary'),
    primaryContainer: themeProvider.getColorValue('--md-sys-color-primary-container'),
    onPrimaryContainer: themeProvider.getColorValue('--md-sys-color-on-primary-container'),
    
    secondary: themeProvider.getColorValue('--md-sys-color-secondary'),
    onSecondary: themeProvider.getColorValue('--md-sys-color-on-secondary'),
    secondaryContainer: themeProvider.getColorValue('--md-sys-color-secondary-container'),
    onSecondaryContainer: themeProvider.getColorValue('--md-sys-color-on-secondary-container'),
    
    surface: themeProvider.getColorValue('--md-sys-color-surface'),
    onSurface: themeProvider.getColorValue('--md-sys-color-on-surface'),
    surfaceVariant: themeProvider.getColorValue('--md-sys-color-surface-variant'),
    onSurfaceVariant: themeProvider.getColorValue('--md-sys-color-on-surface-variant'),
    
    background: themeProvider.getColorValue('--md-sys-color-background'),
    onBackground: themeProvider.getColorValue('--md-sys-color-on-background'),
    
    error: themeProvider.getColorValue('--md-sys-color-error'),
    onError: themeProvider.getColorValue('--md-sys-color-on-error'),
    
    outline: themeProvider.getColorValue('--md-sys-color-outline'),
    outlineVariant: themeProvider.getColorValue('--md-sys-color-outline-variant'),
  };
};

// Initialize theme provider when module loads
if (typeof window !== 'undefined') {
  MaterialThemeProvider.getInstance();
}
