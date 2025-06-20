# PROMPT DESENVOLVIMENTO IA - CRONOLOGIA BÍBLICA INTERATIVA

## 📋 VISÃO GERAL DO PROJETO

**Nome:** Gênesis Interativo - Cronologia Bíblica  
**Tecnologia Principal:** React 19 + TypeScript + Vite + Tailwind CSS  
**Design System:** Material Design 3  
**Objetivo:** Aplicação web interativa para explorar visualmente as narrativas e cronologia do livro de Gênesis

### Stack Tecnológico Completo
- **Frontend:** React 19 com TypeScript
- **Build Tool:** Vite 6.2.0
- **Estilização:** Tailwind CSS 3.4.0
- **Ícones:** Heroicons React 2.1.0
- **Design System:** Material Design 3 (implementação customizada)
- **API Externa:** Bible API para versículos bíblicos

## 🎨 ESTRUTURA DE UI E COMPONENTES

### 1. LAYOUT PRINCIPAL (App.tsx)

#### Header Superior (Fixo)
```
┌─────────────────────────────────────────────────────────────┐
│ [Cronologia Bíblica Interativa]     [Aa][🌙][👁][🔒][≡] │
└─────────────────────────────────────────────────────────────┘
```

**Botões da Direita (ordem):**
1. **Aa** - Controle de tamanho de fonte (dropdown)
2. **🌙/☀️** - Toggle tema claro/escuro
3. **👁/👁‍🗨** - Mostrar/ocultar controles especiais
4. **🔒/🔓** - Fixar/desafixar régua de anos (sticky)
5. **≡/✕** - Expandir/recolher painel de configurações

#### Header de Configurações (Retrátil)
```
┌─────────────────────────────────────────────────────────────┐
│ [aC][📅 Eventos ▼][👥 Personagens ▼]                      │
│                                                             │
│ Escala UI: [────●────] 1.0x                               │
│ Zoom Tempo: [────●────] 1.0x                              │ 
│ Detalhes: [────●────] 1.0x                                │
└─────────────────────────────────────────────────────────────┘
```

**Controles:**
- **aC/Relativo** - Toggle modo de referência temporal
- **📅 Eventos** - Dropdown para filtrar categorias de eventos
- **👥 Personagens** - Dropdown para mostrar/ocultar personagens
- **3 Sliders** - Escalas de UI, tempo e detalhes verticais

#### Rodapé
```
┌─────────────────────────────────────────────────────────────┐
│ Exploração Visual das Narrativas Fundacionais do Livro de  │
│ Gênesis.                                                    │
└─────────────────────────────────────────────────────────────┘
```

### 2. TIMELINE PRINCIPAL (TimelineView.tsx)

#### Régua Cronológica (Sticky/Non-sticky)
```
┌─────────────────────────────────────────────────────────────┐
│ ZONA 3: ⭐3848aC †3000aC     ⭐2500aC †2000aC    (75px)     │
│ ZONA 2:     Criação         Queda           (50px)         │
│ ZONA 1: 4000aC ||| 3500aC ||| 3000aC ||| 2500aC (0-40px)   │
└─────────────────────────────────────────────────────────────┘
```

**3 Zonas da Régua:**
1. **ZONA 1 (Base):** Anos principais e menores com linhas verticais
2. **ZONA 2 (50px altura):** Eventos bíblicos centralizados com anti-sobreposição
3. **ZONA 3 (75px altura):** Nascimentos (⭐) e mortes (†) dos personagens ativos

#### Área de Personagens
```
┌─────────────────────────────────────────────────────────────┐
│ [👁][🔄][+] ADÃO ─────────────────────────── (930 anos)    │
│             └─ [+] EVA ──────── (Esposa)                   │
│                 └─ CAIM ───── (Filho)                      │
│                 └─ ABEL ── (Filho)                         │
│                 └─ SETE ────── (Filho - Linhagem)          │
│                                                             │
│ [👁][🔄][+] SETE ────────────────────────── (912 anos)     │
│             └─ ENOS ─────── (Filho - Linhagem)             │
└─────────────────────────────────────────────────────────────┘
```

