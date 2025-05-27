/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Add other paths if components are located elsewhere e.g. "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
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
        // Add other semantic colors from SEMANTIC_COLOR_VARS in stylingConstants.ts
        'theme-scrollbar-track': 'var(--scrollbar-track-color)',
        'theme-scrollbar-thumb': 'var(--scrollbar-thumb-color)',
        'theme-scrollbar-thumb-hover': 'var(--scrollbar-thumb-hover-color)',
        'theme-year-marker-major': 'var(--timeline-year-marker-major-color)',
        'theme-year-marker-minor': 'var(--timeline-year-marker-minor-color)',
        'theme-grid-line': 'var(--timeline-grid-line-color)',
        'theme-person-line-active': 'var(--person-line-active-color)',
        'theme-event-line': 'var(--event-line-color)',
      }
    },
  },
  plugins: [],
}
