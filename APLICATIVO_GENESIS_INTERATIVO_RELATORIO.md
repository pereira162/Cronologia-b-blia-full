
# Relatório Detalhado: Aplicativo Gênesis Interativo

**Nome do Aplicativo:** Copy of Gênesis Interativo
**Descrição Curta:** Uma exploração visual interativa das narrativas fundacionais do Livro de Gênesis, permitindo aos usuários explorar vidas, genealogias e eventos significativos de forma intuitiva.

## 1. Objetivo Principal

O objetivo central do "Gênesis Interativo" é fornecer uma ferramenta educacional e exploratória rica para usuários interessados em estudar o Livro de Gênesis da Bíblia. Ele busca transformar as narrativas textuais e dados genealógicos complexos em uma visualização interativa, dinâmica e de fácil compreensão. A aplicação permite aos usuários:

*   **Visualizar cronologias** de personagens bíblicos e eventos importantes de forma linear e interconectada.
*   **Explorar relações genealógicas** entre personagens.
*   **Obter informações detalhadas** sobre cada personagem e evento.
*   **Personalizar a visualização** para focar em aspectos específicos de interesse.
*   **Compreender a escala temporal** e a longevidade dos patriarcas antediluvianos e pós-diluvianos.

## 2. Visão Geral da Interface do Usuário

A interface do usuário é projetada para ser intuitiva, permitindo fácil acesso às suas ricas funcionalidades. É composta pelas seguintes seções principais:

*   **Cabeçalho Principal:** Exibe o título "Gênesis Interativo" e um botão para mostrar/ocultar o painel de configurações.
*   **Painel de Controles Retrátil:** Uma seção abrangente que contém todas as ferramentas de personalização e configuração da visualização. Pode ser recolhida para maximizar o espaço da linha do tempo.
*   **Área Principal da Linha do Tempo (`TimelineView`):** O coração da aplicação, onde as barras de personagens, eventos e a régua de anos são renderizadas interativamente. Esta área é rolável horizontal e verticalmente.
*   **Cards de Detalhes (Modais):** Janelas modais que aparecem sobre a interface principal para exibir informações aprofundadas quando um personagem ou evento é selecionado.
*   **Rodapé:** Exibe uma breve descrição ou tagline da aplicação.

## 3. Funcionalidades Detalhadas

A aplicação oferece um conjunto robusto de funcionalidades para explorar e entender os dados do Gênesis.

### 3.1. Visualização da Linha do Tempo Interativa (`TimelineView.tsx`)

Esta é a área central onde os dados são visualizados.

*   **Representação de Personagens (Barras):**
    *   Cada personagem com dados cronológicos é representado por uma barra horizontal. O comprimento da barra indica seu tempo de vida.
    *   **Linha do Pacto vs. Outros:** Personagens da linha principal do pacto (descendência de Adão a Jacó/José/Judá) são destacados e geralmente têm barras mais proeminentes.
    *   **Informações na Barra:** O nome do personagem e seu tempo de vida (ano de nascimento, ano de morte, idade total) são exibidos diretamente na barra. O tamanho da fonte dessas informações é ajustável pela "Escala Geral da UI".
    *   **Cores das Barras:** As barras dos personagens principais da linha do pacto utilizam uma paleta de cores definida pelo tema selecionado, ciclando através das cores para diferenciar gerações ou indivíduos. Irmãos fora da linha do pacto têm uma cor padrão ou uma variação.
    *   **Controles na Barra de Personagem (se `showCharacterBarControls` estiver ativo):**
        *   **Ocultar/Mostrar Personagem:** Um ícone de olho permite ocultar individualmente um personagem da linha do tempo ou mostrá-lo novamente.
        *   **Mostrar/Ocultar Linhas de Vida:** Um ícone permite exibir ou ocultar linhas verticais que marcam o nascimento e a morte do personagem, estendendo-se por toda a altura da linha do tempo.
        *   **Expandir/Recolher Irmãos:** Para personagens que têm filhos que não são da linha principal do pacto, um ícone (+/-) permite expandir ou recolher a visualização desses irmãos abaixo da barra do pai/mãe.

*   **Representação de Irmãos (Não pertencentes à Linha do Pacto):**
    *   Quando expandidos, os irmãos são exibidos como barras menores abaixo do personagem principal.
    *   Eles são posicionados cronologicamente de acordo com seu ano de nascimento, sem recuo horizontal adicional, alinhando-se diretamente na linha do tempo.
    *   Suas barras também exibem nome e tempo de vida.