**Controles por Personagem:**
- **👁** - Mostrar/ocultar personagem
- **🔄** - Ativar/desativar linhas de vida (vertical)
- **+/-** - Expandir/recolher irmãos não-linhagem

#### Eventos Verticais
```
│     │     │     │     │
│  C  │  Q  │  D  │  T  │  (Linhas verticais dos eventos)
│  r  │  u  │  i  │  o  │  (Textos verticais dos eventos)
│  i  │  e  │  l  │  r  │
│  a  │  d  │  ú  │  r  │
│  ç  │  a  │  v  │  e  │
│  ã  │     │  i  │     │
│  o  │     │  o  │     │
│     │     │     │     │
```

### 3. MODAIS E OVERLAYS

#### CharacterCard (Modal de Personagem)
**Posição:** Centro da tela, overlay com fundo escuro
**Z-Index:** 60 (modais ficam acima de tudo)
**Ativação:** Clique na barra do personagem

```
┌─────────────────────────────────────┐
│ ADÃO                            [✕] │
│ ─────────────────────────────────── │
│ Significado: Terra, Homem           │
│ Referência: Gênesis 1-5             │
│                                     │
│ Nascimento: Ano 0        │ Morte: 930│
│ Tempo de Vida: 930 anos │ Pai: -   │
│                                     │
│ Descrição: Primeiro homem criado... │
│                                     │
│ Eventos Chave:                      │
│ • Criação (Gênesis 1) [clicável]   │
│ • Queda (Gênesis 3) [clicável]     │
│                                     │
│              [Fechar]               │
└─────────────────────────────────────┘
```

**Funcionalidades:**
- Informações cronológicas detalhadas
- Links clicáveis para versículos bíblicos
- Lista de eventos relacionados
- Dados genealógicos (pai, filhos)
- Botão de fechar

#### EventCard (Modal de Evento)
**Posição:** Centro da tela, overlay com fundo escuro
**Z-Index:** 60 (modais ficam acima de tudo)
**Ativação:** Clique na linha vertical do evento ou texto

```
┌─────────────────────────────────────┐
│ CRIAÇÃO DO MUNDO                [✕] │
│ ─────────────────────────────────── │
│ Ano: 0 (Relativo Adão=0)           │
│ Gênesis Capítulos: (Gênesis 1)     │
│                                     │
│ Descrição: Deus cria os céus...     │
│                                     │
│ Participantes:                      │
│ • Adão [clicável]                  │
│ • Eva [clicável]                   │
│                                     │
│              [Fechar]               │
└─────────────────────────────────────┘
```

**Funcionalidades:**
- Ano do evento no modo de referência ativo
- Capítulos de Gênesis relacionados (clicáveis)
- Descrição detalhada
- Lista de participantes (links para CharacterCard)
- Botão de fechar

#### BibleVerseModal (Modal de Versículo)
**Posição:** Centro da tela, overlay com fundo escuro
**Z-Index:** 60 (modais ficam acima de tudo)
**Ativação:** Clique em referências bíblicas nos cards

```
┌─────────────────────────────────────┐
│ Gênesis 1:1                     [✕] │
│ ─────────────────────────────────── │
│ 🔄 Carregando versículo...          │
│                                     │
│ OU                                  │
│                                     │
│ "No princípio criou Deus os céus    │
│ e a terra."                         │
│                                     │
│                     Gênesis 1:1     │
│              [Fechar]               │
└─────────────────────────────────────┘
```

**Funcionalidades:**
- Integração com Bible API
- Estados de loading, erro e sucesso
- Exibição do texto completo
- Nome da tradução bíblica
- Referência formatada

### 4. OVERLAYS DE CAIXAS DE SELEÇÃO

#### Dropdown de Controle de Fonte
**Posição:** Abaixo do botão "Aa"
**Z-Index:** 50 (dropdowns)

