// EXEMPLO: Como nossa implementação atual já oferece tudo que Material UI ofereceria
// Demonstração prática de componentes equivalentes

import React from 'react';
import { 
  MaterialButton, 
  MaterialCard, 
  MaterialCardHeader,
  MaterialCardContent,
  MaterialCardActions,
  CharacterCardEnhanced 
} from './components';
import { useMaterialTheme } from './utils/materialThemeProvider';

// ===== COMPARAÇÃO PRÁTICA =====

// 🎯 NOSSO SISTEMA (Atual) - Material Design 3 Puro
function ExemploNossoSistema() {
  const { theme, changeTheme } = useMaterialTheme();
  
  return (
    <div style={{
      padding: '24px',
      backgroundColor: 'var(--md-sys-color-background)',
      color: 'var(--md-sys-color-on-background)',
      minHeight: '100vh'
    }}>
      {/* Theme Switcher - Funciona automaticamente */}
      <MaterialButton 
        variant="outlined" 
        onClick={() => changeTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Tema: {theme === 'light' ? '☀️ Claro' : '🌙 Escuro'}
      </MaterialButton>

      {/* Card System - Material Design 3 */}
      <MaterialCard variant="elevated" elevation={2}>
        <MaterialCardHeader
          title="Abraão"
          subtitle="Pai da Fé • 2166-1991 AC • Viveu 175 anos"
          avatar={<div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--md-sys-color-primary)',
            color: 'var(--md-sys-color-on-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>A</div>}
        />
        
        <MaterialCardContent>
          <p>Chamado por Deus para deixar <button className="bible-reference">Gênesis 12:1</button> sua terra natal.</p>
        </MaterialCardContent>
        
        <MaterialCardActions>
          <MaterialButton variant="text">Ver Genealogia</MaterialButton>
          <MaterialButton variant="filled">Ver na Cronologia</MaterialButton>
        </MaterialCardActions>
      </MaterialCard>

      {/* Buttons - Todas as variantes MD3 */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
        <MaterialButton variant="filled">Filled</MaterialButton>
        <MaterialButton variant="outlined">Outlined</MaterialButton>
        <MaterialButton variant="text">Text</MaterialButton>
        <MaterialButton variant="elevated">Elevated</MaterialButton>
        <MaterialButton variant="tonal">Tonal</MaterialButton>
      </div>
    </div>
  );
}

// ⚠️ COMO SERIA COM MATERIAL UI (Hipotético)
/*
import { 
  Button, 
  Card, 
  CardHeader,
  CardContent,
  CardActions,
  ThemeProvider,
  createTheme
} from '@mui/material';

function ExemploMaterialUI() {
  // Precisaria configurar tema complexo
  const theme = createTheme({
    // Configuração verbosa e limitada
  });
  
  return (
    <ThemeProvider theme={theme}> // Overhead do provider
      <Card elevation={2}> // Menos customizável
        <CardHeader 
          title="Abraão"
          subheader="Pai da Fé"
          // Menos flexibilidade de layout
        />
        <CardContent>
          // Referências bíblicas não seriam automáticas
          <p>Chamado por Deus para deixar sua terra natal.</p>
        </CardContent>
        <CardActions>
          <Button variant="text">Ver Genealogia</Button>
          <Button variant="contained">Ver na Cronologia</Button>
          // Nota: "contained" não é "filled" do MD3
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}
*/

// ===== ANÁLISE DE BUNDLE SIZE =====

// 📦 NOSSO SISTEMA
// - material-design-tokens.css: ~25KB
// - Componentes: ~20KB
// - Total adicional: ~45KB

// 📦 MATERIAL UI
// - @mui/material: ~300KB
// - @emotion/react: ~50KB  
// - @emotion/styled: ~40KB
// - Total adicional: ~390KB+

// ===== ANÁLISE DE PERFORMANCE =====

// ⚡ NOSSO SISTEMA
const ourButtonStyle = {
  // CSS direto - zero processing
  backgroundColor: 'var(--md-sys-color-primary)',
  color: 'var(--md-sys-color-on-primary)',
  borderRadius: 'var(--md-sys-shape-corner-full)'
};

// 🐌 MATERIAL UI
// const MuiButton = styled(Button)`
//   background-color: ${props => props.theme.palette.primary.main};
//   color: ${props => props.theme.palette.primary.contrastText};
//   // Runtime processing necessário
// `;

// ===== VANTAGENS ESPECÍFICAS DO NOSSO SISTEMA =====

// 1. MATERIAL DESIGN 3 REAL
// - Tokens exatos das specs oficiais
// - Elevation system correto
// - Typography scales precisas
// - Color system completo

// 2. ACESSIBILIDADE NATIVA
// - prefers-reduced-motion
// - prefers-contrast: high
// - Focus management
// - Screen reader support

// 3. TEMA AUTOMÁTICO
// - Detecção de preferência do sistema
// - Persistência no localStorage
// - Transições suaves
// - Zero configuração

// 4. PERFORMANCE OTIMIZADA
// - CSS custom properties nativas
// - Zero runtime overhead
// - Menor bundle size
// - Faster rendering

// ===== QUANDO MATERIAL UI FARIA SENTIDO =====

// ❌ NÃO para nosso projeto porque:
// - Já temos os componentes necessários
// - Performance é prioridade
// - Bundle size importa
// - Queremos controle total

// ✅ SIM apenas se:
// - Projeto com 50+ componentes diferentes
// - Equipe sem tempo para implementar
// - Deadline extremamente apertado
// - Componentes muito complexos (DataGrid, etc.)

export default ExemploNossoSistema;
