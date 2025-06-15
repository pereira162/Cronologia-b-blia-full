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
        'theme-year-marker-minor': 'var(--timeline-year-marker-minor-color)',
        'theme-grid-line': 'var(--timeline-grid-line-color)',
        'theme-person-line-active': 'var(--person-line-active-color)',
        'theme-event-line': 'var(--event-line-color)',
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
