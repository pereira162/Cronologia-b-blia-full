/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Add other paths if components are located elsewhere e.g. "./src/**/*.{js,ts,jsx,tsx}"
  ],
  
  // Tailwind CSS 3.4: Enhanced dark mode with custom variants
  darkMode: ['variant', [
    '@media (prefers-color-scheme: dark) { &:not(.light *) }',
    '&:is(.dark *)',
  ]],
  
  theme: {
    extend: {
      colors: {
        // Existing theme colors with CSS variables
        'theme-app-bg': 'var(--app-bg-color)',
        'theme-header-bg': 'var(--header-bg-color)',
        'theme-timeline-gradient-start': 'var(--timeline-gradient-start)',
        'theme-timeline-gradient-end': 'var(--timeline-gradient-end)',
        'theme-text': 'var(--text-color)', // Main text color
        'theme-accent': 'var(--accent-color)',
        'theme-button-bg': 'var(--button-bg-color)',
        'theme-button-hover-bg': 'var(--button-hover-bg-color)',
        'theme-card-bg': 'var(--card-bg-color)',
        'theme-card-header': 'var(--card-header-color)',
        'theme-border': 'var(--border-color)',
        
        // Tailwind 3.4: Enhanced scrollbar and interaction colors
        'theme-scrollbar-track': 'var(--scrollbar-track-color)',
        'theme-scrollbar-thumb': 'var(--scrollbar-thumb-color)',
        'theme-scrollbar-thumb-hover': 'var(--scrollbar-thumb-hover-color)',
        'theme-year-marker-major': 'var(--timeline-year-marker-major-color)',
        'theme-year-marker-minor': 'var(--timeline-year-marker-minor-color)',        'theme-grid-line': 'var(--timeline-grid-line-color)',
        'theme-person-line-active': 'var(--person-line-active-color)',
        'theme-event-line': 'var(--event-line-color)',
          // Contraste melhorado para labels e textos
        'theme-timeline-label-bg': 'var(--timeline-label-bg-color)',
        'theme-timeline-label-text': 'var(--timeline-label-text-color)',
        'theme-character-bar-text': 'var(--character-bar-text-color)',
        'theme-event-label-bg': 'var(--event-label-bg-color)',        'theme-event-label-text': 'var(--event-label-text-color)',
        'theme-control-icon': 'var(--control-icon-color)',
        'theme-control-icon-hover': 'var(--control-icon-hover-color)',
        'theme-year-info-bg': 'var(--year-info-bg-color)',
        'theme-year-info-text': 'var(--year-info-text-color)',
        'theme-lifespan-text': 'var(--lifespan-text-color)',
      },
      
      // Tailwind 3.4: Enhanced animations and transitions
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
        // Tailwind 3.4: Enhanced spacing and sizing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // Material Design 3 Typography Classes
      fontFamily: {
        'md-display-large': ['var(--md-sys-typescale-display-large-font)'],
        'md-display-medium': ['var(--md-sys-typescale-display-medium-font)'],
        'md-display-small': ['var(--md-sys-typescale-display-small-font)'],
        'md-headline-large': ['var(--md-sys-typescale-headline-large-font)'],
        'md-headline-medium': ['var(--md-sys-typescale-headline-medium-font)'],
        'md-headline-small': ['var(--md-sys-typescale-headline-small-font)'],
        'md-title-large': ['var(--md-sys-typescale-title-large-font)'],
        'md-title-medium': ['var(--md-sys-typescale-title-medium-font)'],
        'md-title-small': ['var(--md-sys-typescale-title-small-font)'],
        'md-body-large': ['var(--md-sys-typescale-body-large-font)'],
        'md-body-medium': ['var(--md-sys-typescale-body-medium-font)'],
        'md-body-small': ['var(--md-sys-typescale-body-small-font)'],
        'md-label-large': ['var(--md-sys-typescale-label-large-font)'],
        'md-label-medium': ['var(--md-sys-typescale-label-medium-font)'],
        'md-label-small': ['var(--md-sys-typescale-label-small-font)'],
      },

      fontSize: {
        'md-display-large': [
          'var(--md-sys-typescale-display-large-size)', 
          {
            lineHeight: 'var(--md-sys-typescale-display-large-line-height)',
            letterSpacing: 'var(--md-sys-typescale-display-large-tracking)',
            fontWeight: 'var(--md-sys-typescale-display-large-weight)'
          }
        ],
        'md-display-medium': [
          'var(--md-sys-typescale-display-medium-size)', 
          {
            lineHeight: 'var(--md-sys-typescale-display-medium-line-height)',
            letterSpacing: 'var(--md-sys-typescale-display-medium-tracking)',
            fontWeight: 'var(--md-sys-typescale-display-medium-weight)'
          }
        ],
        'md-headline-large': [
          'var(--md-sys-typescale-headline-large-size)', 
          {
            lineHeight: 'var(--md-sys-typescale-headline-large-line-height)',
            letterSpacing: 'var(--md-sys-typescale-headline-large-tracking)',
            fontWeight: 'var(--md-sys-typescale-headline-large-weight)'
          }
        ],
        'md-headline-medium': [
          'var(--md-sys-typescale-headline-medium-size)', 
          {
            lineHeight: 'var(--md-sys-typescale-headline-medium-line-height)',
            letterSpacing: 'var(--md-sys-typescale-headline-medium-tracking)',
            fontWeight: 'var(--md-sys-typescale-headline-medium-weight)'
          }
        ],
        'md-title-large': [
          'var(--md-sys-typescale-title-large-size)', 
          {
            lineHeight: 'var(--md-sys-typescale-title-large-line-height)',
            letterSpacing: 'var(--md-sys-typescale-title-large-tracking)',
            fontWeight: 'var(--md-sys-typescale-title-large-weight)'
          }
        ],
        'md-title-medium': [
          'var(--md-sys-typescale-title-medium-size)', 
          {
            lineHeight: 'var(--md-sys-typescale-title-medium-line-height)',
            letterSpacing: 'var(--md-sys-typescale-title-medium-tracking)',
            fontWeight: 'var(--md-sys-typescale-title-medium-weight)'
          }
        ],
        'md-body-large': [
          'var(--md-sys-typescale-body-large-size)', 
          {
            lineHeight: 'var(--md-sys-typescale-body-large-line-height)',
            letterSpacing: 'var(--md-sys-typescale-body-large-tracking)',
            fontWeight: 'var(--md-sys-typescale-body-large-weight)'
          }
        ],
        'md-body-medium': [
          'var(--md-sys-typescale-body-medium-size)', 
          {
            lineHeight: 'var(--md-sys-typescale-body-medium-line-height)',
            letterSpacing: 'var(--md-sys-typescale-body-medium-tracking)',
            fontWeight: 'var(--md-sys-typescale-body-medium-weight)'
          }
        ],
        'md-label-large': [
          'var(--md-sys-typescale-label-large-size)', 
          {
            lineHeight: 'var(--md-sys-typescale-label-large-line-height)',
            letterSpacing: 'var(--md-sys-typescale-label-large-tracking)',
            fontWeight: 'var(--md-sys-typescale-label-large-weight)'
          }
        ],
        'md-label-medium': [
          'var(--md-sys-typescale-label-medium-size)', 
          {
            lineHeight: 'var(--md-sys-typescale-label-medium-line-height)',
            letterSpacing: 'var(--md-sys-typescale-label-medium-tracking)',
            fontWeight: 'var(--md-sys-typescale-label-medium-weight)'
          }
        ],
        'md-label-small': [
          'var(--md-sys-typescale-label-small-size)', 
          {
            lineHeight: 'var(--md-sys-typescale-label-small-line-height)',
            letterSpacing: 'var(--md-sys-typescale-label-small-tracking)',
            fontWeight: 'var(--md-sys-typescale-label-small-weight)'
          }
        ],
      },

      // Material Design 3 Shape Classes
      borderRadius: {
        'md-none': 'var(--md-sys-shape-corner-none)',
        'md-xs': 'var(--md-sys-shape-corner-extra-small)',
        'md-sm': 'var(--md-sys-shape-corner-small)',
        'md-md': 'var(--md-sys-shape-corner-medium)',
        'md-lg': 'var(--md-sys-shape-corner-large)',
        'md-xl': 'var(--md-sys-shape-corner-extra-large)',
        'md-full': 'var(--md-sys-shape-corner-full)',
        
        // Component-specific
        'md-button': 'var(--md-comp-button-shape)',
        'md-card': 'var(--md-comp-card-shape)',
        'md-dialog': 'var(--md-comp-dialog-shape)',
        'md-text-field': 'var(--md-comp-text-field-shape)',
      }
    },
  },
  
  // Tailwind 3.4: Future compatibility flags
  future: {
    hoverOnlyWhenSupported: true,
  },
  
  // Experimental features for performance
  experimental: {
    optimizeUniversalDefaults: true,
  },
  
  plugins: [],
}
