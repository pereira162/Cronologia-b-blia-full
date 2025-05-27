// stylingConstants.ts
// Este arquivo centraliza constantes de estilização usadas em toda a aplicação,
// facilitando a manutenção e a consistência visual.

// Mapeamento de Classes de Tamanho de Fonte do Tailwind CSS
// Permite usar nomes semânticos para tamanhos de fonte no código.
export const FONT_SIZE_CLASSES = {
  xs: 'text-xs', // Extra pequeno
  sm: 'text-sm', // Pequeno
  base: 'text-base', // Base/Padrão
  lg: 'text-lg', // Grande
  xl: 'text-xl', // Extra grande
  '2xl': 'text-2xl', // 2x Extra grande
  '3xl': 'text-3xl', // 3x Extra grande
};

// Mapeamento de Classes de Espessura de Linha do Tailwind CSS
// Define espessuras para bordas, divisores, etc.
export const LINE_THICKNESS_CLASSES = {
  hairline: 'w-px',   // Fina como um fio de cabelo (geralmente 1px)
  thin: 'w-0.5',     // Fina (ex: Tailwind para 0.125rem / 2px se a base for 4px)
  normal: 'w-1',     // Normal (ex: Tailwind para 0.25rem / 4px)
  thick: 'w-1.5',    // Grossa (ex: Tailwind para 0.375rem / 6px)
  extrathick: 'w-2', // Extra grossa (ex: Tailwind para 0.5rem / 8px)
};

// Dimensões Numéricas Base (Escalonáveis)
// Usadas como base para cálculos de layout que podem ser ajustados por fatores de escala.
export const BASE_DIMENSIONS = {
  characterBarHeight: 50,       // Altura base da barra de um personagem principal
  siblingBarHeight: 24,         // Altura base da barra de um irmão
  barVerticalGap: 10,           // Espaçamento vertical base entre barras de personagens
  siblingVerticalGap: 5,        // Espaçamento vertical base entre barras de irmãos
  yearHeaderHeight: 80,         // Altura base da régua de anos (conteúdo interno escala com globalUiScale)
  personBlockGapBelowStickyRuler: 25, // Gap em pixels abaixo da régua pegajosa até a primeira barra de personagem
  personBlockGapWithNonStickyRuler: 15, // Gap em pixels do topo da área de conteúdo (já preenchida) até a primeira barra de personagem quando a régua não é pegajosa
  eventNameLabelHeight: 30,     // Largura base da etiqueta do nome do evento (quando vertical)
  eventLabelEstimatedHeight: 200, // Altura/Comprimento máximo estimado base para o texto vertical do evento
  eventMinVerticalGap: 30,        // Espaçamento vertical mínimo base entre títulos de eventos e outros elementos
  timelineMarkerMajorHeight: 24,// Altura do marcador de ano principal na régua (base)
  timelineMarkerMinorHeight: 12,// Altura do marcador de ano secundário na régua (base)
  minBarWidthPx: 50,            // Largura mínima em pixels para la barra de um personagem
  minSiblingBarWidthPx: 30,     // Largura mínima em pixels para la barra de um irmão
};

// Padding à esquerda para a área de texto da barra de personagem quando os controles estão visíveis.
export const CHARACTER_BAR_TEXT_PADDING_WITH_CONTROLS = 'pl-1';
// Padding à esquerda para a área de texto quando os controles estão ocultos.
export const CHARACTER_BAR_TEXT_PADDING_WITHOUT_CONTROLS = 'pl-3';

// Nomes de Variáveis CSS de Cores Semânticas
export const SEMANTIC_COLOR_VARS = {
  appBg: 'var(--app-bg-color)',
  headerBg: 'var(--header-bg-color)',
  timelineGradientStart: 'var(--timeline-gradient-start)',
  timelineGradientEnd: 'var(--timeline-gradient-end)',
  textColor: 'var(--text-color)',
  accentColor: 'var(--accent-color)',
  buttonBg: 'var(--button-bg-color)',
  buttonHoverBg: 'var(--button-hover-bg-color)',
  cardBg: 'var(--card-bg-color)',
  cardHeaderColor: 'var(--card-header-color)',
  borderColor: 'var(--border-color)',
  scrollbarTrack: 'var(--scrollbar-track-color)',
  scrollbarThumb: 'var(--scrollbar-thumb-color)',
  scrollbarThumbHover: 'var(--scrollbar-thumb-hover-color)',
  timelineYearMarkerMajor: 'var(--timeline-year-marker-major-color)',
  timelineYearMarkerMinor: 'var(--timeline-year-marker-minor-color)',
  timelineGridLine: 'var(--timeline-grid-line-color)',
  personLineActive: 'var(--person-line-active-color)',
  eventLine: 'var(--event-line-color)',
};

// Índices Z para Camadas da UI
export const Z_INDICES = {
  timelineBackground: 1,
  gridLines: 1,
  parentChildArcs: 2,
  activePersonLines: 3,
  eventVerticalLines: 3,
  timelineCharacterBars: 4,
  eventIconsAndLabels: 5,
  yearHeader: 10,             // Régua de anos (pode ser sticky)
  // Pin button needs to be above yearHeader if it's part of scroll container,
  // and below dropdowns/modals if they are globally positioned.
  // Dropdowns need to be above general UI but below modals.
  // Modals are highest.
  // Controls header needs to be high, but dropdowns from it need to be higher.
  controlsHeader: 45,       // Cabeçalho de controles retrátil (container)
  dropdowns: 50,            // Dropdowns from controls header, should be above controlsHeader and sticky pin button
  modals: 60,               // Modals (CharacterCard, EventCard)
};

// Largura em pixels por 100 anos na escala 1.0x
export const BASE_PIXELS_PER_100_YEARS = 200;
// Escalas Min e Max para os sliders
export const MIN_HORIZONTAL_SCALE = 0.2;
export const MAX_HORIZONTAL_SCALE = 5.0;
export const MIN_VERTICAL_SCALE = 0.5;
export const MAX_VERTICAL_SCALE = 2.5;
export const MIN_GLOBAL_UI_SCALE = 0.7;
export const MAX_GLOBAL_UI_SCALE = 2.5; // Updated to 2.5x