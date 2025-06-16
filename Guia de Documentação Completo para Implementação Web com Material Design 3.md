# **Guia de Documentação Completo para Implementação Web com Material Design 3**

Este relatório fornece um compêndio exaustivo de toda a documentação, diretrizes, componentes e ferramentas necessárias para desenvolver um projeto Web seguindo rigorosamente os padrões do Google Material Design 3 (M3). O objetivo é servir como uma base de conhecimento completa para um agente de IA de codificação, garantindo que todas as decisões de design e desenvolvimento estejam alinhadas com a versão mais recente do sistema de design. A fonte primária para esta pesquisa é o portal oficial do Material Design, m3.material.io.

## **Introdução ao Material Design 3 (M3)**

O Material Design 3 é a iteração mais recente do sistema de design de código aberto do Google, criado para auxiliar na construção de produtos digitais que sejam simultaneamente belos e funcionais.¹ A filosofia central do M3 representa uma evolução significativa em relação às versões anteriores, com um foco renovado em permitir experiências que são **pessoais, adaptativas e expressivas**.²

Esta mudança de paradigma é uma resposta direta à evolução da relação entre os utilizadores e os seus dispositivos, que são cada vez mais vistos como "extensões de si mesmos".² O M3 não é apenas um conjunto de regras para garantir a consistência visual, mas sim um kit de ferramentas projetado para criar interfaces mais humanas e com maior ressonância emocional.

A mais recente expansão deste ecossistema é o **M3 Expressive**, uma camada adicional focada em "UX orientada pela emoção" (emotion-driven UX), com o objetivo de tornar os produtos mais envolventes e desejáveis.¹ Esta atualização não é meramente cosmética; é uma nova metodologia de design apoiada por uma extensa pesquisa com utilizadores, que informa a criação de componentes mais flexíveis, estilos vibrantes e um sistema de movimento totalmente integrado.²

O sistema é concebido para ser multiplataforma, com implementações oficiais para Android (via Jetpack Compose), Flutter e a Web, sendo esta última o foco principal deste relatório.²

**Recursos Introdutórios Essenciais:**

