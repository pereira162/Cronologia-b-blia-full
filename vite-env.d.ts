/// <reference types="vite/client" />

// React 19 JSX Runtime types
/// <reference types="react/jsx-runtime" />

// Vite Environment Variables with TypeScript support
interface ImportMetaEnv {
  readonly VITE_API_KEY?: string
  readonly GEMINI_API_KEY?: string
  readonly REACT_APP_BIBLE_API_TOKEN?: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