```
┌─────────────────────┐
│ Tamanho da Fonte    │
│ ─────────────────── │
│ 🔽 Diminuir        │
│ 🔼 Aumentar        │
│ 🔄 Resetar         │
└─────────────────────┘
```

#### Dropdown de Filtro de Eventos
**Posição:** Abaixo do botão "📅 Eventos"
**Z-Index:** 50 (dropdowns)

```
┌─────────────────────────────────┐
│ Selecionar Eventos              │
│ ─────────────────────────────── │
│ Principal                       │
│ ☑ Criação    ☑ Queda           │
│ ☑ Dilúvio    ☐ Torre de Babel  │
│                                 │
│ Secundário                      │
│ ☑ Caim e Abel  ☐ Nascimentos   │
│                                 │
│ Menor                           │
│ ☐ Detalhes menores             │
└─────────────────────────────────┘
```

#### Dropdown de Visibilidade de Personagens
**Posição:** Abaixo do botão "👥 Personagens"
**Z-Index:** 50 (dropdowns)

```
┌─────────────────────────────────┐
│ Mostrar/Ocultar Personagens    │
│ ─────────────────────────────── │
│ [Mostrar Todos os Personagens] │
│                                 │
│ ☑ Adão (Linhagem)              │
│ ☑ Eva                          │
│ ☐ Caim                         │
│ ☑ Sete (Linhagem)              │
│ ☑ Enos (Linhagem)              │
└─────────────────────────────────┘
```

## 🎯 BOTÕES E SEUS OBJETIVOS

### Botões do Header Superior
1. **Botão Aa (Font Control)**
   - **Objetivo:** Controlar tamanho das fontes da aplicação
   - **Funcionalidade:** Abre dropdown com opções de diminuir, aumentar e resetar
   - **Estado:** `isFontSizeControlOpen`

2. **Botão Sol/Lua (Theme Toggle)**
   - **Objetivo:** Alternar entre tema claro e escuro
   - **Funcionalidade:** Toggle instantâneo do tema
   - **Estado:** `effectiveTheme` ('dark' | 'light')

3. **Botão Olho (Character Bar Controls)**
   - **Objetivo:** Mostrar/ocultar controles especiais nas barras de personagem
   - **Funcionalidade:** Toggle dos botões de visibilidade, linhas de vida e expansão
   - **Estado:** `showCharacterBarControls`

4. **Botão Cadeado (Ruler Sticky)**
   - **Objetivo:** Fixar/desafixar a régua cronológica
   - **Funcionalidade:** Alterna entre régua sticky (fixa no topo) e scroll normal
   - **Estado:** `isYearRulerSticky`

5. **Botão Menu/X (Configurations Panel)**
   - **Objetivo:** Expandir/recolher painel de configurações
   - **Funcionalidade:** Mostra/oculta o header de configurações com animação
   - **Estado:** `showControlsHeader`

### Botões do Header de Configurações
1. **Botão aC/Relativo (Year Reference Mode)**
   - **Objetivo:** Alternar modo de referência de anos
   - **Funcionalidade:** Alterna entre anos "antes de Cristo" e "relativos a Adão"
   - **Estado:** `yearReferenceMode`

2. **Botão Eventos (Event Filter)**
   - **Objetivo:** Filtrar eventos por categoria
   - **Funcionalidade:** Abre dropdown com checkboxes para categorias
   - **Estado:** `selectedEventIds`

3. **Botão Personagens (Character Visibility)**
   - **Objetivo:** Controlar visibilidade de personagens
   - **Funcionalidade:** Abre dropdown com lista de todos os personagens
   - **Estado:** `hiddenCharacterIds`

### Botões por Personagem (quando controles visíveis)
1. **Botão Olho/Olho Riscado (Character Visibility)**
   - **Objetivo:** Mostrar/ocultar personagem individual
   - **Funcionalidade:** Remove/adiciona personagem da timeline
   - **Estado:** `hiddenCharacterIds`

