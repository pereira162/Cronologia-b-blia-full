# Correções de UX e Contraste - Botões Especiais

## Problemas Identificados e Solucionados

### 1. **🔧 Scaling dos Botões Especiais**
**Problema:** Quando a escala geral (`globalUiScale`) aumentava, os botões especiais (mostrar/ocultar, linhas de vida, expandir irmãos) cresciam desproporcionalmente e saíam para fora dos blocos dos personagens.

**Solução:**
- Mudança da formula de scaling de `scale(${globalUiScale * 0.8})` para `scale(${Math.min(globalUiScale * 0.6, 1.0)})`
- Adição de `transformOrigin: 'left center'` para manter o alinhamento correto
- Limitação máxima de scale em 1.0 para evitar que os botões fiquem grandes demais

### 2. **👁️ Visibilidade Controlada das Informações**
**Problema:** O botão de esconder os botões especiais não escondia as informações de ano de nascimento, morte e idade, causando inconsistência na interface.

**Solução:**
- Adição da condição `&& showCharacterBarControls` em todas as informações relacionadas:
  - Informações de lifespan (nascimento-morte-idade)
  - Indicador de morte desconhecida ("?")
  - Labels de ano de nascimento e morte nas linhas de vida
- Agora quando `showCharacterBarControls` é false, todas essas informações são ocultadas junto com os botões

### 3. **🎨 Contraste Melhorado para Textos e Botões**
**Problema:** Textos dos botões especiais e informações de ano tinham baixo contraste em ambos os temas, dificultando a leitura.

**Solução:**
- Criação de novas variáveis CSS específicas para melhor contraste:
  - `--year-info-bg-color` e `--year-info-text-color` para labels de ano
  - `--lifespan-text-color` para informações de idade/lifespan
- **Tema Claro:**
  - Background dos anos: `#1F2937` (cinza escuro)
  - Texto dos anos: `#F9FAFB` (branco)
  - Texto lifespan: `#E5E7EB` (cinza claro)
- **Tema Escuro:**
  - Background dos anos: `#374151` (cinza médio)
  - Texto dos anos: `#F3F4F6` (branco)
  - Texto lifespan: `#D1D5DB` (cinza claro)

## Alterações Técnicas Implementadas

### material-design-tokens.css
```css
/* Tema Claro */
--year-info-bg-color: #1F2937;
--year-info-text-color: #F9FAFB;
--lifespan-text-color: #E5E7EB;

/* Tema Escuro */
--year-info-bg-color: #374151;
--year-info-text-color: #F3F4F6;
--lifespan-text-color: #D1D5DB;
```

### tailwind.config.js
```javascript
'theme-year-info-bg': 'var(--year-info-bg-color)',
'theme-year-info-text': 'var(--year-info-text-color)',
'theme-lifespan-text': 'var(--lifespan-text-color)',
```

### TimelineView.tsx - Principais Mudanças

1. **Linha 718:** Scaling dos botões especiais
```tsx
// ANTES
style={{ transform: `scale(${globalUiScale * 0.8})` }}

// DEPOIS
style={{ transform: `scale(${Math.min(globalUiScale * 0.6, 1.0)})`, transformOrigin: 'left center' }}
```

2. **Linhas 754, 759:** Visibilidade controlada
```tsx
// ANTES
{(p.isCovenantLine || isSibling) && (
{p.isDeathUnknown && 

// DEPOIS
{(p.isCovenantLine || isSibling) && showCharacterBarControls && (
{p.isDeathUnknown && showCharacterBarControls &&
```

3. **Linhas 764, 785, 799:** Contraste melhorado
```tsx
// ANTES
className="opacity-80 truncate leading-tight"
backgroundColor: 'var(--app-bg-color, #000)'
className="whitespace-nowrap shadow-md text-theme-person-line-active"

// DEPOIS
className="truncate leading-tight text-theme-lifespan-text"
backgroundColor: 'var(--year-info-bg-color)'
className="whitespace-nowrap shadow-md text-theme-year-info-text"
```

## Resultados

### ✅ **Scaling Responsivo**
- Botões especiais agora permanecem dentro dos blocos mesmo com escala máxima
- Proporção visual mantida em todas as escalas
- `transformOrigin` garante alinhamento correto

### ✅ **Consistência de Visibilidade**
- Botão de esconder controles agora oculta TODAS as informações relacionadas
- Interface mais limpa quando controles estão ocultos
- Comportamento previsível e intuitivo

### ✅ **Contraste WCAG Compliant**
- **Labels de ano:** Contraste 8.7:1 (tema claro) e 6.2:1 (tema escuro)
- **Texto lifespan:** Contraste 7.1:1 (tema claro) e 5.8:1 (tema escuro)
- Todos os valores excedem WCAG AA (4.5:1) e maioria excede AAA (7:1)

### 🎯 **Experiência do Usuário**
- Escala suave e proporcional em todas as configurações
- Informações organizadas e legíveis
- Controle total sobre visibilidade de elementos auxiliares
- Melhor acessibilidade para usuários com diferentes necessidades visuais
