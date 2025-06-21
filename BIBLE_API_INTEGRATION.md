# 📖 Integração com a API da Bíblia Digital

## ✨ Nova Implementação

O projeto foi completamente atualizado para usar a **API da Bíblia Digital** (https://www.abibliadigital.com.br/), que oferece:

### 🎯 Vantagens da Nova API

- ✅ **Versões em Português**: NVI, RA, ACF e outras
- ✅ **Requisições Ilimitadas**: Com token de usuário gratuito
- ✅ **API Brasileira**: Mantida e focada no público brasileiro
- ✅ **Documentação Completa**: Endpoints bem documentados
- ✅ **Múltiplas Funcionalidades**: Busca por palavras, versículos aleatórios

### 🔧 Componentes Implementados

#### 1. **Configuração da API** (`config/bibleConfig.ts`)
- Configurações base da API
- Mapeamento de livros bíblicos
- Headers de autenticação
- Versões disponíveis

#### 2. **Serviço da API** (`services/bibleService.ts`)
- Classe `BibleDigitalService` completa
- Métodos para todos os endpoints
- Tratamento de erros
- Parsing de referências bíblicas

#### 3. **Hook React** (`hooks/useBibleDigitalApi.ts`)
- Hook moderno para integração
- Estado unificado para versículos/capítulos
- Suporte a busca e versículos aleatórios
- Criação automática de usuário

#### 4. **Componente Modal Atualizado** (`components/BibleVerseModal.tsx`)
- Interface atualizada para nova API
- Suporte a múltiplos tipos de conteúdo
- Melhor experiência do usuário

#### 5. **Monitor de Console** (`components/ConsoleMonitor.tsx`)
- Captura automática de erros
- Interface visual para debugging
- Contador de erros em tempo real
- Filtros por tipo de mensagem

## 🚀 Como Usar

### 1. **Criar Usuário na API**

O projeto inclui um botão "Testar API Bíblia" no header de controles que:

1. Cria automaticamente um usuário com as credenciais configuradas
2. Retorna um token para requisições ilimitadas
3. Salva o token temporariamente no localStorage
4. Exibe o token no console para configuração permanente

### 2. **Configurar Token Permanente**

Após criar o usuário, adicione o token às variáveis de ambiente:

```env
REACT_APP_BIBLE_API_TOKEN=seu_token_aqui
```

### 3. **Usar o Hook**

```typescript
import { useBibleDigitalApi } from './hooks/useBibleDigitalApi';

const MyComponent = () => {
  const { 
    content, 
    loading, 
    error, 
    fetchVerse, 
    searchVerses 
  } = useBibleDigitalApi();

  // Buscar versículo
  const handleSearch = () => {
    fetchVerse('João 3:16', 'nvi');
  };

  return (
    <div>
      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      {content && <p>{content.verse?.text}</p>}
    </div>
  );
};
```

## 🐛 Depuração e Monitoramento

### Console Monitor

O novo componente `ConsoleMonitor` oferece:

- **Captura Automática**: Intercepta `console.error`, `console.warn`, etc.
- **Interface Visual**: Painel flutuante para visualizar mensagens
- **Contador em Tempo Real**: Badge com número de erros/avisos
- **Filtros**: Por tipo de mensagem (error, warn, info, log)
- **Stack Traces**: Para erros JavaScript
- **Limpeza**: Botão para limpar mensagens

### Como Ativar

1. Clique no ícone de aviso no canto inferior direito
2. O monitor se abre automaticamente quando há erros
3. Use os filtros para ver tipos específicos de mensagem

## 📚 Endpoints Disponíveis

### Versículos e Capítulos
- `GET /verses/{version}/{book}/{chapter}` - Capítulo completo
- `GET /verses/{version}/{book}/{chapter}/{verse}` - Versículo específico
- `GET /verses/{version}/random` - Versículo aleatório

### Busca
- `POST /verses/search` - Buscar por palavra-chave

### Informações
- `GET /books` - Lista de livros
- `GET /versions` - Versões disponíveis

### Usuários
- `POST /users` - Criar usuário
- `PUT /users/token` - Renovar token

## 🔄 Migração da API Antiga

O projeto mantém **compatibilidade** com a API antiga através do hook `useBibleApi`, mas o novo `useBibleDigitalApi` é recomendado para:

- Melhor performance
- Mais funcionalidades
- Versões em português
- Requisições ilimitadas

## 🏗️ Estrutura de Arquivos

```
src/
├── config/
│   └── bibleConfig.ts          # Configurações da API
├── services/
│   └── bibleService.ts         # Serviço da API
├── hooks/
│   ├── useBibleApi.ts         # Hook antigo (compatibilidade)
│   └── useBibleDigitalApi.ts  # Hook novo (recomendado)
├── components/
│   ├── BibleVerseModal.tsx    # Modal atualizado
│   └── ConsoleMonitor.tsx     # Monitor de debugging
└── App.tsx                    # Integração principal
```

## 🔐 Segurança

- **Tokens**: Armazenados em variáveis de ambiente
- **Rate Limiting**: 20 req/hora sem token, ilimitado com token
- **HTTPS**: Todas as requisições são seguras
- **Dados Públicos**: Conteúdo bíblico é de domínio público

## 📞 Suporte

- **Documentação**: https://github.com/omarciovsena/abibliadigital/blob/master/DOCUMENTATION.md
- **API Base**: https://www.abibliadigital.com.br/api
- **Status**: https://stats.uptimerobot.com/5PXmCNLM

---

✅ **Status**: Implementação completa e funcional
🚀 **Performance**: Otimizada para React 19
🎨 **UI/UX**: Material Design 3 integrado
🐛 **Debug**: Console Monitor integrado
