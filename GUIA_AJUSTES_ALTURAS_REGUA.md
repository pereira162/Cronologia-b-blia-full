# GUIA DE AJUSTES MANUAIS - ALTURAS DA RÉGUA CRONOLÓGICA

## 📍 LOCALIZAÇÃO DOS AJUSTES
**Arquivo**: `components/TimelineView.tsx`  
**Linhas aproximadas**: 840-900

## 🏗️ ESTRUTURA DAS ZONAS DA RÉGUA

A régua cronológica está dividida em **3 zonas verticais** com diferentes alturas:

### **ZONA 1: Anos Principais e Menores** (Base da régua)
```tsx
{/* ZONA 1: Anos principais (500/1000) e menores (100) com linhas verticais */}
{yearMarkers.map(marker => (
  <div style={{ 
    position: 'absolute', 
    left: `${marker.x}px`, 
    bottom: marker.isMajor ? '0px' : '8px'  // ← AJUSTE AQUI
  }}>
```
- **Anos principais**: `bottom: '0px'` (na base)
- **Anos menores**: `bottom: '8px'` (8px acima da base)

### **ZONA 2: Eventos** (Meio da régua)
```tsx
{/* ZONA 2: Eventos - 50px acima da base (ajustado 10px para baixo para teste) */}
{events.map(event => (
  <div style={{ 
    position: 'absolute', 
    left: `${eventX}px`, 
    bottom: '50px'  // ← AJUSTE AQUI (era 55px, agora 50px)
  }}>
```
- **Eventos**: `bottom: '50px'` (50px acima da base)
- **Valor anterior**: 55px
- **Alteração atual**: -5px (para teste)

### **ZONA 3: Nascimento e Morte** (Topo da régua)
```tsx
{/* ZONA 3: Nascimento e Morte - 75px acima da base */}
// Nascimento
<div style={{ 
  position: 'absolute', 
  left: `${birthX}px`, 
  bottom: '75px'  // ← AJUSTE AQUI
}}>

// Morte  
<div style={{ 
  position: 'absolute', 
  left: `${deathX}px`, 
  bottom: '75px'  // ← AJUSTE AQUI
}}>
```
- **Nascimento/Morte**: `bottom: '75px'` (75px acima da base)

## 🎛️ COMO FAZER AJUSTES MANUAIS

### **1. Para Ajustar Eventos (ZONA 2)**
**Localize a linha:**
```tsx
bottom: '50px'
```
**Substitua por:**
- `bottom: '40px'` - Move 5px para baixo
- `bottom: '50px'` - Move 5px para cima  
- `bottom: '35px'` - Move 10px para baixo
- `bottom: '60px'` - Move 15px para cima

### **2. Para Ajustar Nascimento/Morte (ZONA 3)**
**Localize as duas linhas:**
```tsx
bottom: '75px'
```
**Substitua por:**
- `bottom: '70px'` - Move 5px para baixo
- `bottom: '80px'` - Move 5px para cima
- `bottom: '65px'` - Move 10px para baixo
- `bottom: '85px'` - Move 10px para cima

### **3. Para Ajustar Anos Menores (ZONA 1)**
**Localize a linha:**
```tsx
bottom: marker.isMajor ? '0px' : '8px'
```
**Substitua por:**
```tsx
bottom: marker.isMajor ? '0px' : '12px'  // Anos menores mais altos
bottom: marker.isMajor ? '0px' : '4px'   // Anos menores mais baixos
```

## 📏 VALORES RECOMENDADOS PARA TESTES

### **Configuração Atual** (após seu teste)
- ZONA 1: Anos principais `0px`, Anos menores `8px`
- ZONA 2: Eventos `50px` ✅ **TESTE ATUAL**
- ZONA 3: Nascimento/Morte `75px`

### **Outras Configurações para Testar**
#### **Configuração Compacta**
- ZONA 1: `0px` / `6px`
- ZONA 2: `35px`
- ZONA 3: `60px`

#### **Configuração Espaçada**
- ZONA 1: `0px` / `10px`  
- ZONA 2: `50px`
- ZONA 3: `85px`

#### **Configuração Equilibrada**
- ZONA 1: `0px` / `8px`
- ZONA 2: `40px`
- ZONA 3: `70px`

## ⚡ TESTE RÁPIDO

1. **Abra**: `components/TimelineView.tsx`
2. **Busque por**: `ZONA 2: Eventos`
3. **Modifique**: `bottom: '50px'` para o valor desejado
4. **Salve** o arquivo
5. **Recarregue** o preview no navegador

## 🔧 FERRAMENTAS PARA AJUSTES

### **Para Build e Teste**
```bash
npm run build && npm run preview
```

### **Para Recarregar Apenas**
- Salve o arquivo
- Pressione `Ctrl+R` no navegador

## 📋 CHECKLIST DE TESTE

- [ ] Eventos não sobrepõem anos
- [ ] Nascimento/morte não sobrepõem eventos  
- [ ] Espaçamento visualmente equilibrado
- [ ] Textos legíveis em todas as zonas
- [ ] Não há sobreposição entre diferentes elementos

---

**Teste atual implementado**: ZONA 2 movida de 55px para 50px (-5px)  
**Status**: ✅ Pronto para teste visual