2. **Botão Setas (Life Lines)**
   - **Objetivo:** Ativar/desativar linhas de vida do personagem
   - **Funcionalidade:** Mostra linhas verticais de nascimento e morte
   - **Estado:** `activePersonLifeLines`

3. **Botão +/- (Sibling Expansion)**
   - **Objetivo:** Expandir/recolher irmãos não-linhagem
   - **Funcionalidade:** Mostra sub-barras dos filhos que não são linhagem principal
   - **Estado:** `expandedSiblingGroups`

### Botões dos Modais
1. **Botão X (Close Modal)**
   - **Objetivo:** Fechar modal ativo
   - **Funcionalidade:** Limpa estado de seleção
   - **Posição:** Canto superior direito de todos os modais

2. **Botão Fechar (Close Action)**
   - **Objetivo:** Ação principal de fechamento
   - **Funcionalidade:** Mesmo que botão X mas como ação primária
   - **Posição:** Parte inferior dos modais

## 🎯 ESTADOS E INTERAÇÕES

### Estados Globais (App.tsx)
```typescript
// Modos e visualização
yearReferenceMode: 'AC' | 'Relative'
selectedPerson: Person | null
selectedEvent: BibleEvent | null

// Controles de UI
showControlsHeader: boolean
isFontSizeControlOpen: boolean
isEventSelectorOpen: boolean
isPersonVisibilityPanelOpen: boolean

// Escalas (sliders 0-100 → fatores reais)
horizontalSliderValue: number → baseHorizontalScale
verticalSliderValue: number → baseVerticalScale
globalUiScaleSliderValue: number → globalUiScale

// Visibilidade e funcionalidades
hiddenCharacterIds: string[]
selectedEventIds: string[]
activePersonLifeLines: Record<string, boolean>
showCharacterBarControls: boolean
isYearRulerSticky: boolean

// Modal de versículos
bibleVerseModal: { isOpen: boolean; reference: string }
```

### Estados da Timeline (TimelineView.tsx)
```typescript
// Timeline interno
expandedSiblingGroups: Record<string, boolean>
timelineHeight: number
scrollPosition: number

// Sincronização de scroll
scrollContainerRef: RefObject<HTMLDivElement>
rulerContentRef: RefObject<HTMLDivElement>
```

### Interações Principais
1. **Clique em personagem** → Abre CharacterCard
2. **Clique em evento** → Abre EventCard  
3. **Clique em referência bíblica** → Abre BibleVerseModal
4. **Toggle controles** → Mostra/oculta botões nas barras
5. **Scroll horizontal** → Sincroniza régua e conteúdo
6. **Sticky ruler** → Fixa/libera régua de anos

## 🎨 SISTEMA DE TEMAS E CORES

### Temas Disponíveis
1. **Escuro Moderno (Padrão)** - Material Design 3 Dark
2. **Claro Clássico** - Material Design 3 Light

### Classes CSS Temáticas (Tailwind + CSS Custom Properties)
```css
/* Cores principais */
.bg-theme-app-bg           /* Fundo da aplicação */
.bg-theme-header-bg        /* Fundo dos headers */
.bg-theme-card-bg          /* Fundo dos cards/modais */
.text-theme-text           /* Texto principal */
.text-theme-accent         /* Texto de destaque */
.text-theme-card-header    /* Títulos dos cards */

/* Timeline específico */
.bg-theme-timeline-label-bg
.text-theme-timeline-label-text
.border-theme-border
.border-theme-grid-line

/* Estados especiais */
.text-theme-year-marker-major
.text-theme-year-marker-minor
.text-theme-character-bar-text
.text-theme-lifespan-text
.text-theme-control-icon
```

### Paleta de Cores para Personagens
```typescript
personBarPalette: [
  'var(--person-bar-color-1)',    // Azul
  'var(--person-bar-color-2)',    // Azul Escuro  
  'var(--person-bar-color-3)',    // Verde Escuro
  'var(--person-bar-color-4)',    // Vermelho Escuro
  'var(--person-bar-color-5)',    // Laranja Escuro
  'var(--person-bar-color-6)',    // Roxo Escuro
]
```