*   **Arcos de Relacionamento (Genealógicos):**
    *   **Arcos da Linha do Pacto:** Uma linha de arco curva conecta a barra de um personagem visível da linha do pacto ao início da barra do seu próximo descendente *visível* na mesma linha.
        *   **Ícones "+" para Personagens Ocultos:** Se houver um ou mais personagens da linha do pacto ocultos entre os dois personagens conectados pelo arco, um pequeno ícone circular com um "+" aparecerá no arco para cada personagem oculto. Clicar neste ícone torna o personagem correspondente visível novamente. A posição do ícone no arco é proporcional ao ano de nascimento do personagem oculto.
    *   **Arcos para Irmãos Expandidos:** Quando o grupo de irmãos de um personagem é expandido, arcos individuais conectam a barra do pai/mãe a cada um dos seus filhos *visíveis* não pertencentes à linha do pacto.

*   **Régua de Anos:**
    *   Localizada no topo da área da linha do tempo.
    *   Exibe marcadores de ano maiores (a cada 500 anos por padrão) e menores (a cada 100 anos por padrão, ajustável com o zoom).
    *   Os anos podem ser exibidos no formato "aC" (Antes de Cristo) ou "Relativo" (Adão=0 ou Queda=0, dependendo da configuração).
    *   **Fixar/Desafixar Régua:** Um botão de "pin" no canto superior direito da área da linha do tempo permite fixar a régua de anos no topo da tela. Quando fixada, ela permanece visível mesmo ao rolar a linha do tempo verticalmente. O botão em si também permanece fixo para fácil acesso.
    *   Quando não fixada, a régua rola com o conteúdo, e um padding é aplicado para evitar que ela sobreponha o primeiro personagem.

*   **Linhas de Vida:**
    *   Quando ativadas para um personagem, duas linhas verticais de cor destacada (amarelo, por padrão) marcam o ano de nascimento e o ano de morte desse personagem, atravessando toda a altura da linha do tempo para fácil referência cruzada com outros personagens ou eventos.

*   **Eventos Bíblicos:**
    *   Eventos com ano definido são marcados por uma linha vertical de cor distinta (rosa/magenta, por padrão) na linha do tempo.
    *   Um pequeno ícone emoji representando o evento (ex: 🌍 para Criação, 🍎 para Queda) é exibido próximo ao topo da linha do evento.
    *   O nome completo do evento é exibido verticalmente, ao lado da linha do evento. O tamanho da fonte dos nomes dos eventos é significativamente maior para melhor legibilidade.
    *   **Posicionamento Inteligente dos Nomes:** O sistema tenta posicionar o nome vertical do evento o mais próximo possível (verticalmente) do personagem mais relevante na mesma coordenada X, ou de outros títulos de evento, evitando sobreposições com barras de personagem e outros nomes de evento. É mantido um espaçamento vertical mínimo.

*   **Grade de Fundo:**
    *   Linhas de grade horizontais e verticais sutis são exibidas no fundo da linha do tempo para auxiliar na orientação visual e alinhamento.

*   **Interatividade (Cliques):**
    *   **Selecionar Personagem:** Clicar na barra de um personagem (principal ou irmão) abre o "Card de Personagem" com detalhes sobre ele.
    *   **Selecionar Evento:** Clicar na linha vertical de um evento ou em seu nome/ícone abre o "Card de Evento".
    *   **Expandir/Recolher Irmãos:** Clicar no ícone (+/-) na barra de um personagem principal.
    *   **Mostrar/Ocultar Personagens via Arcos:** Clicar no ícone "+" em um arco genealógico.

### 3.2. Painel de Controles (`App.tsx`)

Este painel, localizado abaixo do cabeçalho principal, agrupa as opções de personalização.

*   **Alternar Visibilidade do Painel:** Um botão "Configurações da Visualização" (com ícone de engrenagem) no cabeçalho principal permite mostrar ou ocultar todo este painel.
*   **Controles nas Barras de Personagem (Mostrar/Ocultar):** Um botão permite ativar ou desativar a exibição dos pequenos ícones de controle (ocultar personagem, linhas de vida, expandir irmãos) diretamente nas barras dos personagens principais na linha do tempo.
*   **Seleção de Tema:**
    *   Um menu dropdown permite ao usuário escolher entre diversos temas visuais (ex: "Escuro Moderno", "Claro Clássico", "Chama Oceânica").
    *   Cada tema define um conjunto de cores para o fundo, texto, barras de personagens, acentos, etc., alterando drasticamente a aparência da aplicação.
    *   O seletor de tema exibe uma miniatura das cores principais do tema.
*   **Modo de Referência de Ano:**
    *   Um botão permite alternar como os anos são exibidos na régua e nos cards:
        *   **aC (Antes de Cristo):** Os anos são calculados e exibidos em relação ao sistema tradicional aC/dC.
        *   **Relativo:** Os anos são exibidos em relação ao ano 0 definido na cronologia interna da aplicação (atualmente, "A Queda" é o ano 0, e "Criação" é o ano -50).
