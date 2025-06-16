// themes.ts
// Material Design 3 Color System
// Following Material Design 3 (m3.material.io) guidelines for modern, accessible theming

export interface Theme {
  id: string;
  name: string;
  colors: {
    // Material Design 3 Color Tokens
    primary: string;
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    
    secondary: string;
    onSecondary: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    
    tertiary: string;
    onTertiary: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
    
    error: string;
    onError: string;
    errorContainer: string;
    onErrorContainer: string;
    
    surface: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
    
    outline: string;
    outlineVariant: string;
    
    background: string;
    onBackground: string;
    
    // Custom semantic colors for timeline
    timelineBackground: string;
    characterBar: string;
    eventMarker: string;
    yearLine: string;
      // Legacy support (will be removed in future versions)
    appBg: string;
    headerBg: string;
    textColor: string;
    accentColor: string;
    buttonBg: string;
    buttonHoverBg: string;
    cardBg: string;
    cardHeaderColor: string;
    borderColor: string;
    personBarPalette: string[];
    timelineGradientStart: string;
    timelineGradientEnd: string;
    previewColors: [string, string, string];
  };
}

// Material Design 3 Light Theme
const lightTheme: Theme = {
  id: 'light',
  name: 'Claro',
  colors: {
    // Primary (Blue)
    primary: '#1976D2',
    onPrimary: '#FFFFFF',
    primaryContainer: '#E3F2FD',
    onPrimaryContainer: '#0D47A1',
    
    // Secondary (Teal)
    secondary: '#00796B',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E0F2F1',
    onSecondaryContainer: '#004D40',
    
    // Tertiary (Amber)
    tertiary: '#F57C00',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FFF8E1',
    onTertiaryContainer: '#E65100',
    
    // Error
    error: '#D32F2F',
    onError: '#FFFFFF',
    errorContainer: '#FFEBEE',
    onErrorContainer: '#B71C1C',
    
    // Surface & Background
    surface: '#FFFFFF',
    onSurface: '#1C1B1F',
    surfaceVariant: '#F5F5F5',
    onSurfaceVariant: '#49454F',
    surfaceContainer: '#FAFAFA',
    surfaceContainerHigh: '#F0F0F0',
    surfaceContainerHighest: '#E8E8E8',
    
    // Outline
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
    
    // Background
    background: '#FEFBFF',
    onBackground: '#1C1B1F',
    
    // Timeline specific
    timelineBackground: '#FFFFFF',
    characterBar: '#E3F2FD',
    eventMarker: '#1976D2',
    yearLine: '#E0E0E0',
      // Legacy support
    appBg: '#FEFBFF',
    headerBg: '#FFFFFF',
    textColor: '#1C1B1F',
    accentColor: '#1976D2',
    buttonBg: '#1976D2',
    buttonHoverBg: '#1565C0',
    cardBg: '#FFFFFF',
    cardHeaderColor: '#49454F',
    borderColor: '#CAC4D0',
    timelineGradientStart: '#E3F2FD',
    timelineGradientEnd: '#BBDEFB',
    previewColors: ['#1976D2', '#E3F2FD', '#FFFFFF'],
    personBarPalette: [
      '#1976D2', // Primary Blue
      '#00796B', // Secondary Teal
      '#F57C00', // Tertiary Amber
      '#7B1FA2', // Purple
      '#388E3C', // Green
      '#D32F2F', // Error Red
    ],
  }
};

// Material Design 3 Dark Theme
const darkTheme: Theme = {
  id: 'dark',
  name: 'Escuro',
  colors: {
    // Primary (Blue)
    primary: '#90CAF9',
    onPrimary: '#0D47A1',
    primaryContainer: '#1565C0',
    onPrimaryContainer: '#E3F2FD',
    
    // Secondary (Teal)
    secondary: '#4DB6AC',
    onSecondary: '#004D40',
    secondaryContainer: '#00695C',
    onSecondaryContainer: '#E0F2F1',
    
    // Tertiary (Amber)
    tertiary: '#FFB74D',
    onTertiary: '#E65100',
    tertiaryContainer: '#F57C00',
    onTertiaryContainer: '#FFF8E1',
    
    // Error
    error: '#F28B82',
    onError: '#B71C1C',
    errorContainer: '#D32F2F',
    onErrorContainer: '#FFEBEE',
    
    // Surface & Background
    surface: '#1E1E1E',
    onSurface: '#E6E1E5',
    surfaceVariant: '#2D2D2D',
    onSurfaceVariant: '#CAC4D0',
    surfaceContainer: '#262626',
    surfaceContainerHigh: '#333333',
    surfaceContainerHighest: '#404040',
    
    // Outline
    outline: '#938F99',
    outlineVariant: '#49454F',
    
    // Background
    background: '#121212',
    onBackground: '#E6E1E5',
    
    // Timeline specific
    timelineBackground: '#1E1E1E',
    characterBar: '#1565C0',
    eventMarker: '#90CAF9',
    yearLine: '#404040',
      // Legacy support
    appBg: '#121212',
    headerBg: '#1E1E1E',
    textColor: '#E6E1E5',
    accentColor: '#90CAF9',
    buttonBg: '#90CAF9',
    buttonHoverBg: '#64B5F6',
    cardBg: '#1E1E1E',
    cardHeaderColor: '#CAC4D0',
    borderColor: '#49454F',
    timelineGradientStart: '#1565C0',
    timelineGradientEnd: '#1976D2',
    previewColors: ['#90CAF9', '#1565C0', '#1E1E1E'],
    personBarPalette: [
      '#90CAF9', // Primary Blue
      '#4DB6AC', // Secondary Teal
      '#FFB74D', // Tertiary Amber
      '#CE93D8', // Purple
      '#81C784', // Green
      '#F28B82', // Error Red
    ],
  }
};

export const themes: Theme[] = [lightTheme, darkTheme];