## 📐 RÉGUA CRONOLÓGICA - DESIGN E COMPONENTES

### Estrutura da Régua (100px altura base)

#### ZONA 1 - Base (0-40px)
**Componente:** Anos Principais e Menores
- **Anos Principais:** A cada 500 anos (marcadores maiores, texto bold)
- **Anos Menores:** A cada 100 anos (marcadores menores, texto normal)
- **Linhas Verticais:** Conectam com grid da timeline
- **Adaptação Dinâmica:** Intervalo ajusta baseado na escala horizontal

```css
/* Marcador Principal */
.year-marker-major {
  height: 24px; /* Escalonado por globalUiScale */
  font-weight: bold;
  opacity: 1;
}

/* Marcador Menor */
.year-marker-minor {
  height: 12px; /* Escalonado por globalUiScale */
  font-weight: normal;
  opacity: 0.8;
}
```

#### ZONA 2 - Eventos (50px acima da base)
**Componente:** Labels de Eventos Bíblicos
- **Posicionamento:** Centralizado sobre o ano do evento
- **Anti-Sobreposição:** Sistema que detecta proximidade < 100px
- **Alinhamento Inteligente:** Left/Center/Right baseado na proximidade
- **Estilo:** Fundo temático com bordas arredondadas

```typescript
// Sistema de alinhamento
const calculateEventAlignment = (events, currentIndex, eventX) => {
  // Detecta proximidade e ajusta alinhamento
  if (distance < PROXIMITY_THRESHOLD) {
    return eventX < otherEventX ? 'right' : 'left';
  }
  return 'center';
};
```

#### ZONA 3 - Nascimento/Morte (75px acima da base)
**Componente:** Datas de Vida dos Personagens Ativos
- **Nascimento:** ⭐ Verde com ano
- **Morte:** † Vermelho com ano
- **Ativação:** Aparece apenas quando "linhas de vida" estão ativas
- **Anti-Sobreposição Individual:** Cada ano verifica proximidade com todos os outros

```typescript
// Renderização condicional
{visibleMainCovenantPeopleDisplayData
  .filter(p => activePersonLifeLines[p.id] && showCharacterBarControls)
  .map(p => {
    // Renderiza nascimento e morte com verificação de proximidade
  })
}
```

### Funcionalidades da Régua

#### Modo Sticky vs Non-Sticky
- **Sticky:** `position: sticky; top: 0; z-index: 10`
- **Non-Sticky:** `position: relative`
- **Sincronização:** Scroll horizontal sempre sincronizado com conteúdo

#### Responsividade
- **Mobile:** Texto menor, marcadores compactados
- **Desktop:** Texto padrão, espaçamento completo
- **Escala Global:** Todos os elementos escalam com `globalUiScale`

## 📐 SISTEMA DE ESCALAS E RESPONSIVIDADE

### Escalas Configuráveis
```typescript
// Ranges dos sliders (0-100 → fatores reais)
MIN_HORIZONTAL_SCALE = 0.2    // 20% (zoom out)
MAX_HORIZONTAL_SCALE = 5.0    // 500% (zoom in)
MIN_VERTICAL_SCALE = 0.5      // 50% (compacto)
MAX_VERTICAL_SCALE = 2.5      // 250% (expandido)
MIN_GLOBAL_UI_SCALE = 0.7     // 70% (menor)
MAX_GLOBAL_UI_SCALE = 2.5     // 250% (maior)

// Cálculo das escalas efetivas
effectiveHorizontalScale = baseHorizontalScale * globalUiScale
effectiveVerticalScale = baseVerticalScale * globalUiScale
```

### Dimensões Base Escalonáveis
```typescript
BASE_DIMENSIONS = {
  characterBarHeight: 50,           // Altura barra personagem
  siblingBarHeight: 24,            // Altura barra irmão
  barVerticalGap: 10,              // Gap vertical entre barras
  yearHeaderHeight: 100,           // Altura régua de anos
  eventLabelEstimatedHeight: 200,  // Altura máxima label evento
  minBarWidthPx: 50,               // Largura mínima barra
  timelineMarkerMajorHeight: 24,   // Altura marcador principal
  timelineMarkerMinorHeight: 12,   // Altura marcador menor
}
```