*   **Filtro de Eventos:**
    *   Um menu dropdown permite ao usuário selecionar quais categorias de eventos devem ser exibidas na linha do tempo.
    *   Os eventos são categorizados como "principal", "secundário" e "menor". O usuário pode marcar/desmarcar checkboxes para cada evento individualmente dentro dessas categorias.
*   **Painel de Visibilidade de Personagens:**
    *   Um menu dropdown lista todos os personagens.
    *   Checkboxes ao lado de cada nome permitem mostrar ou ocultar individualmente cada personagem na linha do tempo.
    *   **Botão "Mostrar Todos os Personagens":** Um botão dentro deste painel restaura a visibilidade de todos os personagens que foram ocultados.
*   **Controles de Escala:**
    *   Três sliders permitem ajustar a densidade e o tamanho da visualização:
        *   **Escala Geral da UI:** Afeta o tamanho da fonte de muitos elementos textuais (cabeçalho, rodapé, controles, texto nas barras de personagem, régua de anos) e também atua como um multiplicador para as outras duas escalas. Valores variam de 0.7x a 1.5x.
        *   **Escala de Tempo (Zoom Horizontal):** Controla o "zoom" horizontal da linha do tempo. Valores menores comprimem mais anos em menos espaço (visão geral), enquanto valores maiores expandem os anos (mais detalhes). A escala efetiva exibida é `Escala Base * Escala Geral UI`.
        *   **Escala Vertical (Detalhes):** Controla a altura das barras dos personagens e o espaçamento vertical entre elas. A escala efetiva exibida é `Escala Base * Escala Geral UI`.

### 3.3. Cards de Detalhes (Modais)

Quando um personagem ou evento é selecionado, um modal (card) é exibido com informações detalhadas.

*   **Card de Personagem (`CharacterCard.tsx`):**
    *   **Informações:** Nome (destacado se for da linha do pacto), significado do nome, referência bíblica principal, dados cronológicos (nascimento, morte, tempo de vida, idade ao gerar filho principal – todos relativos ao ano 0 interno), descrição textual do personagem, e nome do pai.
    *   **Eventos Chave Relacionados:** Uma lista dos principais eventos bíblicos nos quais o personagem esteve envolvido.
    *   **Fechar Card:** Um botão "X" no canto e um botão "Fechar" na parte inferior. Clicar fora da área do card também o fecha.

*   **Card de Evento (`EventCard.tsx`):**
    *   **Informações:** Nome do evento, ano (relativo ao ano 0 interno), capítulos de Gênesis relacionados, e uma descrição textual do evento.
    *   **Participantes:** Uma lista dos personagens bíblicos que participaram do evento. Clicar no nome de um participante fecha o card do evento e abre o card do personagem selecionado.
    *   **Fechar Card:** Um botão "X" no canto e um botão "Fechar". Clicar fora também o fecha.

### 3.4. Gerenciamento de Dados

A aplicação se baseia em um conjunto de dados estruturados sobre personagens e eventos.

*   **Estrutura dos Dados:**
    *   `Person`: Interface que define os campos para um personagem (id, nome, datas, família, eventos, descrição, etc.).
    *   `BibleEvent`: Interface para eventos (id, nome, ano, descrição, personagens envolvidos, categoria, etc.).
*   **Fonte dos Dados:**
    *   `characterProfiles.ts`: Contém informações descritivas e relacionais dos personagens (nome, significado, descrição, IDs de pai/mãe/filhos).
    *   `characterTimings.ts`: Contém os dados cronológicos originais (ano de nascimento, idade na paternidade, tempo de vida) com Adão como ano 0.
    *   `data.ts`:
        *   Importa dados de `characterProfiles.ts` e `characterTimings.ts`.
        *   **Ajuste Cronológico:** Realiza um ajuste fundamental na cronologia. Os dados originais de `characterTimings.ts` (Adão=0) são processados para estabelecer "A Queda" como o novo ano 0. O ano de "Criação" (e o nascimento de Adão) é definido como -50 em relação a este novo marco. Todos os outros anos de nascimento de personagens e anos de eventos são recalculados com base nesta nova referência.
        *   Mescla os perfis com os dados cronológicos ajustados para criar a lista final `peopleData`.
        *   Define a lista `eventsData`, com os anos dos eventos também ajustados para a nova cronologia.
        *   Calcula os anos de morte (`deathYear`) dos personagens se `birthYear` e `totalLifespan` estiverem disponíveis.
