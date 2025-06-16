# Material Design 3 Implementation Guide

## Visão Geral
Esta documentação descreve como usar a implementação de Material Design 3 no projeto, incluindo os novos componentes, sistema de tokens e provider de temas.

## Componentes Disponíveis

### MaterialButton
Botão que segue as especificações do Material Design 3 com suporte a variantes, tamanhos e estados.

```typescript
import { MaterialButton } from './components/MaterialButton-enhanced';

// Uso básico
<MaterialButton variant="filled" onClick={handleClick}>
  Botão Preenchido
</MaterialButton>

// Com ícone
<MaterialButton 
  variant="outlined" 
  icon={<SomeIcon />}
  iconPosition="start"
>
  Botão com Ícone
</MaterialButton>

// Variantes disponíveis
<MaterialButton variant="filled">Preenchido</MaterialButton>
<MaterialButton variant="outlined">Contornado</MaterialButton>
<MaterialButton variant="text">Texto</MaterialButton>
<MaterialButton variant="elevated">Elevado</MaterialButton>
<MaterialButton variant="tonal">Tonal</MaterialButton>
```

### MaterialCard
Componente de cartão modular seguindo Material Design 3.

```typescript
import { 
  MaterialCard, 
  MaterialCardHeader, 
  MaterialCardContent, 
  MaterialCardActions 
} from './components/MaterialCard';

<MaterialCard variant="elevated" elevation={2}>
  <MaterialCardHeader
    title="Título do Card"
    subtitle="Subtítulo opcional"
    avatar={<Avatar />}
    action={<IconButton />}
  />
  
  <MaterialCardContent>
    <p>Conteúdo do card aqui...</p>
  </MaterialCardContent>
  
  <MaterialCardActions align="right">
    <MaterialButton variant="text">Cancelar</MaterialButton>
    <MaterialButton variant="filled">Confirmar</MaterialButton>
  </MaterialCardActions>
</MaterialCard>
```

### Material Theme Provider
Sistema de gerenciamento de temas com suporte a preferências do sistema.

```typescript
import { useMaterialTheme } from './utils/materialThemeProvider';

function ThemeSwitcher() {
  const { theme, changeTheme, availableThemes } = useMaterialTheme();
  
  return (
    <select 
      value={theme} 
      onChange={(e) => changeTheme(e.target.value as MaterialTheme)}
    >
      {availableThemes.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

// Hook para acessar cores atuais
function CustomComponent() {
  const { getColorValue } = useMaterialTheme();
  
  const primaryColor = getColorValue('--md-sys-color-primary');
  
  return (
    <div style={{ color: primaryColor }}>
      Texto na cor primária
    </div>
  );
}
```

## Sistema de Tokens CSS

### Como Usar os Tokens
Os tokens estão disponíveis como CSS custom properties e podem ser usados diretamente:

```css
.meu-componente {
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--md-sys-shape-corner-medium);
  font: var(--md-sys-typescale-body-large);
  box-shadow: var(--md-sys-elevation-level2);
}
```

### Tokens Disponíveis

#### **Cores do Sistema**
```css
/* Cores Primárias */
--md-sys-color-primary
--md-sys-color-on-primary
--md-sys-color-primary-container
--md-sys-color-on-primary-container

/* Cores Secundárias */
--md-sys-color-secondary
--md-sys-color-on-secondary
--md-sys-color-secondary-container
--md-sys-color-on-secondary-container

/* Cores de Superfície */
--md-sys-color-surface
--md-sys-color-on-surface
--md-sys-color-surface-variant
--md-sys-color-surface-container
--md-sys-color-surface-container-high
--md-sys-color-surface-container-highest

/* Background */
--md-sys-color-background
--md-sys-color-on-background

/* Outros */
--md-sys-color-error
--md-sys-color-outline
--md-sys-color-shadow
```

#### **Tipografia**
```css
/* Escalas Tipográficas */
--md-sys-typescale-display-large
--md-sys-typescale-headline-large
--md-sys-typescale-title-large
--md-sys-typescale-body-large
--md-sys-typescale-label-large

/* Fontes de Referência */
--md-ref-typeface-brand
--md-ref-typeface-plain
```

#### **Formas**
```css
--md-sys-shape-corner-none: 0px
--md-sys-shape-corner-extra-small: 4px
--md-sys-shape-corner-small: 8px
--md-sys-shape-corner-medium: 12px
--md-sys-shape-corner-large: 16px
--md-sys-shape-corner-extra-large: 28px
--md-sys-shape-corner-full: 50%
```

#### **Elevação**
```css
--md-sys-elevation-level0: none
--md-sys-elevation-level1: /* shadow level 1 */
--md-sys-elevation-level2: /* shadow level 2 */
--md-sys-elevation-level3: /* shadow level 3 */
--md-sys-elevation-level4: /* shadow level 4 */
--md-sys-elevation-level5: /* shadow level 5 */
```

## Temas Light/Dark

