# Base de Conhecimento: Material Design 3 - Análise Completa da Documentação

## **Resumo Executivo**

Esta base de conhecimento foi criada através da análise detalhada da documentação oficial do Material Design 3 (M3) disponível em https://m3.material.io e repositórios relacionados. O objetivo é fornecer um guia prático e técnico para implementação de M3 em projetos web, com foco especial na biblioteca Material Web Components.

---

## **1. Visão Geral do Material Design 3**

### **1.1 Conceitos Fundamentais**

- **Material Design 3 (M3)** é a iteração mais recente do sistema de design do Google
- **M3 Expressive** é uma expansão focada em "UX orientada pela emoção" com componentes mais flexíveis e estilos vibrantes
- **Philosophy**: Experiências pessoais, adaptativas e expressivas
- **Licenciamento**: Apache 2.0 e CC BY 4.0

### **1.2 Organização do Sistema**

O M3 está estruturado em **três pilares principais**:

1. **Foundations (Fundações)**: Layout, acessibilidade, interação, design tokens
2. **Styles (Estilos)**: Cor, tipografia, formas, movimento, elevação
3. **Components (Componentes)**: Elementos de UI reutilizáveis

### **1.3 M3 Expressive - Novidades**

- **15 componentes novos ou atualizados** com mais tamanhos, formas e funcionalidades
- **Sistema de movimento baseado em física** para transições mais naturais
- **Biblioteca expandida de 35 formas** para elementos decorativos
- **Tipografia enfatizada** com nova escala e diretrizes para fontes variáveis

---

## **2. Design Tokens - Sistema Central**

### **2.1 Definição e Estrutura**

Design tokens são **decisões de design reutilizáveis** que substituem valores estáticos por nomes autodescritivos.

**Estrutura de um token:**
```
md.ref.palette.secondary90 → #E8DEF8
```

### **2.2 Classes de Tokens**

1. **Reference Tokens (`--md-ref-*`)**
   - Valores estáticos (cores hex, tamanhos, fontes)
   - Não mudam baseado no contexto
   - Exemplo: `--md-ref-typeface-brand: 'Open Sans'`

2. **System Tokens (`--md-sys-*`)**
   - Definem propósito dos reference tokens na UI
   - Onde ocorre a tematização (light/dark)
   - Exemplo: `--md-sys-color-primary: var(--md-ref-palette-primary40)`

3. **Component Tokens (`--md-comp-*`)**
   - Propriedades específicas dos componentes
   - Apontam para system tokens quando possível
   - Exemplo: `--md-filled-button-container-color: var(--md-sys-color-primary)`

### **2.3 Contextos**

Tokens podem ter valores diferentes baseados em condições:
- **Temas**: light/dark
- **Dispositivos**: mobile/tablet/desktop
- **Densidade**: compacto/padrão/expandido
- **Escrita**: LTR/RTL

---

## **3. Sistema de Cores**

### **3.1 Conceitos Principais**

- **Dynamic Color**: Geração automática de esquemas de cores acessíveis
- **Color Roles**: Papéis semânticos (Primary, Secondary, Tertiary, Error, Surface)
- **Tone-based surfaces**: Substituem elevação por tons de superfície

### **3.2 Tokens de Cor Principais**

```css
/* Cores primárias */
--md-sys-color-primary
--md-sys-color-on-primary
--md-sys-color-primary-container
--md-sys-color-on-primary-container

/* Cores secundárias */
--md-sys-color-secondary
--md-sys-color-on-secondary
--md-sys-color-secondary-container
--md-sys-color-on-secondary-container

/* Superfícies */
--md-sys-color-surface
--md-sys-color-surface-bright
--md-sys-color-surface-dim
--md-sys-color-surface-container
--md-sys-color-surface-container-lowest
--md-sys-color-surface-container-low
--md-sys-color-surface-container-high
--md-sys-color-surface-container-highest
```

### **3.3 Implementação Prática**

```css
.primary-element {
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
```

**Ferramenta recomendada**: Material Theme Builder (Figma plugin ou web) para geração de esquemas de cores.

---

## **4. Sistema de Tipografia**

### **4.1 Typefaces (Famílias de Fontes)**

