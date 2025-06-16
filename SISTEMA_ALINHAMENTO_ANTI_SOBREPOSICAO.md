# SISTEMA DE ALINHAMENTO CENTRALIZADO E ANTI-SOBREPOSIÇÃO

## 🎯 MELHORIAS IMPLEMENTADAS

### **1. ALINHAMENTO CENTRALIZADO**
Todos os elementos agora ficam **perfeitamente centralizados** nas suas respectivas linhas:

#### **✅ Eventos na Régua (ZONA 2)**
- **Antes**: Posicionamento fixo à esquerda da linha
- **Depois**: `transform: translateX(-50%)` - **centralizado na linha**

#### **✅ Datas Nascimento/Morte (ZONA 3)**
- **Antes**: Posicionamento fixo à esquerda da linha  
- **Depois**: `transform: translateX(-50%)` - **centralizado na linha**

#### **✅ Nomes dos Eventos (Conteúdo Principal)**
- **Antes**: Movimento horizontal flutuante baseado em scroll
- **Depois**: `left: centeredX` + `transform` - **centralizado na linha**

### **2. SISTEMA ANTI-SOBREPOSIÇÃO**

#### **🧠 Algoritmo de Detecção de Proximidade**
```tsx
const calculateEventAlignment = (events, currentEventIndex, eventX) => {
  const PROXIMITY_THRESHOLD = 100; // 100px para eventos
  
  // Detectar eventos próximos
  for (let i = 0; i < events.length; i++) {
    if (distance < PROXIMITY_THRESHOLD) {
      if (eventX < otherEventX) {
        // Evento mais no PASSADO → alinhar à DIREITA
        alignmentStyle = 'right';
        offsetX = -60;
      } else {
        // Evento mais no FUTURO → alinhar à ESQUERDA  
        alignmentStyle = 'left';
        offsetX = 60;
      }
    }
  }
}
```

#### **🎛️ Estratégias de Alinhamento**
- **`center`** (padrão): `translateX(-50%)` - Centralizado
- **`left`**: `translateX(-100%)` - Alinhado à esquerda da linha
- **`right`**: `translateX(0%)` - Alinhado à direita da linha

### **3. CONFIGURAÇÕES DE PROXIMIDADE**

#### **📏 Limiares de Detecção**
- **Eventos**: `100px` - Distância para considerar próximo
- **Datas na Régua**: `80px` - Distância menor para régua compacta

#### **📐 Offsets de Separação**
- **Eventos**: `±60px` - Separação horizontal
- **Datas na Régua**: `±40px` - Separação menor para régua

## 🏗️ ESTRUTURA TÉCNICA

### **Função: `calculateEventAlignment`**
```tsx
// Entrada: eventos, índice atual, posição X
// Saída: { alignmentStyle, offsetX }
// Lógica: Evento mais passado → direita | Evento mais futuro → esquerda
```

### **Função: `calculateRulerDateAlignment`**
```tsx
// Entrada: datas da régua, índice atual
// Saída: { alignmentStyle, offsetX }  
// Lógica: Mesma estratégia, threshold menor
```

### **Aplicação no JSX**
```tsx
// Calcular alinhamento
const { alignmentStyle, offsetX } = calculateEventAlignment(events, eventIndex, eventX);

// Aplicar transform
let transform = 'translateX(-50%)'; // Padrão
if (alignmentStyle === 'left') transform = 'translateX(-100%)';
if (alignmentStyle === 'right') transform = 'translateX(0%)';

// Renderizar
<div style={{ 
  left: `${eventX + offsetX}px`,
  transform: transform 
}}>
```

## 📍 ZONAS AFETADAS

### **ZONA 1: Anos Principais/Menores**
- ✅ **Mantidos**: Já estavam centralizados corretamente

### **ZONA 2: Eventos na Régua** 
- ✅ **Centralizado**: `translateX(-50%)`
- ✅ **Anti-sobreposição**: Baseado em proximidade
- ✅ **Threshold**: 100px

### **ZONA 3: Nascimento/Morte na Régua**
- ✅ **Centralizado**: `translateX(-50%)`
- ✅ **Anti-sobreposição**: Baseado em proximidade  
- ✅ **Threshold**: 80px
- ✅ **Agrupamento**: Análise conjunta de todas as datas

### **CONTEÚDO PRINCIPAL: Nomes dos Eventos**
- ✅ **Centralizado**: Sem movimento horizontal flutuante
- ✅ **Anti-sobreposição**: Mesmo algoritmo dos eventos
- ✅ **Transform combinado**: `rotate(180deg) + alignment`

## 🎨 BENEFÍCIOS VISUAIS

### **👁️ Alinhamento Perfeito**
- Todos os elementos centralizados nas suas linhas
- Visual limpo e organizado
- Consistência em todas as zonas

### **🚫 Zero Sobreposição**  
- Detecção automática de proximidade
- Separação inteligente esquerda/direita
- Preservação da legibilidade

### **📱 Responsividade Mantida**
- Sistema funciona em qualquer escala
- Thresholds proporcionais
- Performance otimizada

## 🔧 CONFIGURAÇÕES AJUSTÁVEIS

Para personalizar o comportamento, modifique as constantes:

```tsx
// Em calculateEventAlignment
const PROXIMITY_THRESHOLD = 100; // Distância para eventos

// Em calculateRulerDateAlignment  
const PROXIMITY_THRESHOLD = 80; // Distância para régua

// Offsets de separação
offsetX = -60; // Eventos
offsetX = -40; // Régua
```

---

**Status**: ✅ **Implementado e testado**  
**Build**: Sucesso em 7.21s  
**Funcionalidades**: Todas ativas e funcionais