### Aplicação Automática
O sistema aplica automaticamente o tema baseado em:
1. Preferência salva pelo usuário
2. Preferência do sistema (`prefers-color-scheme`)
3. Tema light como fallback

```typescript
// O tema é aplicado através de data attributes
// :root[data-theme="light"] { /* cores light */ }
// :root[data-theme="dark"] { /* cores dark */ }
```

### Definindo Cores Customizadas
```typescript
import { MaterialThemeProvider } from './utils/materialThemeProvider';

const themeProvider = MaterialThemeProvider.getInstance();

// Definir cor customizada
themeProvider.setCustomColorToken('--my-custom-color', '#FF5722');

// Remover cor customizada
themeProvider.removeCustomColorToken('--my-custom-color');
```

## Componentes Específicos do Projeto

### CharacterCard Enhanced
Versão melhorada do CharacterCard usando Material Design 3:

```typescript
import { CharacterCardEnhanced } from './components/CharacterCard-enhanced';

<CharacterCardEnhanced
  character={personData}
  fontSize={1.2}
  onBibleReferenceClick={(ref) => {
    // Lidar com clique em referência bíblica
    console.log('Referência clicada:', ref);
  }}
/>
```

### Funcionalidades:
- **Avatar automático** com primeira letra do nome
- **Referências bíblicas clicáveis** com formatação automática
- **Indicador de linhagem** para personagens da aliança
- **Ações contextuais** (Ver Genealogia, Ver na Cronologia)
- **Responsividade** completa

## Acessibilidade

### Recursos Implementados
1. **Suporte a `prefers-reduced-motion`**
2. **Suporte a `prefers-contrast: high`**
3. **Focus visible** com outline consistente
4. **Navegação por teclado** em componentes interativos
5. **Semântica HTML** apropriada
6. **ARIA labels** onde necessário

### Uso com Screen Readers
```typescript
<MaterialButton 
  ariaLabel="Salvar documento atual"
  onClick={handleSave}
>
  Salvar
</MaterialButton>
```

## Classes Utilitárias

### Elevação
```css
.md-elevation-1 { box-shadow: var(--md-sys-elevation-level1); }
.md-elevation-2 { box-shadow: var(--md-sys-elevation-level2); }
/* ... até level 5 */
```

### Cores
```css
.md-surface { 
  background-color: var(--md-sys-color-surface); 
  color: var(--md-sys-color-on-surface); 
}
.md-primary { 
  background-color: var(--md-sys-color-primary); 
  color: var(--md-sys-color-on-primary); 
}
```

### Tipografia
```css
.md-typography-display-large { font: var(--md-sys-typescale-display-large); }
.md-typography-headline-medium { font: var(--md-sys-typescale-headline-medium); }
.md-typography-body-large { font: var(--md-sys-typescale-body-large); }
```

## Migração de Componentes Existentes

### Passo 1: Substituir cores hardcoded
```css
/* Antes */
.my-component {
  background-color: #1976D2;
  color: #FFFFFF;
}

/* Depois */
.my-component {
  background-color: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
}
```

### Passo 2: Usar tokens de forma
```css
/* Antes */
.my-component {
  border-radius: 8px;
}

/* Depois */
.my-component {
  border-radius: var(--md-sys-shape-corner-small);
}
```

### Passo 3: Aplicar tipografia consistente
```css
/* Antes */
.my-component {
  font-size: 16px;
  font-weight: 500;
}

/* Depois */
.my-component {
  font: var(--md-sys-typescale-body-large);
}
```

## Validação e Testes

### Verificar Contraste
```typescript
// Usar as ferramentas de dev do navegador para verificar contraste
// Os tokens já seguem as diretrizes WCAG AA
```

### Testar Temas
```typescript
// Alternar temas programaticamente para testes
const { changeTheme } = useMaterialTheme();

// Testar light
changeTheme('light');

// Testar dark  
changeTheme('dark');

// Testar preferência do sistema
changeTheme('auto');
```

### Responsividade
```css
/* Os tokens já incluem breakpoints responsivos */
@media (max-width: 768px) {
  :root {
    --md-sys-typescale-display-large: 400 2.5rem var(--md-ref-typeface-brand);
  }
}
```

## Considerações de Performance

1. **CSS Custom Properties** são nativas e performáticas
2. **Lazy loading** dos estilos por componente
3. **Não há runtime overhead** para o sistema de tokens
4. **Temas são aplicados via CSS**, sem re-renders em React

## Roadmap Futuro

- [ ] Implementar Material Motion (animações)
- [ ] Adicionar mais variantes de componentes
- [ ] Suporte a temas customizados pelo usuário
- [ ] Integração com Material Symbols (ícones)
- [ ] Componentes de formulário (TextField, Select, etc.)

## Recursos Externos

- [Material Design 3](https://m3.material.io/)
- [Material Web Components](https://github.com/material-components/material-web)
- [Material UI](https://mui.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

*Este sistema foi implementado seguindo as melhores práticas identificadas através do estudo da documentação oficial do Google Material Design usando MCP Context7.*