```css
--md-ref-typeface-brand: 'Open Sans';  /* Marca */
--md-ref-typeface-plain: 'Roboto';     /* Texto comum */
```

### **4.2 Typescales (Escalas Tipográficas)**

**5 categorias principais, cada uma com 3 tamanhos (small, medium, large):**

1. **Display**: Textos de destaque
2. **Headline**: Títulos principais
3. **Title**: Subtítulos
4. **Body**: Texto do corpo
5. **Label**: Rótulos e legendas

### **4.3 Tokens Tipográficos**

```css
--md-sys-typescale-body-medium-font
--md-sys-typescale-body-medium-size
--md-sys-typescale-body-medium-line-height
--md-sys-typescale-body-medium-weight
```

### **4.4 Classes CSS**

```css
.md-typescale-display-large
.md-typescale-headline-medium
.md-typescale-body-medium
.md-typescale-label-small
```

**Implementação:**
```javascript
import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';
document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
```

---

## **5. Material Web Components (MWC)**

### **5.1 Instalação**

**NPM (Produção):**
```bash
npm install @material/web
```

**CDN (Prototipagem):**
```html
<script type="importmap">
{
  "imports": {
    "@material/web/": "https://esm.run/@material/web/"
  }
}
</script>
<script type="module">
import '@material/web/all.js';
</script>
```

### **5.2 Componentes Disponíveis para Web**

**✅ Disponíveis:**
- Buttons (todos os tipos)
- Checkbox
- Chips
- Dialogs
- Dividers
- FAB
- Icon Buttons
- Lists
- Menus
- Progress Indicators
- Radio
- Segmented Buttons
- Sliders
- Switch
- Tabs
- Text Fields
- Tooltips

**❌ Indisponíveis:**
- Cards
- Carousel
- Bottom Sheets
- Side Sheets
- Navigation Drawer
- Navigation Rail
- Top App Bar
- Date/Time Pickers
- Snackbar

### **5.3 Importação e Uso**

```javascript
// Importar componentes específicos
import '@material/web/button/filled-button.js';
import '@material/web/textfield/outlined-text-field.js';

// Uso no HTML
<md-filled-button>Click me</md-filled-button>
<md-outlined-text-field label="Nome"></md-outlined-text-field>
```

### **5.4 Tematização de Componentes**

```css
/* Tokens de componente específico */
--md-filled-button-container-color: var(--md-sys-color-primary);
--md-filled-button-label-text-color: var(--md-sys-color-on-primary);

/* Aplicação em classe específica */
md-filled-button.error {
  --md-filled-button-container-color: var(--md-sys-color-error);
  --md-filled-button-label-text-color: var(--md-sys-color-on-error);
}
```

---

## **6. Acessibilidade**

### **6.1 Princípios Fundamentais**

1. **Honor individuals**: Experiências personalizáveis
2. **Learn before, not after**: Pesquisa prévia com usuários diversos
3. **Requirements as starting point**: WCAG como base criativa

### **6.2 Diretrizes Técnicas**

- **Contraste**: Seguir rácios mínimos WCAG
- **Semântica**: Usar elementos HTML nativos
- **Estrutura**: Ordem lógica para leitores de tela
- **Tokens**: Cores acessíveis por padrão

### **6.3 Referência WCAG**

Material Design 3 é baseado nas **WCAG 2.1 Guidelines** para garantir acessibilidade por padrão.

---

## **7. Ferramentas Essenciais**

### **7.1 Material Theme Builder**

**Web**: https://m3.material.io/theme-builder
**Figma Plugin**: Plugin oficial para integração com design

**Funcionalidades:**
- Geração de esquemas de cores dinâmicos
- Exportação de tokens para múltiplos formatos
- Visualização de temas light/dark

### **7.2 Figma Design Kit**

**Link**: https://www.figma.com/community/file/1035203688168086460

**Conteúdo:**
- Milhares de variantes de componentes
- Metadados de acessibilidade
- Nomes de tokens para inspeção
- Suporte a M3 Expressive

### **7.3 Material Color Utilities**

```bash
npm install @material/material-color-utilities
```

Biblioteca para geração de esquemas de cores em runtime.

---

