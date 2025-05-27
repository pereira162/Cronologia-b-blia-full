

import { Theme } from './types';

export const themes: Theme[] = [
  {
    id: 'modern-dark',
    name: 'Escuro Moderno (Padrão)',
    colors: {
      appBg: '#111827', // Gray-900
      headerBg: '#1f2937', // Gray-800
      timelineGradientStart: '#374151', // Gray-700
      timelineGradientEnd: '#4b5563', // Gray-600
      textColor: '#f3f4f6', // Gray-100
      accentColor: '#60a5fa', // blue-400 (Original Accent)
      personBarPalette: [
        '#3b82f6', // Blue-500
        '#1d4ed8', // Blue-700
        '#0891b2', // Cyan-600
        '#059669', // Emerald-600
        '#7c3aed', // Violet-600
        '#db2777', // Pink-600
      ],
      buttonBg: '#60a5fa', // Was Gray-700, now accentColor
      buttonHoverBg: '#3b82f6', // Was Gray-600, now a darker blue
      cardBg: '#1f2937',   // Gray-800
      cardHeaderColor: '#9ca3af', // Gray-400
      borderColor: '#4b5563',   // Gray-600
      previewColors: ['#111827', '#374151', '#60a5fa'],
    },
  },
  {
    id: 'classic-light',
    name: 'Claro Clássico',
    colors: {
      appBg: '#f9fafb', // Gray-50
      headerBg: '#e5e7eb', // Gray-200
      timelineGradientStart: '#d1d5db', // Gray-300
      timelineGradientEnd: '#9ca3af', // Gray-400
      textColor: '#1f2937', // Gray-800
      accentColor: '#3b82f6', // Blue-500
      personBarPalette: [
        '#60a5fa', // Blue-400
        '#2563eb', // Blue-600
        '#10b981', // Emerald-500
        '#f59e0b', // Amber-500
        '#8b5cf6', // Violet-500
        '#ec4899', // Pink-500
      ],
      buttonBg: '#d1d5db', // Gray-300
      buttonHoverBg: '#9ca3af', // Gray-400
      cardBg: '#ffffff',
      cardHeaderColor: '#4b5563', // Gray-600
      borderColor: '#d1d5db',   // Gray-300
      previewColors: ['#f9fafb', '#d1d5db', '#3b82f6'],
    },
  },
  {
    id: 'oceanic-blaze',
    name: 'Chama Oceânica',
    colors: {
      appBg: '#083344', // Dark Cyan
      headerBg: '#0e5c73', // Medium Dark Cyan
      timelineGradientStart: '#06b6d4', // Cyan-500
      timelineGradientEnd: '#22d3ee', // Cyan-400
      textColor: '#f0f9ff', // Light Sky Blue
      accentColor: '#f97316', // Orange-500
      personBarPalette: [
        '#0ea5e9', // Sky-500
        '#0369a1', // Sky-700
        '#ef4444', // Red-500
        '#f59e0b', // Amber-500
        '#14b8a6', // Teal-500
        '#cc7722', // Ochre (custom)
      ],
      buttonBg: '#0e7490', // Cyan-700
      buttonHoverBg: '#155e75', // Cyan-800
      cardBg: '#0c4a6e',   // Cyan-900
      cardHeaderColor: '#67e8f9', // Cyan-300
      borderColor: '#0e7490',   // Cyan-700
      previewColors: ['#083344', '#06b6d4', '#f97316'],
    },
  },
  {
    id: 'sunset-glow',
    name: 'Brilho do Pôr do Sol',
    colors: {
      appBg: '#4a044e', // Dark Magenta
      headerBg: '#701a75', // Medium Dark Magenta
      timelineGradientStart: '#f97316', // Orange-500
      timelineGradientEnd: '#facc15', // Yellow-400
      textColor: '#fdf4ff', // Ghost White variant
      accentColor: '#ec4899', // Pink-500
      personBarPalette: [
        '#c026d3', // Fuchsia-600
        '#ea580c', // Orange-600
        '#eab308', // Yellow-500
        '#9333ea', // Purple-600
        '#be185d', // Pink-700
        '#d946ef', // Fuchsia-500
      ],
      buttonBg: '#c026d3', // Fuchsia-600
      buttonHoverBg: '#a21caf', // Fuchsia-700
      cardBg: '#581c87',   // Purple-900
      cardHeaderColor: '#f0abfc', // Fuchsia-300
      borderColor: '#86198f',   // Fuchsia-800
      previewColors: ['#4a044e', '#f97316', '#ec4899'],
    },
  },
   {
    id: 'spring-meadow',
    name: 'Prado Primaveril',
    colors: {
      appBg: '#f0fff4', // Honeydew (very light green)
      headerBg: '#98fb98', // PaleGreen
      timelineGradientStart: '#8fbc8f', // DarkSeaGreen
      timelineGradientEnd: '#90ee90', // LightGreen
      textColor: '#006400', // DarkGreen
      accentColor: '#ff69b4', // HotPink
      personBarPalette: [
        '#3cb371', // MediumSeaGreen
        '#2e8b57', // SeaGreen
        '#ff7f50', // Coral
        '#ffa07a', // LightSalmon
        '#dda0dd', // Plum
        '#ee82ee', // Violet
      ],
      buttonBg: '#90ee90', // LightGreen
      buttonHoverBg: '#32cd32', // LimeGreen
      cardBg: '#f5fffa',   // MintCream
      cardHeaderColor: '#228b22', // ForestGreen
      borderColor: '#98fb98',   // PaleGreen
      previewColors: ['#f0fff4', '#8fbc8f', '#ff69b4'],
    },
  },
];