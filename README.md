# Gênesis Interativo - Cronologia Bíblica

Uma aplicação interativa para explorar visualmente as narrativas e cronologia do livro de Gênesis, com design moderno baseado no Material Design 3.

## ✨ Características

- **Design Material 3**: Interface moderna seguindo as diretrizes do Material Design 3
- **Temas Claro/Escuro**: Sistema de temas simplificado com apenas duas opções
- **Acessibilidade**: Controle de tamanho de fonte e design acessível
- **Versículos Bíblicos**: Clique em referências bíblicas para visualizar versículos
- **Timeline Interativa**: Visualização cronológica dos eventos de Gênesis
- **Personagens e Eventos**: Cards detalhados com informações completas

## 🚀 Executar Localmente

**Pré-requisitos:** Node.js 18+

1. Instalar dependências:
   ```bash
   npm install
   ```

2. Executar em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Construir para produção:
   ```bash
   npm run build
   ```

## 🎨 Tecnologias

- **React 19** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Material Design 3** para componentes visuais
- **Heroicons** para ícones
- **Bible API** para integração com versículos

## 📖 API da Bíblia

A aplicação integra com múltiplas APIs da Bíblia para fornecer acesso aos versículos:

### APIs Suportadas

1. **bible-api.com** (Gratuita) - Padrão
   - Acesso livre sem necessidade de chave API
   - Suporte a múltiplas traduções
   - Funciona automaticamente

2. **API.Bible** (Premium) - Opcional
   - Requer chave API (obtenha em https://api.bible)
   - Mais traduções e recursos avançados
   - Fallback automático para a API gratuita

### Recursos

- **Normalização Automática**: Converte referências em português para inglês
- **Múltiplas Traduções**: Suporte a KJV, ESV, Almeida, NVI
- **Sistema de Fallback**: Tenta múltiplas APIs para máxima confiabilidade
- **Cache Inteligente**: Otimização de performance
- **Referências Clicáveis**: Links interativos em todas as referências bíblicas

### Uso

```javascript
const { verse, loading, error, fetchVerse } = useBibleApi();

// Buscar versículo (português ou inglês)
await fetchVerse('João 3:16');
await fetchVerse('Gênesis 1:1');

// Com chave API premium (opcional)
await fetchVerse('João 3:16', 'sua-chave-api');
```

## 📖 Documentação

Consulte [STACK_DOCUMENTATION.md](STACK_DOCUMENTATION.md) para documentação técnica completa.