## **8. Layout e Design Responsivo**

### **8.1 Window Size Classes**

**5 breakpoints padrão:**
- **Compact**: < 600dp
- **Medium**: 600-840dp  
- **Expanded**: 840-1200dp
- **Large**: 1200-1600dp
- **Extra Large**: > 1600dp

### **8.2 Canonical Layouts**

Padrões pré-definidos para layouts responsivos:
- **List-detail**
- **Feed**
- **Hub**
- **Gallery**

### **8.3 Elementos de Layout**

- **Pane**: Painéis principais
- **Column**: Colunas de conteúdo
- **Margin**: Margens externas
- **Spacer**: Espaçadores

---

## **9. Estado Atual e Roadmap**

### **9.1 Material Web Components 1.0**

- **Status**: Lançado oficialmente
- **Framework agnostic**: Funciona com React, Vue, Svelte, etc.
- **Web Components padrão**: Baseado em especificações web

### **9.2 Limitações Atuais**

- **M3 Expressive para Web**: Ainda não disponível
- **Alguns componentes**: Em desenvolvimento (Cards, Navigation Drawer, etc.)
- **Manutenção**: Biblioteca em modo de manutenção (pendente novos mantenedores)

---

## **10. Implementação Prática - Checklist**

### **10.1 Setup Inicial**

- [ ] Instalar Material Web Components
- [ ] Configurar importação de fonts (Roboto padrão)
- [ ] Importar typescale styles
- [ ] Definir tokens de tema base

### **10.2 Tematização**

- [ ] Gerar esquema de cores no Theme Builder
- [ ] Aplicar tokens de sistema (color, typography, shape)
- [ ] Customizar tokens de componentes específicos
- [ ] Testar temas light/dark

### **10.3 Componentes**

- [ ] Verificar disponibilidade de componentes necessários
- [ ] Importar apenas componentes utilizados
- [ ] Aplicar tokens de componente quando necessário
- [ ] Testar acessibilidade

### **10.4 Build e Deploy**

- [ ] Configurar bundler (Rollup recomendado)
- [ ] Resolver bare module specifiers
- [ ] Otimizar para produção
- [ ] Validar contraste e acessibilidade

---

## **11. Recursos de Referência Rápida**

### **11.1 Links Essenciais**

- **Portal Principal**: https://m3.material.io
- **Material Web**: https://material-web.dev/
- **GitHub MWC**: https://github.com/material-components/material-web
- **Theme Builder**: https://m3.material.io/theme-builder
- **Figma Kit**: https://www.figma.com/community/file/1035203688168086460

### **11.2 Documentação Técnica**

- **Theming**: https://github.com/material-components/material-web/blob/main/docs/theming
- **Components**: https://github.com/material-components/material-web/blob/main/docs/components
- **Quick Start**: https://github.com/material-components/material-web/blob/main/docs/quick-start.md

### **11.3 Especificações**

- **Design Tokens**: https://m3.material.io/foundations/design-tokens/overview
- **Color System**: https://m3.material.io/styles/color/overview
- **Typography**: https://m3.material.io/styles/typography/overview

---

## **12. Aplicação no Projeto Atual**

### **12.1 Análise de Compatibilidade**

Com base no projeto de cronologia bíblica atual:

**✅ Compatível:**
- Sistema de temas (já implementado)
- Tokens de cor personalizados
- Componentes básicos (botões, text fields)
- Design responsivo

**🔄 Melhorias Possíveis:**
- Migração para Material Web Components
- Aplicação de tokens tipográficos
- Implementação de design tokens formais
- Melhoria da acessibilidade com tokens padrão

**❌ Limitações:**
- Cards (componente não disponível ainda)
- Navigation components específicos
- M3 Expressive features

### **12.2 Estratégia de Migração**

1. **Fase 1**: Aplicar tokens de cor e tipografia M3
2. **Fase 2**: Migrar componentes básicos para MWC
3. **Fase 3**: Implementar design tokens formais
4. **Fase 4**: Aguardar disponibilidade de componentes faltantes

---

Esta base de conhecimento foi compilada a partir da análise completa da documentação oficial do Material Design 3 e serve como guia prático para implementação em projetos web reais.