### Sistema de Fontes Dinâmicas
```css
/* CSS Custom Properties que escalam automaticamente */
--dynamic-font-size-xs
--dynamic-font-size-sm  
--dynamic-font-size-base
--dynamic-font-size-lg
--dynamic-font-size-xl
--dynamic-font-size-2xl
--dynamic-font-size-3xl

/* Uso em componentes */
fontSize: `calc(var(--dynamic-font-size-lg) * ${globalUiScale})`
```

## 🔧 ARQUITETURA DE DADOS

### Interface Person
```typescript
interface Person {
  id: string
  name: string
  nameMeaning?: string
  birthYear?: number              // Relativo a Adão=0
  deathYear?: number             // Relativo a Adão=0
  ageAtParenthood?: number
  totalLifespan?: number
  fatherId?: string
  motherId?: string
  spouseIds?: string[]
  childrenIds?: string[]
  keyEventIds?: string[]
  description?: string
  bibleReference?: string
  isCovenantLine?: boolean       // Linhagem principal
  color?: string
}
```

### Interface BibleEvent
```typescript
interface BibleEvent {
  id: string
  name: string
  year?: number                  // Relativo a Adão=0
  description: string
  characterIds: string[]
  genesisChapter?: string
  bibleReference?: string
  icon?: React.ReactNode
  category: 'principal' | 'secundario' | 'menor'
}
```

### Conversão de Anos
```typescript
// Constante de referência
STATIC_REFERENCE_AC_YEAR = 3848

// Fórmulas de conversão
displayYearAC = STATIC_REFERENCE_AC_YEAR - relativeYear
displayYearRelative = relativeYear

// Exemplo: Adão nasce no ano 0 relativo
// Em modo AC: 3848 aC
// Em modo Relativo: 0
```

## 🎯 FUNCIONALIDADES ESPECIAIS

### 1. Sistema Anti-Sobreposição
- **Eventos na régua:** Detecta proximidade e alinha à esquerda/direita
- **Labels de eventos:** Algoritmo de posicionamento que evita colisões
- **Datas de nascimento/morte:** Alinhamento inteligente baseado em proximidade

### 2. Linhas de Vida Ativas
- **Ativação:** Toggle por personagem
- **Visualização:** Linhas verticais no nascimento e morte
- **Sincronização:** Integrada com scroll horizontal

### 3. Expansão de Irmãos
- **Trigger:** Botão +/- na barra do personagem principal
- **Layout:** Sub-barras menores abaixo do personagem
- **Herança:** Cores baseadas no índice global da lista ordenada

### 4. Régua Sticky/Non-Sticky
- **Sticky:** Régua permanece visível no topo durante scroll
- **Non-sticky:** Régua faz scroll junto com o conteúdo
- **Sincronização:** Scroll horizontal sempre sincronizado

## 🔄 FLUXOS DE INTERAÇÃO

### Fluxo de Seleção de Personagem
```
Click Personagem → setSelectedPerson(person) → CharacterCard aberto
├─ Click referência bíblica → BibleVerseModal aberto
├─ Click participante evento → EventCard aberto  
└─ Click fechar → setSelectedPerson(null)
```

### Fluxo de Configuração de Escalas
```
Slider movimento → mapSliderToScale() → Nova escala base
├─ Horizontal: afeta largura timeline e zoom temporal
├─ Vertical: afeta altura barras e espaçamentos
└─ Global UI: afeta todas as dimensões e fontes
```

### Fluxo de Filtros
```
Toggle evento → selectedEventIds updated → Timeline re-render
Toggle personagem → hiddenCharacterIds updated → Timeline re-render
Toggle controles → showCharacterBarControls → UI elements visibility
```