*   **Cronologia e Cálculos:**
    *   A aplicação trabalha internamente com um sistema de anos relativo (Queda=0).
    *   Funções em `TimelineView.tsx` convertem esses anos relativos para exibição (seja como "aC" ou mantendo o relativo) e calculam as posições X (horizontais) dos elementos na linha do tempo com base na escala horizontal e no intervalo total de anos visível.

## 4. Uso da Aplicação

*   **Navegação Inicial:** Ao carregar, a aplicação exibe a linha do tempo com personagens e eventos principais visíveis, usando o tema padrão. O painel de controles está inicialmente visível.
*   **Explorando a Linha do Tempo:**
    *   Use as barras de rolagem horizontal e vertical do navegador (ou do contêiner da linha do tempo) para navegar por diferentes períodos e gerações.
    *   Observe as barras de personagens para ter uma ideia de seus tempos de vida e sobreposições geracionais.
    *   Identifique eventos chave marcados pelas linhas verticais.
*   **Personalizando a Visualização:**
    *   Use o botão "Configurações da Visualização" para mostrar/ocultar o painel de controles.
    *   Experimente diferentes **Temas** para alterar a aparência.
    *   Alterne o **Modo de Referência de Ano** para ver as datas como "aC" ou "Relativo".
    *   Utilize os **Filtros de Evento** para focar em eventos de maior ou menor importância.
    *   No painel de **Visibilidade de Personagens**, oculte personagens menos relevantes para simplificar a visualização ou mostre todos.
    *   Ajuste os **Sliders de Escala** para otimizar a densidade da informação (zoom in/out horizontal e verticalmente) e o tamanho geral da interface.
    *   Fixe ou desafixe a **Régua de Anos** conforme sua preferência de navegação.
    *   Ative/desative os **Controles nas Barras** ou as **Linhas de Vida** dos personagens.
*   **Obtendo Detalhes:**
    *   Clique em qualquer barra de personagem para abrir seu card de detalhes.
    *   Clique em qualquer linha de evento (ou seu nome/ícone) para ver o card do evento.
    *   Dentro do card de evento, clique nos nomes dos participantes para navegar para seus respectivos cards de personagem.

## 5. Aspectos Técnicos (Resumo)

*   **Tecnologias:**
    *   **React:** Biblioteca JavaScript para construir a interface do usuário.
    *   **TypeScript:** Superset do JavaScript que adiciona tipagem estática para maior robustez do código.
    *   **Vite:** Ferramenta de build moderna e rápida para desenvolvimento frontend.
    *   **Tailwind CSS:** Framework CSS utilitário para estilização rápida e customizável, complementado por variáveis CSS para temas.
*   **Estrutura de Componentes:** A aplicação é modularizada em componentes React (ex: `App`, `TimelineView`, `CharacterCard`, `EventCard`).
*   **Gerenciamento de Estado:** O estado global (como tema selecionado, filtros, escalas, personagem/evento selecionado) é gerenciado principalmente no componente `App.tsx` usando hooks do React (`useState`, `useMemo`, `useEffect`). O `TimelineView.tsx` também gerencia seu próprio estado interno relacionado à renderização e interações específicas da linha do tempo.

## 6. Pontos de Destaque e Design

*   **Interatividade Rica:** Múltiplas formas de interagir com os dados (cliques, toggles, sliders).
*   **Customização Visual:** Temas e escalas permitem adaptar a experiência ao gosto do usuário.
*   **Riqueza de Informações:** Combina dados cronológicos, genealógicos, descritivos e de eventos.
*   **Design Orientado a Dados:** A visualização é diretamente derivada dos dados estruturados.
*   **Acessibilidade (Considerações Iniciais):** Uso de atributos como `aria-label`, `title`, `role="button"` e navegação por teclado (`tabIndex`, `onKeyDown`) em alguns elementos interativos. Contraste de cores é geralmente bom nos temas escuros.

## 7. Possíveis Melhorias Futuras (Inferências)

Embora não explicitamente solicitadas, algumas áreas para expansão futura poderiam incluir:

*   Detalhes familiares mais ricos nos cards (mãe, todos os cônjuges, todos os filhos com links diretos).
*   Uma visualização de árvore genealógica separada ou integrada (o arquivo `GenealogyTreeView.tsx` existe mas não está implementado/usado).
*   Funcionalidade de busca/filtro avançado por nome de personagem ou palavra-chave em descrições.
*   Internacionalização (suporte a múltiplos idiomas).
*   Mais opções de personalização para a aparência dos arcos ou linhas.
*   Informações sobre fontes e referências bíblicas mais granulares.

Este relatório visa cobrir de forma abrangente a estrutura e funcionalidade do aplicativo "Gênesis Interativo" com base nos arquivos de código fornecidos.
      