* Portal Principal do M3: [https://m3.material.io](https://m3.material.io)¹  
* Guia de Iniciação (Get Started): [https://m3.material.io/get-started](https://m3.material.io/get-started)²

## **Seção 1: Fundamentos Essenciais e Princípios Orientadores**

Antes de aplicar estilos ou utilizar componentes, é imperativo compreender os conceitos estruturais e as leis imutáveis que governam o universo M3. Estes fundamentos são a base sobre a qual todas as decisões subsequentes de design e desenvolvimento são construídas. A documentação do M3 está organizada em três pilares principais: **Fundações (Foundations), Estilos (Styles) e Componentes (Components)**, uma estrutura que orienta a navegação pelos recursos do sistema.²

#### **1.1 Fundamentos do Ecossistema M3**

As fundações abrangem os conceitos basilares de qualquer interface de utilizador, incluindo layout, interação, acessibilidade e o sistema de design tokens.²

* **Recurso Principal:** Visão Geral das Fundações: [https://m3.material.io/foundations](https://m3.material.io/foundations)⁴

#### **1.2 Conceitos Fundamentais**

* **Layout e Design Adaptativo:** Este é um conceito crítico para o desenvolvimento web moderno. O M3 afasta-se de uma grelha rígida em favor de **Layouts Canónicos** (padrões pré-definidos e escaláveis) e **Classes de Tamanho de Janela** (Window Size Classes), que definem pontos de quebra (breakpoints) para cinco tamanhos: compacto, médio, expandido, grande e extra-grande.⁵ Esta é a estrutura do M3 para o design responsivo. Os blocos de construção destes layouts são termos chave como **Pane (painel), Column (coluna), Margin (margem) e Spacer (espaçador)**.⁵  
  * Recurso Principal: Visão Geral do Layout: [https://m3.material.io/foundations/layout/understanding-layout/overview](https://m3.material.io/foundations/layout/understanding-layout/overview)⁵  
* **Estados de Interação:** São indicadores visuais (ex: hover, focus, pressionado, arrastado) que comunicam o estado de um componente ou elemento interativo.⁴ São essenciais para criar UIs intuitivas e responsivas.  
  * Recurso Principal: Documentação de Estados de Interação: [https://m3.material.io/foundations/interaction/states](https://m3.material.io/foundations/interaction/states) (URL inferido de ⁴)  
* **Design Tokens:** Representam a espinha dorsal técnica da tematização e personalização do M3. Os tokens são a **fonte única da verdade** para valores de estilo (cores, fontes, espaçamentos, etc.), garantindo consistência entre as ferramentas de design (como o Figma) e o código.⁴ A principal ferramenta para gerar estes tokens é o Material Theme Builder.  
  * Recurso Principal: Visão Geral dos Design Tokens: [https://m3.material.io/foundations/design-tokens/overview](https://m3.material.io/foundations/design-tokens/overview) (URL inferido de ⁴)

A análise destes elementos revela que eles não são pilares independentes, mas um sistema profundamente interligado. Uma decisão sobre o layout, por exemplo, ao escolher um layout canónico, impacta diretamente a acessibilidade, determinando a ordem de leitura para tecnologias assistivas.⁵ Os design tokens atuam como o elo técnico que reforça esta relação sistémica. Uma escolha de cor no Figma é armazenada como um token (ex: $md.sys.color.primary), que é depois exportado e consumido pela biblioteca de componentes web, ligando o conceito abstrato de "cor" diretamente à sua implementação final no código.⁶ Portanto, estes conceitos devem ser compreendidos de forma integrada.

#### **1.3 Acessibilidade (A11y) por Definição**

O M3 trata a acessibilidade como um **valor central do design**, e não como um requisito adicional a ser verificado no final do processo.⁹ Os princípios são construídos sobre as **normas WCAG** (Web Content Accessibility Guidelines) e visam apoiar utilizadores com uma vasta gama de capacidades.¹⁰

As principais considerações incluem:

* **Estrutura e Fluxo:** Garantir uma ordem de leitura lógica para leitores de ecrã, o que é influenciado pela estrutura do layout.⁷  
* **Cor e Contraste:** Cumprir os rácios de contraste mínimos para texto e elementos gráficos, garantindo a legibilidade.⁷  
* **Semântica:** Utilizar elementos HTML nativos e semânticos sempre que possível, para que as tecnologias assistivas possam interpretar a UI corretamente.¹⁰

**Recursos de Acessibilidade:**

* Visão Geral de Acessibilidade no M3: [https://m3.material.io/foundations/accessibility/overview](https://m3.material.io/foundations/accessibility/overview)⁹  
* Guia de Design para Acessibilidade: [https://m3.material.io/foundations/accessibility/designing](https://m3.material.io/foundations/accessibility/designing)¹⁰  
* Norma WCAG 2.1 (Referência): [https://www.w3.org/TR/WCAG21/](https://www.w3.org/TR/WCAG21/)¹¹

## **Seção 2: Estilo Visual e Tematização Sistemática**

Esta seção documenta os sistemas específicos que definem a aparência de uma aplicação M3. Estes sistemas fornecem a "tinta" e a "textura" para a estrutura fundamental definida anteriormente. A tematização no M3 não é um processo manual de escolha de estilos; é um processo algorítmico onde algumas entradas de alto nível (como cores de marca) são processadas pelo sistema M3 para gerar um conjunto completo, acessível e coerente de design tokens.⁶

#### **2.1 O Sistema de Cores M3**

* **Cor Dinâmica (Dynamic Color):** É a capacidade do sistema de gerar esquemas de cores acessíveis a partir de uma cor de origem. Em ambientes como o Android, esta cor pode ser extraída do papel de parede do utilizador; para aplicações web, pode ser uma cor de marca.⁶  
* **Papéis de Cor (Color Roles):** O sistema não gera apenas uma paleta, mas atribui cada cor a um papel semântico (ex: Primary, On-Primary, Secondary, Tertiary, Neutral, Surface). A instrução deve ser para utilizar sempre estes papéis em vez de valores de cor fixos (ex: códigos hexadecimais).⁶  
* **Recurso Principal:** Documentação do Sistema de Cores: [https://m3.material.io/styles/color/overview](https://m3.material.io/styles/color/overview)¹³

#### **2.2 O Sistema de Tipografia M3**

* **Escala Tipográfica (Type Scale):** O M3 introduz uma escala simplificada com nomes claros: Display, Headline, Title, Body e Label, cada um com tamanhos Grande, Médio e Pequeno.¹²  
* **Aplicação:** O sistema fornece orientação sobre como usar a escala tipográfica para criar hierarquia visual e "momentos editoriais" de destaque na interface.³  
* **Recurso Principal:** Documentação do Sistema de Tipografia: [https://m3.material.io/styles/typography/overview](https://m3.material.io/styles/typography/overview)¹³

#### **2.3 O Sistema de Formas M3**

Este sistema define o estilo dos cantos dos contentores, oferecendo uma gama de arredondamentos que vai do quadrado ao totalmente circular.¹³

O M3 Expressive expande este conceito com uma biblioteca de 35 novas formas, permitindo UIs mais decorativas e expressivas.¹

* **Recurso Principal:** Documentação do Sistema de Formas: [https://m3.material.io/styles/shape/overview](https://m3.material.io/styles/shape/overview)¹³

#### **2.4 Movimento e Elevação**

* **Movimento:** O M3 introduz um novo sistema de movimento baseado em física (physics-based) para criar transições mais naturais e fluidas, que também são governadas por tokens.¹  
* **Elevação:** Refere-se à distância relativa entre duas superfícies no eixo Z. É usada para comunicar hierarquia e foco, com todos os componentes a possuírem valores de elevação definidos.¹³  
* **Recursos Principais:**  
  * Documentação do Sistema de Movimento: [https://m3.material.io/styles/motion/overview](https://m3.material.io/styles/motion/overview)¹³  
  * Documentação do Sistema de Elevação: [https://m3.material.io/styles/elevation/overview](https://m3.material.io/styles/elevation/overview)¹³

#### **2.5 Iconografia e Design de Conteúdo**

* **Ícones:** A recomendação oficial é a utilização dos **Material Symbols**, que são fontes de ícones variáveis disponíveis em múltiplos pesos e estilos.¹³  
* **Design de Conteúdo (UX Writing):** O M3 fornece um guia de estilo para o texto da UI, enfatizando uma linguagem direta, fácil de digitalizar (scannable) e o uso de capitalização de frase (sentence-case) em vez de capitalização de título (title-case).¹⁵  
* **Recursos Principais:**  
  * Documentação de Ícones: [https://m3.material.io/styles/icons/overview](https://m3.material.io/styles/icons/overview)¹³  
  * Guia de Estilo de Design de Conteúdo: [https://m3.material.io/foundations/content-design/style-guide](https://m3.material.io/foundations/content-design/style-guide)¹⁵

## **Seção 3: A Biblioteca de Componentes do Material 3**

Os componentes são os blocos de construção interativos que formam a interface do utilizador.¹⁶ Esta seção fornece um catálogo abrangente dos componentes disponíveis, com um foco crítico na sua disponibilidade para a plataforma Web.

#### **3.1 Visão Geral e Categorias de Componentes**

Os componentes são organizados em categorias funcionais para facilitar a sua descoberta e utilização¹⁶:

* **Ações (Actions):** Botões, FABs (Floating Action Buttons), Botões de Ícone.  
* **Comunicação (Communication):** Emblemas (Badges), Indicadores de Progresso, Snackbars, Dicas (Tooltips).  
* **Contentores (Containment):** Cartões (Cards), Diálogos, Folhas Inferiores/Laterais (Bottom/Side Sheets), Carrosséis.  
* **Navegação (Navigation):** Barras de Aplicação (App Bars), Barras/Gavetas/Trilhos de Navegação, Separadores (Tabs).  
* **Seleção (Selection):** Caixas de Seleção (Checkboxes), Chips, Seletores de Data, Menus, Sliders, Interruptores (Switches).  
* **Entrada de Texto (Text Inputs):** Campos de Texto, Pesquisa.  
* **Recurso Principal:** Visão Geral dos Componentes: [https://m3.material.io/components](https://m3.material.io/components)¹⁶

#### **3.2 Índice Mestre de Componentes Web M3**

Uma análise detalhada revela uma discrepância significativa entre os componentes especificados no sistema de design M3 e aqueles que estão atualmente implementados e disponíveis na biblioteca oficial **Material Web Components (MWC)**. Por exemplo, enquanto os Campos de Texto estão disponíveis para a Web¹⁸, os Cartões estão explicitamente marcados como indisponíveis.¹⁹ Esta distinção é crucial para evitar tentativas de projetar ou codificar com componentes que ainda não existem na biblioteca de destino.

A tabela seguinte serve como um índice mestre, fornecendo uma fonte única da verdade sobre o estado de cada componente M3 para a Web.

| Nome do Componente | Categoria | Descrição Breve | Link para Docs M3 | Estado na Web (MWC) |
| :---- | :---- | :---- | :---- | :---- |
| Botões (Buttons) | Ações | Desencadeiam a maioria das ações numa UI. | [https://m3.material.io/components/buttons/overview](https://m3.material.io/components/buttons/overview) | Disponível |
| Grupos de Botões | Ações | Organizam botões e adicionam interações entre eles. | [https://m3.material.io/components/button-groups/overview](https://m3.material.io/components/button-groups/overview) | Disponível |
| FAB Extendido | Ações | Ajudam a executar ações primárias. | [https://m3.material.io/components/extended-fab/overview](https://m3.material.io/components/extended-fab/overview) | Disponível |
| FAB (Floating Action Button) | Ações | Ajudam a executar ações primárias. | [https://m3.material.io/components/fab/overview](https://m3.material.io/components/fab/overview) | Disponível |
| Botões de Ícone | Ações | Ajudam a executar ações menores com um toque. | [https://m3.material.io/components/icon-buttons/overview](https://m3.material.io/components/icon-buttons/overview) | Disponível |
| Botões Segmentados | Ações | Ajudam a selecionar opções ou a alternar vistas. | [https://m3.material.io/components/segmented-buttons/overview](https://m3.material.io/components/segmented-buttons/overview) | Disponível |
| Emblemas (Badges) | Comunicação | Mostram notificações, contagens ou status. | [https://m3.material.io/components/badges/overview](https://m3.material.io/components/badges/overview) | Disponível |
| Indicadores de Progresso | Comunicação | Exibem a duração ou um tempo de espera de um processo. | [https://m3.material.io/components/progress-indicators/overview](https://m3.material.io/components/progress-indicators/overview) | Disponível |
| Snackbar | Comunicação | Mostram atualizações breves na parte inferior do ecrã. | [https://m3.material.io/components/snackbar/overview](https://m3.material.io/components/snackbar/overview) | Indisponível |
| Dicas (Tooltips) | Comunicação | Exibem etiquetas ou mensagens breves. | [https://m3.material.io/components/tooltips/overview](https://m3.material.io/components/tooltips/overview) | Disponível |
| Folha Inferior (Bottom Sheet) | Contentores | Mostram conteúdo secundário ancorado na base do ecrã. | [https://m3.material.io/components/bottom-sheets/overview](https://m3.material.io/components/bottom-sheets/overview) | Indisponível |
| Cartões (Cards) | Contentores | Exibem conteúdo e ações sobre um único tópico. | [https://m3.material.io/components/cards/overview](https://m3.material.io/components/cards/overview)¹⁹ | Indisponível |
| Carrossel (Carousel) | Contentores | Mostram uma coleção de itens que podem ser percorridos. | [https://m3.material.io/components/carousel/overview](https://m3.material.io/components/carousel/overview) | Indisponível |
| Diálogos (Dialogs) | Contentores | Fornecem avisos importantes num fluxo de utilizador. | [https://m3.material.io/components/dialogs/overview](https://m3.material.io/components/dialogs/overview) | Disponível |
| Divisores (Dividers) | Contentores | Linhas finas que agrupam conteúdo. | [https://m3.material.io/components/dividers/overview](https://m3.material.io/components/dividers/overview) | Disponível |
| Folha Lateral (Side Sheet) | Contentores | Mostram conteúdo secundário ancorado na lateral do ecrã. | [https://m3.material.io/components/side-sheets/overview](https://m3.material.io/components/side-sheets/overview) | Indisponível |
| Barra de Aplicação (App Bar) | Navegação | Colocada no topo do ecrã para ajudar na navegação. | [https://m3.material.io/components/top-app-bar/overview](https://m3.material.io/components/top-app-bar/overview) | Indisponível |
| Barra de Navegação | Navegação | Permite alternar entre vistas em dispositivos pequenos. | [https://m3.material.io/components/navigation-bar/overview](https://m3.material.io/components/navigation-bar/overview) | Disponível |
| Gaveta de Navegação | Navegação | Permite alternar entre vistas em dispositivos maiores. | [https://m3.material.io/components/navigation-drawer/overview](https://m3.material.io/components/navigation-drawer/overview) | Indisponível |
| Trilho de Navegação | Navegação | Permite alternar entre vistas em dispositivos médios. | [https://m3.material.io/components/navigation-rail/overview](https://m3.material.io/components/navigation-rail/overview) | Indisponível |
| Separadores (Tabs) | Navegação | Organizam conteúdo em diferentes ecrãs e vistas. | [https://m3.material.io/components/tabs/overview](https://m3.material.io/components/tabs/overview) | Disponível |
| Caixa de Seleção (Checkbox) | Seleção | Permite selecionar um ou mais itens de uma lista. | [https://m3.material.io/components/checkbox/overview](https://m3.material.io/components/checkbox/overview) | Disponível |
| Chips | Seleção | Ajudam a inserir informação, fazer seleções ou filtrar. | [https://m3.material.io/components/chips/overview](https://m3.material.io/components/chips/overview) | Disponível |
| Seletor de Data | Seleção | Permite selecionar uma data ou um intervalo de datas. | [https://m3.material.io/components/date-pickers/overview](https://m3.material.io/components/date-pickers/overview) | Indisponível |
| Menus | Seleção | Exibem uma lista de escolhas numa superfície temporária. | [https://m3.material.io/components/menus/overview](https://m3.material.io/components/menus/overview) | Disponível |
| Botão de Rádio | Seleção | Permite selecionar uma única opção de um conjunto. | [https://m3.material.io/components/radio-buttons/overview](https://m3.material.io/components/radio-buttons/overview) | Disponível |
| Sliders | Seleção | Permitem fazer seleções a partir de um intervalo de valores. | [https://m3.material.io/components/sliders/overview](https://m3.material.io/components/sliders/overview) | Disponível |
| Interruptor (Switch) | Seleção | Ativa ou desativa a seleção de um item. | [https://m3.material.io/components/switch/overview](https://m3.material.io/components/switch/overview) | Disponível |
| Seletor de Hora | Seleção | Ajuda a selecionar e definir uma hora específica. | [https://m3.material.io/components/time-pickers/overview](https://m3.material.io/components/time-pickers/overview) | Indisponível |
| Campo de Texto | Entrada de Texto | Permite que os utilizadores insiram texto numa UI. | [https://m3.material.io/components/text-fields/overview](https://m3.material.io/components/text-fields/overview)¹⁸ | Disponível |

## **Seção 4: Desenvolvimento Web com Material Web Components (MWC)**

Esta seção fornece a documentação prática e específica necessária para implementar o M3 na Web. O ecossistema M3 para a Web está em maturação, com a documentação e os recursos distribuídos por múltiplos domínios (m3.material.io, github.com, material-web.dev). Além disso, a presença proeminente de documentação do M2 e o estado de "em desenvolvimento" de muitos componentes M3 para a Web indicam a necessidade de uma abordagem cuidadosa, cruzando as diretrizes de design com o estado real da implementação.²

#### **4.1 Introdução ao Material Web (MWC)**

MWC é a biblioteca oficial do Google de **Web Components** que implementa o M3.²² Sendo Web Components, são projetados para funcionar em diferentes frameworks (React, Vue, Svelte, etc.) ou mesmo sem qualquer framework.²²

* **Recursos Principais:**  
  * Página Inicial do Material Web: [https://material-web.dev/](https://material-web.dev/)²³  
  * Documentação Introdutória no GitHub: [https://github.com/material-components/material-web/blob/main/docs/intro.md](https://github.com/material-components/material-web/blob/main/docs/intro.md)²²

#### **4.2 Instalação e Configuração**

* **Método Padrão (NPM):** A instalação é feita através do gestor de pacotes NPM, que é a abordagem recomendada para projetos com um processo de compilação (build process).  
* **Alternativa Crítica (CDN):** Para ambientes sem um passo de compilação, o MWC pode ser utilizado diretamente a partir de uma CDN como esm.run. Esta é uma informação altamente prática e útil.²⁴  
  * Exemplo de utilização via CDN:  
    HTML  
    \<script src\="https://esm.run/@material/web/all.js" type\="module"\>\</script\>

* **Recurso Principal:** Guia de Iniciação Web: [https://m3.material.io/develop/web](https://m3.material.io/develop/web)²⁵

#### **4.3 Tematização de uma Aplicação Material Web**

A tematização envolve a aplicação dos sistemas de cor, tipografia e forma (definidos na Seção 2\) aos componentes web.²⁵ Isto é alcançado através da utilização dos **design tokens** gerados pelo Material Theme Builder, que são aplicados como propriedades personalizadas de CSS (CSS custom properties).

* **Recurso Principal:** Guia de Tematização para a Web (link dentro de [https://m3.material.io/develop/web](https://m3.material.io/develop/web))²⁵

#### **4.4 Recursos Essenciais para Desenvolvedores**

Uma lista consolidada de links vitais para qualquer desenvolvedor que trabalhe com MWC:

* Portal Oficial de Documentação MWC: Link "Material Web Docs" em [https://m3.material.io/develop/web](https://m3.material.io/develop/web)²⁵  
* Repositório Oficial no GitHub: [https://github.com/material-components/material-web](https://github.com/material-components/material-web)²²  
* Roadmap Oficial da Web: Link "Web roadmap" em [https://m3.material.io/develop/web](https://m3.material.io/develop/web)²⁵

## **Seção 5: Ferramentas Essenciais e Fluxo de Trabalho do Design para o Código**

Para operacionalizar o sistema de design M3, o Google fornece ferramentas que preenchem a lacuna crítica entre a intenção do design e a realidade do código. O fluxo de trabalho mais eficiente não é uma entrega linear do designer para o desenvolvedor, mas sim um "pipeline de tokens" contínuo e assistido por ferramentas. O processo começa no Figma, passa pelo Theme Builder para gerar tokens, e esses tokens são consumidos diretamente no código da aplicação web.

#### **5.1 O Kit de Design Oficial M3 para o Figma**

Este é o ponto de partida para qualquer trabalho de design com M3.¹ É descrito como "mais do que uma folha de autocolantes" (**sticker sheet**), contendo milhares de variantes e estilos que mapeiam diretamente para os conceitos do M3.⁸ O kit utiliza as funcionalidades mais avançadas do Figma, como variantes e propriedades de componentes, e inclui metadados para acessibilidade e nomes de **tokens**, facilitando a inspeção e a implementação.⁸

* **Recurso Principal:** Página da Comunidade Figma para o M3 Design Kit: [https://www.figma.com/community/file/1035104033342421325](https://www.figma.com/community/file/1035104033342421325) (URL inferido de ⁸)

#### **5.2 O Material Theme Builder**

Esta é a ferramenta central para a personalização no M3.⁶ Existe como uma ferramenta web e como um **plugin para o Figma**.

**Funcionalidades:**

* Visualiza a cor dinâmica e permite a criação de temas personalizados a partir de cores de origem (cores da marca).⁶  
* A sua função mais importante é a **exportação de design tokens** para múltiplos formatos de código (ex: Jetpack Compose, CSS, etc.), permitindo que os estilos definidos no design sejam aplicados de forma programática no desenvolvimento.⁶  
* **Recursos Principais:**  
  * Material Theme Builder (Web): [https://m3.material.io/theme-builder](https://m3.material.io/theme-builder)²⁶  
  * Material Theme Builder (Plugin Figma): [https://goo.gle/material-theme-builder-figma](https://goo.gle/material-theme-builder-figma)²⁶

## **Conclusão: Índice de Documentação Consolidado**

Para cumprir o pedido central de uma lista completa de links de documentação, o índice mestre abaixo consolida todos os recursos críticos identificados neste relatório. Serve como um "mapa do site" de referência rápida para um agente de IA, fornecendo um ponto de entrada único e estruturado para todo o ecossistema M3.

| Título do Recurso | Categoria | Descrição | URL Direto |
| :---- | :---- | :---- | :---- |
| Portal Principal do Material 3 | Geral | A página inicial oficial para o Material Design 3\. | [https://m3.material.io](https://m3.material.io) |
| Guia de Iniciação (Get Started) | Geral | Visão geral de alto nível e ponto de entrada para o sistema M3. | [https://m3.material.io/get-started](https://m3.material.io/get-started) |
| Visão Geral das Fundações | Fundações | Ponto de entrada para conceitos essenciais como layout e acessibilidade. | [https://m3.material.io/foundations](https://m3.material.io/foundations) |
| Diretrizes de Layout | Fundações | Documentação sobre layouts canónicos e classes de tamanho de janela. | [https://m3.material.io/foundations/layout/understanding-layout/overview](https://m3.material.io/foundations/layout/understanding-layout/overview) |
| Diretrizes de Acessibilidade | Fundações | Princípios e guias para projetar produtos inclusivos. | [https://m3.material.io/foundations/accessibility/overview](https://m3.material.io/foundations/accessibility/overview) |
| Visão Geral dos Estilos | Estilos | Ponto de entrada para sistemas visuais como cor, tipografia e forma. | [https://m3.material.io/styles](https://m3.material.io/styles) |
| Visão Geral dos Componentes | Componentes | Catálogo de todos os componentes de UI do M3. | [https://m3.material.io/components](https://m3.material.io/components) |
| Desenvolvimento para a Web | Dev Web | Portal principal para recursos de desenvolvimento web com M3. | [https://m3.material.io/develop/web](https://m3.material.io/develop/web) |
| Repositório GitHub do Material Web | Dev Web | O código-fonte e o gestor de problemas para os MWC. | [https://github.com/material-components/material-web](https://github.com/material-components/material-web) |
| Kit de Design M3 para o Figma | Ferramentas | O ficheiro oficial da comunidade Figma para o M3. | [https://www.figma.com/community/file/1035104033342421325](https://www.figma.com/community/file/1035104033342421325) |
| Material Theme Builder (Web) | Ferramentas | Ferramenta web para criar e exportar temas M3. | [https://m3.material.io/theme-builder](https://m3.material.io/theme-builder) |
| Material Theme Builder (Plugin Figma) | Ferramentas | Plugin para o Figma para integrar a criação de temas no fluxo de design. | [https://goo.gle/material-theme-builder-figma](https://goo.gle/material-theme-builder-figma) |
| Página Inicial do Material Web | Dev Web | Página dedicada à biblioteca de Material Web Components. | [https://material-web.dev/](https://material-web.dev/) |
| Norma WCAG 2.1 | Acessibilidade | Referência externa para as diretrizes de acessibilidade de conteúdo web. | [https://www.w3.org/TR/WCAG21/](https://www.w3.org/TR/WCAG21/) |

### **Índice de Links por Categoria**

Geral  
[https://m3.material.io](https://m3.material.io)  
[https://m3.material.io/get-started](https://m3.material.io/get-started)  
[https://m3.material.io/blog/building-with-m3-expressive](https://m3.material.io/blog/building-with-m3-expressive)  
[https://m2.material.io/](https://m2.material.io/)  
[https://developer.android.com/develop/ui/compose/designsystems/material3](https://developer.android.com/develop/ui/compose/designsystems/material3)  
[https://developer.android.com/design/ui/mobile/guides/components/material-overview](https://developer.android.com/design/ui/mobile/guides/components/material-overview)  
[https://developer.android.com/develop/ui/views/theming/look-and-feel](https://developer.android.com/develop/ui/views/theming/look-and-feel)

Fundações  
[https://m3.material.io/foundations](https://m3.material.io/foundations)  
[https://m3.material.io/foundations/layout/understanding-layout/overview](https://m3.material.io/foundations/layout/understanding-layout/overview)  
[https://m3.material.io/foundations/interaction/states](https://m3.material.io/foundations/interaction/states)  
[https://m3.material.io/foundations/design-tokens/overview](https://m3.material.io/foundations/design-tokens/overview)  
[https://m3.material.io/foundations/customization](https://m3.material.io/foundations/customization)  
[https://m3.material.io/foundations/overview/principles](https://m3.material.io/foundations/overview/principles)  
[https://m3.material.io/foundations/content-design/style-guide](https://m3.material.io/foundations/content-design/style-guide)

Estilos  
[https://m3.material.io/styles](https://m3.material.io/styles)  
[https://m3.material.io/styles/color/overview](https://m3.material.io/styles/color/overview)  
[https://m3.material.io/styles/typography/overview](https://m3.material.io/styles/typography/overview)  
[https://m3.material.io/styles/shape/overview](https://m3.material.io/styles/shape/overview)  
[https://m3.material.io/styles/motion/overview](https://m3.material.io/styles/motion/overview)  
[https://m3.material.io/styles/elevation/overview](https://m3.material.io/styles/elevation/overview)  
[https://m3.material.io/styles/icons/overview](https://m3.material.io/styles/icons/overview)

Componentes  
[https://m3.material.io/components](https://m3.material.io/components)  
[https://m3.material.io/components/buttons/overview](https://m3.material.io/components/buttons/overview)  
[https://m3.material.io/components/button-groups/overview](https://m3.material.io/components/button-groups/overview)  
[https://m3.material.io/components/extended-fab/overview](https://m3.material.io/components/extended-fab/overview)  
[https://m3.material.io/components/fab/overview](https://m3.material.io/components/fab/overview)  
[https://m3.material.io/components/icon-buttons/overview](https://m3.material.io/components/icon-buttons/overview)  
[https://m3.material.io/components/segmented-buttons/overview](https://m3.material.io/components/segmented-buttons/overview)  
[https://m3.material.io/components/badges/overview](https://m3.material.io/components/badges/overview)  
[https://m3.material.io/components/progress-indicators/overview](https://m3.material.io/components/progress-indicators/overview)  
[https://m3.material.io/components/snackbar/overview](https://m3.material.io/components/snackbar/overview)  
[https://m3.material.io/components/tooltips/overview](https://m3.material.io/components/tooltips/overview)  
[https://m3.material.io/components/bottom-sheets/overview](https://m3.material.io/components/bottom-sheets/overview)  
[https://m3.material.io/components/cards/overview](https://m3.material.io/components/cards/overview)  
[https://m3.material.io/components/carousel/overview](https://m3.material.io/components/carousel/overview)  
[https://m3.material.io/components/dialogs/overview](https://m3.material.io/components/dialogs/overview)  
[https://m3.material.io/components/dividers/overview](https://m3.material.io/components/dividers/overview)  
[https://m3.material.io/components/side-sheets/overview](https://m3.material.io/components/side-sheets/overview)  
[https://m3.material.io/components/top-app-bar/overview](https://m3.material.io/components/top-app-bar/overview)  
[https://m3.material.io/components/navigation-bar/overview](https://m3.material.io/components/navigation-bar/overview)  
[https://m3.material.io/components/navigation-drawer/overview](https://m3.material.io/components/navigation-drawer/overview)  
[https://m3.material.io/components/navigation-rail/overview](https://m3.material.io/components/navigation-rail/overview)  
[https://m3.material.io/components/tabs/overview](https://m3.material.io/components/tabs/overview)  
[https://m3.material.io/components/checkbox/overview](https://m3.material.io/components/checkbox/overview)  
[https://m3.material.io/components/chips/overview](https://m3.material.io/components/chips/overview)  
[https://m3.material.io/components/date-pickers/overview](https://m3.material.io/components/date-pickers/overview)  
[https://m3.material.io/components/menus/overview](https://m3.material.io/components/menus/overview)  
[https://m3.material.io/components/radio-buttons/overview](https://m3.material.io/components/radio-buttons/overview)  
[https://m3.material.io/components/sliders/overview](https://m3.material.io/components/sliders/overview)  
[https://m3.material.io/components/switch/overview](https://m3.material.io/components/switch/overview)  
[https://m3.material.io/components/time-pickers/overview](https://m3.material.io/components/time-pickers/overview)  
[https://m3.material.io/components/text-fields/overview](https://m3.material.io/components/text-fields/overview)

Desenvolvimento Web (Dev Web)  
[https://m3.material.io/develop/web](https://m3.material.io/develop/web)  
[https://material-web.dev/](https://material-web.dev/)  
[https://github.com/material-components/material-web](https://github.com/material-components/material-web)  
[https://github.com/material-components/material-web/blob/main/docs/intro.md](https://github.com/material-components/material-web/blob/main/docs/intro.md)  
[https://m2.material.io/develop/web](https://m2.material.io/develop/web)  
[https://superuser.com/questions/1825957/how-to-use-material-design-3-web-without-npm](https://superuser.com/questions/1825957/how-to-use-material-design-3-web-without-npm)

Ferramentas  
[https://www.figma.com/community/file/1035104033342421325](https://www.figma.com/community/file/1035104033342421325)  
[https://m3.material.io/theme-builder](https://m3.material.io/theme-builder)  
[https://goo.gle/material-theme-builder-figma](https://goo.gle/material-theme-builder-figma)  
[https://github.com/material-foundation/material-theme-builder](https://github.com/material-foundation/material-theme-builder)

Acessibilidade  
[https://m3.material.io/foundations/accessibility/overview](https://m3.material.io/foundations/accessibility/overview)  
[https://m3.material.io/foundations/accessibility/designing](https://m3.material.io/foundations/accessibility/designing)  
[https://www.w3.org/TR/WCAG21/](https://www.w3.org/TR/WCAG21/)  
[https://m2.material.io/design/usability/accessibility.html](https://m2.material.io/design/usability/accessibility.html)

### 

### **Guia de Links por Prioridade**

Alta Prioridade (Essenciais para Iniciar)  
[https://m3.material.io](https://m3.material.io)  
[https://m3.material.io/get-started](https://m3.material.io/get-started)  
[https://m3.material.io/develop/web](https://m3.material.io/develop/web)  
[https://material-web.dev/](https://material-web.dev/)  
[https://www.figma.com/community/file/1035104033342421325](https://www.figma.com/community/file/1035104033342421325)  
[https://m3.material.io/theme-builder](https://m3.material.io/theme-builder)

Média Prioridade (Consultas Frequentes durante o Desenvolvimento)  
[https://m3.material.io/foundations](https://m3.material.io/foundations)  
[https://m3.material.io/styles](https://m3.material.io/styles)  
[https://m3.material.io/components](https://m3.material.io/components)  
[https://github.com/material-components/material-web](https://github.com/material-components/material-web)  
[https://m3.material.io/foundations/accessibility/overview](https://m3.material.io/foundations/accessibility/overview)  
[https://m3.material.io/foundations/design-tokens/overview](https://m3.material.io/foundations/design-tokens/overview)  
[https://m3.material.io/foundations/layout/understanding-layout/overview](https://m3.material.io/foundations/layout/understanding-layout/overview)

Baixa Prioridade (Consultas Específicas ou de Referência)  
[https://m3.material.io/components/buttons/overview](https://m3.material.io/components/buttons/overview)  
[https://m3.material.io/components/text-fields/overview](https://m3.material.io/components/text-fields/overview)  
[https://m3.material.io/styles/color/overview](https://m3.material.io/styles/color/overview)  
[https://m3.material.io/styles/typography/overview](https://m3.material.io/styles/typography/overview)  
[https://m3.material.io/foundations/content-design/style-guide](https://m3.material.io/foundations/content-design/style-guide)  
[https://www.w3.org/TR/WCAG21/](https://www.w3.org/TR/WCAG21/)  
[https://goo.gle/material-theme-builder-figma](https://goo.gle/material-theme-builder-figma)  
[https://github.com/material-components/material-web/blob/main/docs/intro.md](https://github.com/material-components/material-web/blob/main/docs/intro.md)  
[https://superuser.com/questions/1825957/how-to-use-material-design-3-web-without-npm](https://superuser.com/questions/1825957/how-to-use-material-design-3-web-without-npm)  
[https://m2.material.io/](https://m2.material.io/)  
(e todos os outros links para componentes individuais)

### 

### 

### **Referências citadas**

1. Material Design 3 \- Google's latest open source design system, acessado em junho 15, 2025, [https://m3.material.io/](https://m3.material.io/)  
2. Get started with Modern UI design \- Material Design 3, acessado em junho 15, 2025, [https://m3.material.io/get-started](https://m3.material.io/get-started)  
3. Start building with Material 3 Expressive, acessado em junho 15, 2025, [https://m3.material.io/blog/building-with-m3-expressive](https://m3.material.io/blog/building-with-m3-expressive)  
4. Foundations \- Material Design 3 \- Learn the basics of Material, acessado em junho 15, 2025, [https://m3.material.io/foundations](https://m3.material.io/foundations)  
5. Layout basics \- Layout – Material Design 3, acessado em junho 15, 2025, [https://m3.material.io/foundations/layout/understanding-layout/overview](https://m3.material.io/foundations/layout/understanding-layout/overview)  
6. Customizing Material – Material Design 3, acessado em junho 15, 2025, [https://m3.material.io/foundations/customization](https://m3.material.io/foundations/customization)  
7. Accessibility \- Material Design, acessado em junho 15, 2025, [https://m2.material.io/design/usability/accessibility.html](https://m2.material.io/design/usability/accessibility.html)  
8. Introducing the M3 design kit for Figma \- Material Design, acessado em junho 15, 2025, [https://m3.material.io/blog/material-3-figma-design-kit](https://m3.material.io/blog/material-3-figma-design-kit)  
9. Accessibility overview – Material Design 3, acessado em junho 15, 2025, [https://m3.material.io/foundations/overview/principles](https://m3.material.io/foundations/overview/principles)  
10. Accessibility designing – Material Design 3, acessado em junho 15, 2025, [https://m3.material.io/foundations/designing](https://m3.material.io/foundations/designing)  
11. Web Content Accessibility Guidelines (WCAG) 2.1 \- W3C, acessado em junho 15, 2025, [https://www.w3.org/TR/WCAG21/](https://www.w3.org/TR/WCAG21/)  
12. Material Design 3 in Compose | Jetpack Compose \- Android Developers, acessado em junho 15, 2025, [https://developer.android.com/develop/ui/compose/designsystems/material3](https://developer.android.com/develop/ui/compose/designsystems/material3)  
13. Styles \- Material Design 3 \- Browse color, shape, typography, and ..., acessado em junho 15, 2025, [https://m3.material.io/styles](https://m3.material.io/styles)  
14. Material Design for Android | Views \- Android Developers, acessado em junho 15, 2025, [https://developer.android.com/develop/ui/views/theming/look-and-feel](https://developer.android.com/develop/ui/views/theming/look-and-feel)  
15. Style guide – Material Design 3, acessado em junho 15, 2025, [https://m3.material.io/foundations/content-design/style-guide](https://m3.material.io/foundations/content-design/style-guide)  
16. Components — Material Design 3, acessado em junho 15, 2025, [https://m3.material.io/components](https://m3.material.io/components)  
17. Material Components | Mobile \- Android Developers, acessado em junho 15, 2025, [https://developer.android.com/design/ui/mobile/guides/components/material-overview](https://developer.android.com/design/ui/mobile/guides/components/material-overview)  
18. Text fields – Material Design 3, acessado em junho 15, 2025, [https://m3.material.io/components/text-fields](https://m3.material.io/components/text-fields)  
19. Cards – Material Design 3, acessado em junho 15, 2025, [https://m3.material.io/components/cards](https://m3.material.io/components/cards)  
20. Develop \- Web \- Material Design, acessado em junho 15, 2025, [https://m2.material.io/develop/web](https://m2.material.io/develop/web)  
21. Material Design: Homepage, acessado em junho 15, 2025, [https://m2.material.io/](https://m2.material.io/)  
22. material-web/docs/intro.md at main · material-components/material-web \- GitHub, acessado em junho 15, 2025, [https://github.com/material-components/material-web/blob/main/docs/intro.md](https://github.com/material-components/material-web/blob/main/docs/intro.md)  
23. Material Web, acessado em junho 15, 2025, [https://material-web.dev/](https://material-web.dev/)  
24. How to use Material Design 3 web without NPM? \- Super User, acessado em junho 15, 2025, [https://superuser.com/questions/1825957/how-to-use-material-design-3-web-without-npm](https://superuser.com/questions/1825957/how-to-use-material-design-3-web-without-npm)  
25. Material Design 3 for Web, acessado em junho 15, 2025, [https://m3.material.io/develop/web](https://m3.material.io/develop/web)  
26. material-foundation/material-theme-builder: Visualize dynamic color and create a custom Material Theme. \- GitHub, acessado em junho 15, 2025, [https://github.com/material-foundation/material-theme-builder](https://github.com/material-foundation/material-theme-builder)