# 📋 STACK TECNOLÓGICA COMPLETA DO PROJETO

## 🎯 **INFORMAÇÕES GERAIS**
- **Nome do Projeto**: Gênesis Interativo - Cronologia Bíblica
- **Tipo**: Single Page Application (SPA) 
- **Arquitetura**: Frontend React com TypeScript
- **Deploy**: GitHub Pages
- **Idioma**: Português Brasileiro (pt-BR)

---

## 🚀 **RUNTIME & BUILD TOOLS**

### **Node.js & Package Manager**
- **Node.js**: >= 18.x (inferido pelas versões das dependências)
- **Package Manager**: npm (package-lock.json presente)
- **Tipo de módulo**: ESM (ES Modules) - `"type": "module"`

### **Build & Development Server**
- **Vite**: `^6.2.0` (bundler de nova geração)
- **@vitejs/plugin-react**: `^4.5.2` (plugin React para Vite)
- **Target Build**: `esnext` (ES mais recente)
- **Minificador**: `esbuild`
- **Sourcemaps**: Habilitados em desenvolvimento

---

## ⚛️ **FRONTEND FRAMEWORK & LIBRARIES**

### **React Ecosystem**
- **React**: `^19.1.0` (versão mais recente)
- **React DOM**: `^19.1.0`
- **JSX Runtime**: `react-jsx` (novo runtime do React 19)

### **TypeScript**
- **TypeScript**: `~5.7.2` (versão mais recente)
- **Target**: `ES2020`
- **Module**: `ESNext`
- **Strict Mode**: Habilitado
- **Decorators**: Experimentais habilitados

---

## 🎨 **STYLING & UI**

### **CSS Framework**
- **Tailwind CSS**: `^3.4.0` (framework CSS utility-first)
- **PostCSS**: `^4.1.7` (processador CSS)
- **Autoprefixer**: `^10.4.21` (prefixos CSS automáticos)

### **Design System**
- **Material Design 3**: Implementação customizada
- **Google Fonts**: Inter (fonte principal)
- **CSS Variables**: Sistema de temas dinâmicos
- **Dark Mode**: Implementado com variantes customizadas

### **Ícones**
- **Heroicons React**: `^2.1.0` (biblioteca de ícones SVG)
- **Formato**: Outline e Solid (24x24px)

---

## 🏗️ **ARQUITETURA & ESTRUTURA**

### **Padrões Arquiteturais**
- **Component-Based**: Arquitetura baseada em componentes React
- **Custom Hooks**: Hooks customizados para lógica reutilizável
- **Modular Design**: Separação clara de responsabilidades
- **CSS-in-JS**: Estilos via Tailwind + CSS Variables

### **Estrutura de Pastas**
```
📁 components/       # Componentes React reutilizáveis
📁 hooks/           # Custom hooks para lógica
📁 utils/           # Utilitários e helpers
📄 types.ts         # Definições TypeScript
📄 data.ts          # Dados da aplicação
📄 themes.ts        # Sistema de temas
📄 stylingConstants.ts # Constantes de estilo
```

---

## 🔧 **CUSTOM HOOKS & UTILITIES**

### **Hooks Customizados**
- **useFontSize**: Gerenciamento de tamanho de fonte dinâmico
- **useLocalStorage**: Persistência no localStorage
- **useOnClickOutside**: Detecção de clique externo
- **useBibleApi**: Integração com APIs bíblicas

### **Utilitários**
- **materialThemeProvider**: Provedor de temas Material Design 3
- **Anti-sobreposição**: Sistema para evitar sobreposição de elementos
- **Sincronização de scroll**: Scroll sincronizado entre containers

---

## 📱 **FEATURES & FUNCIONALIDADES**

### **Interface do Usuário**
- **Responsivo**: Design adaptável para mobile/desktop
- **Temas**: Claro/Escuro com Material Design 3
- **Acessibilidade**: WCAG AAA compliance
- **Fonte Dinâmica**: 5 escalas de fonte ajustáveis
- **Animações**: Transições suaves com CSS

### **Componentes Principais**
- **TimelineView**: Visualização principal da linha do tempo
- **MaterialButton**: Botões seguindo Material Design 3
- **FontSizeControl**: Controle de tamanho de fonte
- **BibleVerseModal**: Modal para versículos bíblicos
- **CharacterCard/EventCard**: Cards para personagens e eventos

### **Funcionalidades Específicas**
- **Régua Cronológica**: 3 zonas verticais (anos, eventos, nascimento/morte)
- **Sistema Anti-sobreposição**: Alinhamento inteligente de datas
- **Linhas de Vida**: Visualização de nascimento/morte de personagens
- **Scroll Sincronizado**: Régua e conteúdo em sincronia
- **Zoom Horizontal/Vertical**: Escalabilidade da timeline

---

## 🌐 **DEPLOYMENT & CI/CD**

### **Hospedagem**
- **Plataforma**: GitHub Pages
- **URL Base**: `/Cronologia-b-blia-full/`
- **Build**: Automático via GitHub Actions (inferido)

### **Configurações de Deploy**
- **Homepage**: `https://pereira162.github.io/Cronologia-b-blia-full/`
- **Assets**: Otimizados com code splitting
- **Chunks**: react, react-dom, heroicons separados

---

## 🔧 **CONFIGURATION FILES**

### **Build Configuration**
- **vite.config.ts**: Configuração principal do Vite 6
- **tsconfig.json**: Configuração TypeScript 5.7
- **tailwind.config.js**: Configuração Tailwind CSS 3.4
- **postcss.config.js**: Processamento CSS

### **Environment**
- **vite-env.d.ts**: Tipos para Vite
- **.env.local**: Variáveis de ambiente (API keys)
- **package.json**: Dependências e scripts

---

## 📊 **PERFORMANCE & OPTIMIZATION**

### **Build Optimizations**
- **Code Splitting**: Chunks manuais por biblioteca
- **Tree Shaking**: Remoção de código não utilizado
- **Minification**: esbuild para minificação rápida
- **ES Modules**: Formato moderno para melhor performance

### **Runtime Optimizations**
- **useMemo/useCallback**: Otimizações de re-renderização
- **Lazy Loading**: Carregamento sob demanda
- **CSS Variables**: Troca de temas sem re-renderização
- **Debounced Events**: Eventos otimizados

---

## 🎯 **VERSÕES ESPECÍFICAS UTILIZADAS**

### **Core Dependencies**
```json
{
  "@heroicons/react": "^2.1.0",
  "react": "^19.1.0", 
  "react-dom": "^19.1.0"
}
```

### **Development Dependencies**
```json
{
  "@tailwindcss/postcss": "^4.1.7",
  "@types/node": "^22.14.0",
  "@types/react": "^19.1.8", 
  "@types/react-dom": "^19.1.6",
  "@vitejs/plugin-react": "^4.5.2",
  "autoprefixer": "^10.4.21",
  "tailwindcss": "^3.4.0",
  "typescript": "~5.7.2",
  "vite": "^6.2.0"
}
```

---

## 🏷️ **TAGS TECNOLÓGICAS**

`React 19` `TypeScript 5.7` `Vite 6` `Tailwind CSS 3.4` `Material Design 3` `ESM` `GitHub Pages` `Heroicons` `Custom Hooks` `CSS Variables` `Responsive Design` `Dark Mode` `Accessibility` `Performance Optimized` `Modern Frontend`

---

*Esta documentação reflete o estado atual do projeto e deve ser atualizada conforme novas tecnologias sejam adicionadas.*