## 🎨 GUIDELINES DE DESIGN

### Material Design 3 Components
- **Buttons:** Filled, Outlined, Text variants
- **Typography:** Display, Headline, Title, Label, Body scales
- **Elevation:** Cards com shadow-xl
- **Corner Radius:** rounded-lg para cards, rounded-full para botões
- **Colors:** Primary, Secondary, Surface, Background system

### Acessibilidade
- **ARIA labels:** Todos os botões e elementos interativos
- **Keyboard navigation:** Tab order e Enter/Space support
- **Focus indicators:** Outline visível
- **Alt text:** Imagens e ícones descritivos
- **Color contrast:** Atende WCAG 2.1 AA

### Responsividade
- **Breakpoints:** md: (768px+) para layout desktop
- **Mobile-first:** Design começa mobile e expande
- **Touch targets:** Mínimo 44px para mobile
- **Overflow:** Scroll horizontal para timeline em mobile

## 🔧 SUGESTÕES DE MELHORIAS

### Para CharacterCard
1. **Árvore Genealógica Individual:** Visualização focada no personagem selecionado
2. **Timeline Pessoal:** Eventos específicos da vida do personagem
3. **Galeria Visual:** Imagens, ilustrações, mapas relacionados
4. **Conexões Familiares:** Links clicáveis para todos os familiares
5. **Contexto Histórico:** Situação da época em que viveu
6. **Todas as Menções Bíblicas:** Lista completa de referências no texto
7. **Significado Teológico:** Importância do personagem na narrativa

### Para EventCard  
1. **Mapa Geográfico:** Localização onde o evento ocorreu
2. **Cronologia Detalhada:** Timeline do evento se durou múltiplos anos
3. **Antecedentes e Consequências:** Eventos que levaram a este e resultados
4. **Contexto Cultural:** Costumes e práticas da época
5. **Eventos Paralelos:** O que mais estava acontecendo simultaneamente
6. **Recursos Multimedia:** Vídeos, áudios, animações explicativas
7. **Análise Teológica:** Significado espiritual e lições

### Para Timeline Geral
1. **Modo Genealogia:** Visualização em árvore ao invés de linear
2. **Filtros Avançados:** Por período, região, tipo de evento, linhagem
3. **Sistema de Busca:** Encontrar personagens e eventos rapidamente
4. **Exportação:** PDF, imagem, dados para estudos externos
5. **Anotações Pessoais:** Permitir usuário adicionar notas e marcações
6. **Modo Comparação:** Múltiplas timelines lado a lado
7. **Zoom Automático:** Ajustar escala para mostrar período específico
8. **Mini-mapa:** Visão geral com indicador de posição atual

### Para Sistema Geral
1. **Múltiplas Traduções:** Comparar diferentes versões bíblicas
2. **Suporte a Idiomas:** Interface em múltiplos idiomas
3. **Modo Offline:** Funcionamento completo sem internet
4. **Sincronização de Dados:** Salvar progresso e anotações na nuvem
5. **Modo Apresentação:** Interface otimizada para ensino e palestras
6. **Integração Social:** Compartilhar descobertas e estudos
7. **Estudo Colaborativo:** Múltiplos usuários estudando juntos
8. **Cronologia de Outros Livros:** Expandir para toda a Bíblia

### Performance e Otimização
1. **Virtualização:** Renderizar apenas elementos visíveis na viewport
2. **Lazy Loading:** Carregar componentes e dados sob demanda
3. **Web Workers:** Mover cálculos pesados para background
4. **Service Worker:** Cache inteligente para uso offline
5. **Bundle Splitting:** Carregar funcionalidades conforme necessário
6. **Compressão de Imagens:** Otimizar recursos visuais
7. **Pre-loading:** Antecipar carregamento de dados prováveis

---

**Este prompt foi gerado automaticamente baseado na análise completa do código-fonte da aplicação Cronologia Bíblica Interativa. Use-o como referência completa para desenvolvimento, manutenção e extensão do projeto com ferramentas de IA externas.**
