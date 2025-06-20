# **Integrando Referências Bíblicas Interativas na Web: Uma Análise Técnica Abrangente de APIs, Bibliotecas e Estratégias de Implementação**

## **Introdução**

A criação de um site com um volume significativo de referências bíblicas apresenta um desafio técnico e de experiência do usuário (UX) particular: como transformar citações estáticas, como "João 3:16", em elementos dinâmicos e interativos que enriqueçam a jornada do leitor. A solução ideal permite que os usuários acessem o texto completo de uma passagem bíblica instantaneamente, idealmente em um pop-up ou tooltip, sem a necessidade de navegar para outra página, mantendo assim o contexto e o engajamento. Este relatório técnico oferece uma análise exaustiva das arquiteturas de solução, ferramentas e estratégias disponíveis para alcançar esse objetivo.

As abordagens para resolver este problema dividem-se fundamentalmente em duas categorias principais, cada uma com seus próprios compromissos entre facilidade de implementação e controle granular:

1. **Soluções do Lado do Cliente (Client-Side):** Esta abordagem utiliza bibliotecas JavaScript e widgets "plug-and-play" que são adicionados diretamente ao frontend do site. Após o carregamento da página, esses scripts escaneiam o conteúdo em busca de referências bíblicas e as convertem automaticamente em links interativos. A sua principal vantagem é a simplicidade e a velocidade de implementação.  
2. **Soluções do Lado do Servidor (Server-Side) via API:** Esta abordagem envolve a integração com uma API (Application Programming Interface) RESTful. O frontend captura a interação do usuário e faz uma chamada a um serviço que retorna o texto bíblico em um formato de dados estruturado, como JSON. Esta metodologia oferece flexibilidade e controle máximos sobre a apresentação dos dados e a experiência do usuário, embora exija um esforço de desenvolvimento mais substancial.

Para fornecer uma recomendação informada e útil, cada solução potencial será avaliada com base em um conjunto rigoroso de critérios técnicos e de negócio, cruciais para o sucesso de um projeto web moderno:

* **Disponibilidade de Traduções em Português:** A prioridade é a disponibilidade de versões populares no Brasil, como a Almeida Corrigida Fiel (ACF), a Nova Versão Internacional (NVI) e a Almeida Revista e Atualizada (RA).  
* **Facilidade de Implementação e Qualidade da Documentação:** Análise da curva de aprendizado, da clareza dos guias de integração e da robustez dos recursos de apoio para desenvolvedores.  
* **Desempenho e Escalabilidade:** Avaliação do impacto da solução no tempo de carregamento da página (page load time) e sua capacidade de lidar com um aumento no volume de requisições.  
* **Custo e Modelo de Negócio:** Análise comparativa de soluções gratuitas, modelos freemium e serviços pagos, considerando o custo total de propriedade.  
* **Licenciamento e Direitos Autorais:** Uma análise crítica dos termos de uso, tanto da tecnologia (API/biblioteca) quanto do conteúdo (as traduções bíblicas), que é frequentemente o fator mais complexo e restritivo.2

Este relatório visa equipar desenvolvedores e arquitetos de software com a informação necessária para selecionar e implementar a solução mais adequada ao seu projeto específico, equilibrando funcionalidade, custo, desempenho e conformidade legal.

## **Seção 1: Soluções do Lado do Cliente: Widgets e Auto-Linkers**

As soluções do lado do cliente representam a abordagem mais direta para adicionar interatividade às referências bíblicas. Elas são ideais para projetos onde a velocidade de implementação é um fator crítico, como blogs, sites de conteúdo ou protótipos.

### **1.1. Visão Geral Conceitual**

A tecnologia por trás dos "auto-linkers" ou widgets de versículos é elegante em sua simplicidade. O processo geralmente segue estes passos:

1. **Inclusão do Script:** O desenvolvedor adiciona uma única linha de código HTML, tipicamente uma tag \<script\>, ao seu site, geralmente antes do fechamento da tag \</body\>.4  
2. **Análise do DOM:** Uma vez que a página é carregada no navegador do usuário, este script é executado. Ele percorre o DOM (Document Object Model) da página, essencialmente "lendo" todo o conteúdo textual visível.  
3. **Detecção por Regex:** O script utiliza expressões regulares (regex) para identificar padrões de texto que correspondem a referências bíblicas. Esses padrões são projetados para serem flexíveis, reconhecendo formatos comuns como "João 3:16", "Gn 1:1-5" ou "1 Coríntios 13".5  
4. **Enriquecimento Dinâmico:** Ao encontrar uma correspondência, o script modifica dinamicamente o DOM. Ele envolve a referência textual em um elemento interativo, como uma tag \<a\> ou \<span\>.  
5. **Manipulação de Eventos:** A esse novo elemento são adicionados *event listeners* de JavaScript. Por exemplo, um evento mouseover (passar o mouse sobre) ou click é configurado para acionar a próxima etapa.  
6. **Exibição do Pop-up:** Quando o evento é acionado, o script exibe um pop-up, também conhecido como tooltip ou modal. O conteúdo deste pop-up, que é o texto do versículo, é geralmente buscado de uma API externa de forma transparente para o desenvolvedor e para o usuário final. O resultado é uma experiência fluida onde o texto bíblico aparece sem a necessidade de recarregar a página.7

### **1.2. Análise Detalhada das Ferramentas de Auto-Linking**

Diversas ferramentas oferecem essa funcionalidade "plug-and-play". As mais proeminentes são analisadas abaixo.

#### **MyOwnBible Embed Script**

* **Funcionamento:** O script da MyOwnBible é uma solução moderna e eficaz que automaticamente identifica referências bíblicas no texto e as transforma em hyperlinks. Ao passar o mouse sobre o link, um popover elegante exibe o texto do versículo. Além disso, o popover inclui botões para compartilhamento em redes sociais, agregando uma funcionalidade de engajamento viral.8  
* **Instalação e Personalização:** A instalação é extremamente simples, exigindo apenas a inserção da tag \<script src="https://www.myownbible.app/embed.js" defer\>\</script\> no cabeçalho (\<head\>) do site.9 A personalização é um ponto forte, realizada através de um objeto de configuração global  
  window.MOBConfig. Isso permite um controle refinado sobre o comportamento, como desativar o popover (popover: false), controlar a renderização para uma ativação manual (render: false), e, crucialmente, definir o idioma padrão da tradução (language: "pt-BR", por exemplo). Também é possível desativar os estilos padrão para aplicar CSS customizado, garantindo uma integração visual perfeita com o design do site.9  
* **Versões em Português:** O serviço suporta explicitamente o idioma português, conforme listado na documentação de seu aplicativo e FAQs, tornando-o um candidato ideal para o público brasileiro.10

#### **RefTagger da Logos/Faithlife**

* **Funcionamento:** O RefTagger é uma das ferramentas mais conhecidas e estabelecidas nesta categoria. Ele converte referências textuais em links que, ao serem sobrevoados, exibem um tooltip com o texto do versículo. Os dados são buscados do ecossistema da Logos, especificamente do site Biblia.com.7  
* **Instalação e Personalização:** A instalação requer a visita ao site reftagger.com para gerar um snippet de código personalizado, que é então colado no corpo da página. A plataforma de personalização permite escolher a versão da Bíblia padrão, se deve ou não criar links para referências de capítulos inteiros (ex: "Gênesis 1") e a capacidade de ignorar a análise dentro de certas tags HTML (como \<h1\> ou \<b\>) para evitar links indesejados.7  
* **Versões em Português:** A documentação principal e as opções de personalização no site oficial listam predominantemente versões em inglês (como ESV, KJV, NIV).7 Embora um plugin de terceiros para WordPress mencione suporte a português 15, a ferramenta principal parece focada no mercado de língua inglesa, representando uma desvantagem significativa para o caso de uso em questão. Além disso, há relatos em fóruns de que o serviço pode não ser mantido ativamente, o que representa um risco de descontinuidade.13

#### **Bibles.org Global Bible Widget**

* **Funcionamento:** A plataforma Bibles.org, mantida pela American Bible Society, oferece um conjunto de widgets, incluindo um "Auto-Linker". Este utilitário funciona de forma semelhante aos concorrentes, analisando o texto da página e transformando referências em "Link Widgets" interativos que exibem o texto em um modal ou em uma nova aba.4  
* **Instalação e Personalização:** A implementação é feita através da adição de um script JavaScript. A configuração pode ser feita globalmente na inicialização (GLOBALBIBLE.init({...})) ou por widget individualmente, usando atributos data- no HTML, o que oferece alguma flexibilidade.4  
* **Versões em Português:** A documentação e os exemplos demonstram um foco quase exclusivo em versões em inglês. A própria página do widget afirma que, por enquanto, o auto-linker funciona apenas com o inglês, com planos de expansão futura.4 Isso o torna inviável para um site cujo conteúdo principal é em português.

### **1.3. Análise Comparativa e Recomendações**

A decisão de usar uma solução do lado do cliente envolve uma análise cuidadosa do equilíbrio entre a rapidez da implementação e o controle sobre o produto final. A simplicidade de colar uma linha de script e ter a funcionalidade pronta em minutos é inegavelmente atraente. Contudo, essa facilidade vem com custos implícitos que podem se manifestar como passivos técnicos a longo prazo.

Primeiro, a **perda de controle sobre a apresentação visual**. O desenvolvedor fica limitado às opções de personalização oferecidas pelo provedor do widget. Se o design do pop-up não se alinhar com a identidade visual do site, a experiência do usuário pode parecer desconexa. Segundo, o **desempenho fica atrelado a um terceiro**. Se a API do provedor do widget estiver lenta ou indisponível, a interatividade no site do usuário será diretamente impactada, podendo levar a uma experiência frustrante. Terceiro, há uma **dependência de conteúdo**. Não é possível exibir uma tradução da Bíblia que não seja suportada pelo widget, limitando a flexibilidade teológica e editorial do site. Por fim, existe o **risco de descontinuidade do serviço**. Se o provedor decidir descontinuar o widget, como alguns usuários relataram sobre o RefTagger 13, a funcionalidade no site do usuário deixará de funcionar abruptamente, exigindo uma substituição de emergência.

Para um blog pessoal, um site de igreja com recursos limitados ou um projeto com um prazo de entrega muito curto, um widget como o **MyOwnBible Embed** é uma escolha excelente. Ele atende a todos os requisitos principais: é fácil de implementar, altamente personalizável e, o mais importante, oferece suporte nativo para o português. Para uma aplicação web mais complexa, onde a consistência da marca, o desempenho otimizado e a flexibilidade de conteúdo são cruciais, a perda de controle associada a um widget pode ser um risco inaceitável. Nesses casos, a abordagem de integração via API, discutida na próxima seção, torna-se a opção arquitetonicamente mais sólida.

#### **Tabela Comparativa de Widgets de Auto-Linking**

| Ferramenta | Facilidade de Instalação | Opções de Personalização | Versões em Português Disponíveis | Custo | Dependência de Terceiros |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **MyOwnBible Embed** | Muito Alta (1 linha de script) | Alta (Objeto de config. global, CSS) | Sim, suportado 10 | Gratuito | Alta |
| **RefTagger** | Alta (Script gerado) | Média (Configurador no site) | Limitado/Incerto 7 | Gratuito | Alta (Risco de descontinuidade) |
| **Bibles.org Widget** | Alta (Script \+ init) | Média (Atributos data-) | Não (Apenas inglês) 4 | Gratuito | Alta |

## **Seção 2: Integração via APIs de Servidor (Abordagem de Máxima Flexibilidade)**

Optar por uma integração via API representa uma mudança de paradigma da simplicidade "plug-and-play" para o controle total sobre a funcionalidade. Esta abordagem é a mais adequada para aplicações web robustas, onde a experiência do usuário, o desempenho e a manutenção a longo prazo são prioridades.

### **2.1. Visão Geral Conceitual**

O fluxo de trabalho de uma solução baseada em API é inerentemente mais envolvido, mas também mais poderoso. Ele se desenrola da seguinte forma:

1. **Detecção no Frontend:** O frontend da aplicação é programado para reconhecer referências bíblicas. Isso pode ser feito de várias maneiras: envolvendo as referências em componentes específicos (ex: \<Versiculo ref="João 3:16" /\>), adicionando classes CSS especiais, ou até mesmo usando uma lógica de parsing no lado do cliente.  
2. **Requisição à API:** Quando um usuário interage com a referência (por exemplo, clicando ou passando o mouse), o código JavaScript do frontend dispara uma requisição HTTP. Essa requisição pode ser enviada diretamente para a API de terceiros ou, preferencialmente, para o próprio backend do desenvolvedor, que atua como um proxy.  
3. **Processamento da API:** A API da Bíblia recebe a requisição (ex: GET /verses/nvi/jo/3/16), busca os dados correspondentes em seu banco de dados e retorna a informação em um formato estruturado, quase universalmente JSON (JavaScript Object Notation).  
4. **Renderização no Frontend:** O frontend recebe a resposta JSON. Como os dados estão estruturados (ex: { book: "João", chapter: 3, verse: 16, text: "Porque Deus amou..." }), o desenvolvedor tem total liberdade para usá-los. Ele pode injetar o texto em um componente de tooltip customizado, exibir um modal com design próprio, ou qualquer outra interface que se alinhe perfeitamente com a experiência do usuário do site.

Esta abordagem desacopla a apresentação dos dados, dando ao desenvolvedor controle absoluto sobre o design, a interatividade e o fluxo de dados.

### **2.2. Revisão Abrangente dos Provedores de API**

O ecossistema de APIs da Bíblia é variado, oferecendo diferentes níveis de serviço, conteúdo e modelos de negócio.

#### **ABíbliaDigital**

* **Visão Geral:** Uma API RESTful desenvolvida no Brasil, com um foco claro no público de língua portuguesa. Este projeto é mantido ativamente e visa simplificar o desenvolvimento de aplicações para igrejas e organizações religiosas.1  
* **Versões em Português:** Este é o seu maior diferencial. Oferece suporte nativo e robusto para as versões mais importantes em português: **nvi** (Nova Versão Internacional), **ra** (Almeida Revista e Atualizada) e **acf** (Almeida Corrigida Fiel), além de outras como kjv, bbe, rvr e apee.1  
* **Autenticação e Limites:** O modelo é extremamente generoso e favorável ao desenvolvedor. Sem qualquer autenticação, a API permite um número limitado de requisições (20/hora/IP) para testes. Ao se registrar e obter um token de usuário gratuito, as requisições tornam-se ilimitadas, removendo uma barreira significativa para a escalabilidade.18  
* **Endpoints e Estrutura de Dados:** A API é bem documentada, com endpoints intuitivos para buscar a lista de livros (/api/books), um livro específico (/api/books/:abbrev), um capítulo inteiro (/api/verses/:version/:abbrev/:chapter), um versículo específico (/api/verses/:version/:abbrev/:chapter/:number), ou até mesmo versículos aleatórios.19 A resposta JSON é limpa e bem estruturada, facilitando o parsing e a utilização no frontend.1

#### **API.bible (American Bible Society)**

* **Visão Geral:** Uma iniciativa da American Bible Society, esta é uma das APIs mais abrangentes do mundo, com acesso a quase 2500 versões em mais de 1600 idiomas.20 É uma solução de nível empresarial, confiável e bem mantida.  
* **Versões em Português:** A lista de versões imediatamente disponíveis inclui a Biblia Livre Para Todos e a Translation for Translators in Brasilian Portuguese.21 Versões mais populares como a NVI ou ACF podem estar disponíveis, mas provavelmente exigem licenciamento direto com os detentores dos direitos autorais, o que adiciona uma camada de complexidade e custo.21  
* **Autenticação e Limites:** Requer uma chave de API para todas as requisições. O plano gratuito, destinado a uso não comercial, é limitado a 5.000 requisições por dia e um máximo de 500 versículos consecutivos por chamada.21  
* **Endpoints e Estrutura de Dados:** Possui uma documentação extensa e profissional, com endpoints para buscar Bíblias, livros, capítulos, passagens e realizar buscas por palavras-chave.20

#### **bible-api.com**

* **Visão Geral:** Uma API simples, de código aberto e focada na facilidade de uso, que não requer autenticação.  
* **Versões em Português:** Oferece a versão **João Ferreira de Almeida** sob o identificador almeida. A seleção de versões é mais limitada, pois foca em traduções de domínio público ou com licenças livres para evitar complexidades legais.  
* **Autenticação e Limites:** Não há necessidade de chave de API. No entanto, impõe um limite de taxa (rate limit) de 15 requisições a cada 30 segundos por endereço IP para prevenir abusos.  
* **Endpoints e Estrutura de Dados:** Os endpoints são extremamente simples e baseados na própria URL, como https://bible-api.com/joão+3:16?translation=almeida. O JSON de retorno é direto e fácil de consumir.

#### **Bible SuperSearch API**

* **Visão Geral:** Como o nome sugere, sua principal funcionalidade é a busca, mas também permite a recuperação de passagens específicas.23  
* **Versões em Português:** Disponibiliza a Biblia Livre (blivre), Almeida Revista e Atualizada (almeida\_ra) e Almeida Revista e Corrigida (almeida\_rc).23  
* **Autenticação e Limites:** Gratuita para uso não comercial, com um limite de 1.000 acessos por dia.23  
* **Endpoints e Estrutura de Dados:** As requisições são feitas via query strings na URL, como https://api.biblesupersearch.com/api?bible=almeida\_rc\&reference=Rom+4:1-10.23

#### **Soluções Auto-Hospedadas (Self-Hosted)**

* **MaatheusGois/bible:** Este não é uma API, mas um repositório no GitHub que contém os textos completos de várias Bíblias, incluindo acf, nvi, kja e arc em português, organizados em arquivos JSON.24 Um desenvolvedor pode clonar este repositório e construir sua própria API sobre esses dados ou servi-los como arquivos estáticos. A estrutura de diretórios é hierárquica, permitindo acesso a livros, capítulos e versículos específicos através de URLs previsíveis.24  
* **rribeiro1/bible-edge:** Este é um projeto de API completo e pronto para ser implantado, construído com Node.js, Fastify e Prisma.25 Ele já vem com a versão NVI e uma estrutura de banco de dados (PostgreSQL) que pode ser populada com outras versões. Esta opção requer conhecimento em Docker e gerenciamento de servidores.25

### **2.3. Análise Comparativa e Recomendações Estratégicas**

A escolha de uma API não é uma decisão única, mas sim um posicionamento em um espectro que vai da conveniência à soberania total sobre os dados. Em uma extremidade, APIs públicas como bible-api.com oferecem acesso instantâneo sem a necessidade de chaves, mas com menos garantias de serviço e um conjunto limitado de traduções. No centro do espectro, estão as APIs gerenciadas como ABíbliaDigital e API.bible. Elas exigem um registro e uma chave de API, mas em troca oferecem maior estabilidade, mais recursos, documentação profissional e suporte técnico. Na extremidade oposta, a auto-hospedagem, utilizando os dados de repositórios do GitHub como MaatheusGois/bible ou implantando uma API completa como rribeiro1/bible-edge, concede controle absoluto. Com a auto-hospedagem, o desenvolvedor controla o desempenho (eliminando a latência de rede externa), os custos (pagando apenas pela sua própria infraestrutura) e a disponibilidade dos dados. No entanto, essa liberdade vem com a responsabilidade total pela manutenção, segurança, atualizações e escalabilidade da infraestrutura.

Para o projeto em questão, que necessita de uma solução robusta com um forte foco em traduções para o português, a **API da ABíbliaDigital** surge como a recomendação principal. Ela oferece o melhor equilíbrio entre facilidade de uso (API RESTful bem documentada), riqueza de conteúdo em português (incluindo as versões mais populares) e um modelo de custo-benefício imbatível (gratuito e ilimitado com um simples token de usuário).

API.bible é uma alternativa poderosa e de nível mundial, a ser considerada se o projeto evoluir para necessitar de uma gama muito mais ampla de idiomas ou se os requisitos de licenciamento corporativo se tornarem um fator. A auto-hospedagem deve ser reservada para cenários com requisitos muito específicos, como a necessidade de operar em um ambiente completamente offline ou de atingir latências extremamente baixas que só a co-localização dos dados pode oferecer.

#### **Tabela Comparativa de APIs da Bíblia**

| Provedor de API | Versões em Português | Requer Autenticação? | Limites de Uso (Plano Gratuito) | Custo | Complexidade |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **ABíbliaDigital** | NVI, RA, ACF, KJV, etc. | Sim (token gratuito) | Ilimitado com token 18 | Gratuito | Baixa |
| **API.bible** | Biblia Livre, T4T 21 | Sim (chave de API) | 5.000 req/dia 21 | Gratuito (não comercial) | Média |
| **bible-api.com** | Almeida (JFA) | Não | 15 req/30s/IP | Gratuito | Muito Baixa |
| **Bible SuperSearch** | Biblia Livre, RA, RC 23 | Não | 1.000 req/dia 23 | Gratuito (não comercial) | Baixa |
| **Auto-hospedagem** | Depende da fonte (ex: NVI, ACF) 24 | Definido pelo dev. | Depende da infra. | Custo da infra. | Alta |

## **Seção 3: Guias de Implementação para Frameworks Modernos**

Uma vez escolhida a API, o próximo passo é a implementação no frontend. Esta seção fornece guias práticos para integrar a funcionalidade de exibição de versículos em frameworks JavaScript modernos, usando a **API da ABíbliaDigital** como exemplo devido à sua adequação ao caso de uso.

### **3.1. Lógica Fundamental: JavaScript Puro com fetch**

Antes de mergulhar nos frameworks, é essencial entender a lógica base. O seguinte exemplo demonstra como buscar o texto de João 3:16 na versão NVI usando a API fetch nativa do navegador.

JavaScript

const fetchVerse \= async (version, bookAbbrev, chapter, verse) \=\> {  
  try {  
    // Assumindo que um token de autenticação foi obtido e está disponível  
    const authToken \= 'SEU\_TOKEN\_AQUI';   
    const response \= await fetch(  
      \`https://www.abibliadigital.com.br/api/verses/${version}/${bookAbbrev}/${chapter}/${verse}\`,  
      {  
        headers: {  
          'Authorization': \`Bearer ${authToken}\`  
        }  
      }  
    );  
    if (\!response.ok) {  
      throw new Error(\`HTTP error\! status: ${response.status}\`);  
    }  
    const data \= await response.json();  
    console.log(data.text); // Exibe o texto do versículo no console  
    return data;  
  } catch (error) {  
    console.error("Falha ao buscar o versículo:", error);  
  }  
};

// Exemplo de chamada  
fetchVerse('nvi', 'jo', 3, 16);

Este código estabelece o padrão de uma chamada assíncrona que será adaptada para os componentes a seguir.

### **3.2. Construindo um Componente de Versículo em React (\<Versiculo /\>)**

Em React, a abordagem mais idiomática é criar um componente reutilizável que encapsula a lógica de busca e exibição. A combinação com uma biblioteca de tooltips como o Tippy.js proporciona uma experiência de usuário polida.

* **Estrutura do Componente:** Um componente funcional que recebe a referência como props.  
* **Gerenciamento de Estado:** useState é usado para armazenar o texto do versículo, o estado de carregamento (isLoading) e possíveis erros.  
* **Busca de Dados:** useEffect é o hook ideal para disparar a chamada à API quando o componente é montado ou quando suas props (a referência do versículo) mudam.  
* **Interatividade com Tooltip:** A biblioteca @tippyjs/react é uma excelente escolha para criar o pop-up.26 O texto da referência bíblica no site (ex: "João 3:16") será o elemento "target" do Tippy. O conteúdo (  
  content) do tooltip será preenchido dinamicamente com o texto do versículo buscado.

**Exemplo de Código (VerseTooltip.js):**

JavaScript

import React, { useState, useEffect } from 'react';  
import Tippy from '@tippyjs/react';  
import 'tippy.js/dist/tippy.css'; // Importação do CSS padrão do Tippy

const VerseTooltip \= ({ reference, version \= 'nvi' }) \=\> {  
  const \= useState('Carregando...');  
  const \[isLoading, setIsLoading\] \= useState(false);

  // Função para parsear a referência (ex: "Jo 3:16" \-\> { book: 'jo', chapter: '3', verse: '16' })  
  const parseReference \= (ref) \=\> {  
    const parts \= ref.match(/(\\w+)\\s(\\d+):(\\d+)/);  
    if (\!parts) return null;  
    return { book: parts.toLowerCase(), chapter: parts, verse: parts };  
  };

  const fetchVerseData \= async () \=\> {  
    const parsedRef \= parseReference(reference);  
    if (\!parsedRef) {  
      setVerseText('Referência inválida');  
      return;  
    }

    setIsLoading(true);  
    try {  
      const authToken \= 'SEU\_TOKEN\_AQUI';  
      const { book, chapter, verse } \= parsedRef;  
      const response \= await fetch(  
        \`https://www.abibliadigital.com.br/api/verses/${version}/${book}/${chapter}/${verse}\`,  
        { headers: { 'Authorization': \`Bearer ${authToken}\` } }  
      );  
      const data \= await response.json();  
      setVerseText(data.text);  
    } catch (error) {  
      setVerseText('Falha ao carregar o versículo.');  
      console.error(error);  
    } finally {  
      setIsLoading(false);  
    }  
  };

  return (  
    \<Tippy   
      content\={verseText}   
      onShow\={fetchVerseData} // Busca os dados apenas quando o tooltip está prestes a ser exibido  
      interactive\={true}  
      placement\="top"  
    \>  
      \<span style\={{ textDecoration: 'underline', cursor: 'pointer' }}\>  
        {reference}  
      \</span\>  
    \</Tippy\>  
  );  
};

export default VerseTooltip;

### **3.3. Construindo um Componente de Versículo em Vue.js (\<Versiculo /\>)**

Em Vue.js, a abordagem com Componentes de Arquivo Único (.vue) e a Composition API é moderna e eficiente.28

* **Estrutura do Componente:** Um arquivo .vue com as seções \<template\>, \<script setup\> e \<style\>.  
* **Lógica Reativa:** A referência é recebida como uma prop. ref da Composition API é usado para gerenciar o estado do texto do versículo e do carregamento. A lógica de busca pode ser acionada no hook onMounted ou, para maior reatividade, dentro de um watchEffect.  
* **Interatividade com Pop-up:** Bibliotecas de componentes como PrimeVue 30 ou Vuetify oferecem componentes de  
  Tooltip ou OverlayPanel prontos para uso, que podem ser facilmente integrados.

**Exemplo de Código (VersePopup.vue):**

Snippet de código

\<template\>  
  \<span   
    @mouseenter="showPopup"   
    @mouseleave="hidePopup"   
    style="text-decoration: underline; cursor: pointer;"  
  \>  
    {{ reference }}  
    \<div v-if="isPopupVisible" class="verse-popup"\>  
      \<p\>{{ verseText }}\</p\>  
    \</div\>  
  \</span\>  
\</template\>

\<script setup\>  
import { ref } from 'vue';

const props \= defineProps({  
  reference: {  
    type: String,  
    required: true  
  },  
  version: {  
    type: String,  
    default: 'nvi'  
  }  
});

const verseText \= ref('Carregando...');  
const isPopupVisible \= ref(false);  
let hasFetched \= false; // Evita buscas repetidas

const parseReference \= (ref) \=\> {  
  const parts \= ref.match(/(\\w+)\\s(\\d+):(\\d+)/);  
  if (\!parts) return null;  
  return { book: parts.toLowerCase(), chapter: parts, verse: parts };  
};

const fetchVerseData \= async () \=\> {  
  if (hasFetched) return;  
    
  const parsedRef \= parseReference(props.reference);  
  if (\!parsedRef) {  
    verseText.value \= 'Referência inválida';  
    return;  
  }

  try {  
    const authToken \= 'SEU\_TOKEN\_AQUI';  
    const { book, chapter, verse } \= parsedRef;  
    const response \= await fetch(  
      \`https://www.abibliadigital.com.br/api/verses/${props.version}/${book}/${chapter}/${verse}\`,  
      { headers: { 'Authorization': \`Bearer ${authToken}\` } }  
    );  
    const data \= await response.json();  
    verseText.value \= data.text;  
    hasFetched \= true;  
  } catch (error) {  
    verseText.value \= 'Falha ao carregar o versículo.';  
    console.error(error);  
  }  
};

const showPopup \= () \=\> {  
  isPopupVisible.value \= true;  
  fetchVerseData();  
};

const hidePopup \= () \=\> {  
  isPopupVisible.value \= false;  
};  
\</script\>

\<style scoped\>  
.verse-popup {  
  position: absolute;  
  background-color: \#333;  
  color: white;  
  padding: 10px;  
  border-radius: 5px;  
  z-index: 100;  
  max-width: 300px;  
  box-shadow: 0 2px 10px rgba(0,0,0,0.5);  
}  
\</style\>

### **3.4. Construindo uma Diretiva de Versículo em Angular (\[bibleVerse\])**

Angular oferece um padrão poderoso para este caso de uso através de diretivas de atributo customizadas. Isso permite adicionar o comportamento de pop-up a qualquer elemento HTML de forma declarativa.

* **Estrutura:** Uma diretiva de atributo criada com o Angular CLI (ng generate directive bibleVerse).31  
* **Lógica e Injeção de Dependência:** A diretiva injeta o HttpClient para fazer as chamadas à API, ElementRef para obter uma referência ao elemento hospedeiro, e o Overlay do Angular CDK para criar o pop-up de forma dinâmica e posicioná-lo corretamente.32  
* **Interatividade:** @HostListener é usado para escutar os eventos de mouseenter e mouseleave no elemento hospedeiro. No mouseenter, a diretiva chama um serviço para buscar os dados e usa o Overlay para criar e exibir um componente de tooltip. No mouseleave, o overlay é destruído. Esta abordagem é altamente eficiente e reutilizável.

**Exemplo de Código (Simplificado):**

**Diretiva (bible-verse.directive.ts):**

TypeScript

import { Directive, ElementRef, HostListener, Input } from '@angular/core';  
import { Overlay, OverlayRef } from '@angular/cdk/overlay';  
import { ComponentPortal } from '@angular/cdk/portal';  
import { VerseTooltipComponent } from './verse-tooltip.component'; // Componente do tooltip

@Directive({  
  selector: '\[bibleVerse\]'  
})  
export class BibleVerseDirective {  
  @Input('bibleVerse') reference: string;  
  private overlayRef: OverlayRef;

  constructor(  
    private overlay: Overlay,  
    private elementRef: ElementRef  
  ) {}

  @HostListener('mouseenter')  
  show() {  
    const positionStrategy \= this.overlay.position()  
     .flexibleConnectedTo(this.elementRef)  
     .withPositions(\[{  
        originX: 'center',  
        originY: 'top',  
        overlayX: 'center',  
        overlayY: 'bottom',  
      }\]);

    this.overlayRef \= this.overlay.create({ positionStrategy });  
    const tooltipPortal \= new ComponentPortal(VerseTooltipComponent);  
    const tooltipRef \= this.overlayRef.attach(tooltipPortal);  
      
    // Passa a referência para o componente do tooltip  
    tooltipRef.instance.reference \= this.reference;  
  }

  @HostListener('mouseleave')  
  hide() {  
    if (this.overlayRef) {  
      this.overlayRef.dispose();  
    }  
  }  
}

Este exemplo requer a criação de um VerseTooltipComponent separado que contém a lógica de busca de dados e o template do pop-up, de forma similar aos exemplos de React e Vue. A diretiva atua como o orquestrador que controla quando e onde o tooltip aparece.

## **Seção 4: Considerações Críticas: Licenciamento, Direitos Autorais e Termos de Uso**

A implementação técnica é apenas uma parte da equação. Uma consideração igualmente, se não mais, importante é a legalidade do uso do conteúdo bíblico. Ignorar os direitos autorais e os termos de serviço pode levar a complicações legais e à necessidade de refazer partes significativas do projeto.

### **4.1. O Cenário dos Direitos Autorais de Traduções Bíblicas**

É um equívoco comum pensar que a Bíblia, por ser um texto antigo e religioso, está inteiramente em domínio público. A realidade jurídica é mais complexa. Enquanto os textos originais em hebraico, aramaico e grego estão, de fato, em domínio público, *cada tradução é considerada uma obra literária original e distinta*. Como tal, ela é protegida pelas leis de direitos autorais, da mesma forma que qualquer outro livro ou obra criativa.34

O processo de tradução da Bíblia é um empreendimento acadêmico e financeiro substancial. Envolve equipes de teólogos, linguistas, estudiosos, revisores e editores que trabalham por anos para produzir uma versão precisa e legível. As editoras e sociedades bíblicas que financiam esses projetos utilizam os direitos autorais para proteger seu investimento, financiar a impressão e distribuição, e subsidiar novas traduções e trabalhos missionários.35

A implicação direta para um desenvolvedor é clara: não é permitido simplesmente copiar e colar o texto de uma tradução moderna, como a Nova Versão Internacional (NVI) ou a Almeida Corrigida Fiel (ACF), e publicá-lo em um site ou aplicativo sem a devida permissão. O uso de uma API ou de um widget licenciado é, na prática, uma forma de obter uma *licença de exibição* para esse conteúdo, e os termos dessa licença devem ser rigorosamente observados.

### **4.2. Análise de Licenciamento para Versões Chave em Português**

* **Almeida Corrigida Fiel (ACF):** Esta versão é publicada e mantida pela **Sociedade Bíblica Trinitariana do Brasil (SBTB)**.36 Uma análise de seus canais oficiais não revela uma página explícita de "Termos de Uso" para o uso digital em massa de seu texto. A licença de uma imagem da capa na Wikipedia é Creative Commons, mas isso é irrelevante para o texto em si.38 A ausência de termos claros para uso digital sugere uma política mais restritiva. Para qualquer uso que vá além da citação breve, especialmente em um contexto comercial, a abordagem prudente seria contatar diretamente a SBTB para obter esclarecimentos sobre o licenciamento.  
* **Nova Versão Internacional (NVI):** Os direitos autorais globais da NVI pertencem à **Biblica, Inc.** (anteriormente conhecida como International Bible Society).35 Historicamente, o uso da NVI é rigidamente controlado. Os termos de uso de sites que a utilizam, como o  
  abiblianvi.com.br, proíbem explicitamente o uso comercial, a modificação ou a redistribuição dos materiais.40 A própria YouVersion, uma das maiores distribuidoras digitais da Bíblia, afirma que, embora forneça acesso às versões, os usuários finais devem verificar com cada editora as regras específicas de uso para seus próprios projetos. Isso confirma que o uso da NVI requer uma licença explícita para quase todos os casos, exceto a citação pessoal ou o uso dentro das plataformas licenciadas.

### **4.3. Análise dos Termos de Serviço das APIs**

Os Termos de Serviço (ToS) de uma API funcionam como uma camada de licenciamento sobre os direitos autorais da tradução. O desenvolvedor deve aderir a ambos.

* **ABíbliaDigital:** A política de uso justo (Fair use policy) do projeto o descreve como uma ferramenta educacional e gratuita.18 Isso é excelente para projetos não comerciais ou de pequeno porte. No entanto, os ToS não detalham os acordos de licenciamento que eles possuem com os detentores dos direitos das traduções que oferecem (como a Biblica para a NVI). Para um projeto comercial, torna-se crucial contatar o mantenedor da API para esclarecer o escopo da licença que eles podem sublicenciar.  
* **API.bible:** Seus termos são muito claros e alinhados com as práticas da indústria. O uso da API é explicitamente para fins não comerciais.20 Eles gerenciam os acordos de direitos com os editores e exigem que a atribuição de direitos autorais seja exibida corretamente na aplicação do desenvolvedor. Para qualquer uso comercial, é mandatório entrar em contato para discutir opções de licenciamento.22  
* **bible-api.com:** Esta API contorna a complexidade do licenciamento ao focar primariamente em traduções que já estão em domínio público (como a King James Version) ou que possuem licenças explicitamente livres. Isso a torna uma opção legalmente muito mais simples, embora com um repertório de traduções modernas mais limitado.

### **4.4. Licenças de Código Aberto (MIT, BSD, etc.)**

É fundamental entender a diferença entre a licença do software e a licença do conteúdo. Repositórios no GitHub como MaatheusGois/bible são distribuídos sob licenças de código aberto como a MIT.24 Essa licença se aplica ao

*código do software* que organiza ou apresenta os dados, permitindo que outros desenvolvedores o usem, modifiquem e distribuam livremente.

No entanto, a licença MIT **não se aplica ao conteúdo de dados em si** – neste caso, os arquivos JSON contendo os textos bíblicos. Os textos podem ter sido compilados de fontes que não permitem redistribuição. O desenvolvedor que utiliza esses dados é o responsável final por verificar a origem e os direitos autorais dos textos bíblicos contidos nesses repositórios antes de usá-los em um projeto público, especialmente um comercial.

## **Conclusão e Recomendações Finais**

A tarefa de integrar referências bíblicas interativas em um site envolve uma decisão arquitetônica fundamental entre a simplicidade dos widgets do lado do cliente e a flexibilidade das APIs do lado do servidor. A análise detalhada revela que a escolha ideal depende criticamente dos requisitos específicos do projeto, dos recursos técnicos disponíveis e, acima de tudo, das considerações de licenciamento.

### **Sumário dos Achados**

As **soluções do lado do cliente**, como os widgets de auto-linking, oferecem uma implementação quase instantânea. Com a simples adição de um script, elas podem escanear e enriquecer uma página inteira. No entanto, essa facilidade vem ao custo do controle sobre a aparência, o desempenho e a seleção de conteúdo, além de criar uma dependência de um serviço de terceiros que pode ser alterado ou descontinuado.

As **soluções baseadas em API**, por outro lado, proporcionam controle granular total. Elas permitem que o desenvolvedor crie uma experiência de usuário perfeitamente integrada ao design do site, otimize o desempenho e escolha exatamente quais dados exibir. Essa flexibilidade exige um maior investimento em desenvolvimento, tanto no frontend para construir os componentes interativos quanto, potencialmente, no backend para gerenciar as chamadas à API.

### **Recomendação Estratificada**

Com base na análise abrangente, a seguinte orientação estratificada é proposta:

1. **A Solução Mais Rápida e Fácil:** Para uma implementação imediata que requer mínimo esforço técnico e possui excelente suporte para o idioma português, o **MyOwnBible Embed Script** é a melhor opção. Sua facilidade de instalação, combinada com opções de personalização robustas e suporte nativo ao português, o torna ideal para blogs, protótipos ou sites com prazos apertados.9  
2. **A Solução Mais Balanceada e Recomendada:** Para um projeto web sério que busca um equilíbrio entre controle, flexibilidade e esforço de desenvolvimento, a **API da ABíbliaDigital** é a escolha ideal e a principal recomendação deste relatório. Ela se destaca por oferecer as versões mais populares em português (NVI, ACF, RA), um modelo de uso gratuito extremamente generoso que suporta a escalabilidade, e uma API RESTful bem documentada e fácil de consumir. Representa o ponto ótimo para a maioria dos projetos focados no público brasileiro.  
3. **A Solução Mais Flexível (e Complexa):** Para projetos que exigem controle absoluto sobre os dados, desempenho otimizado para operação offline, ou a necessidade de usar traduções não disponíveis em outras APIs, a **auto-hospedagem** é a abordagem mais poderosa. Isso pode ser alcançado construindo uma API customizada sobre os dados JSON do repositório MaatheusGois/bible 24 e, potencialmente, utilizando o código-fonte de projetos como  
   rribeiro1/bible-edge 25 como base. Esta rota transfere toda a responsabilidade de manutenção, segurança e infraestrutura para o desenvolvedor e só deve ser considerada se os benefícios do controle total superarem a complexidade adicional.

### **Aviso Final sobre Licenciamento**

Independentemente da solução técnica escolhida, a questão do licenciamento permanece primordial. É imperativo que o desenvolvedor realize sua própria diligência legal, especialmente se o site ou aplicação tiver qualquer propósito comercial. Recomenda-se fortemente a exibição clara dos avisos de direitos autorais para a tradução bíblica utilizada (ex: "Nova Versão Internacional, Copyright © 1999, 2015 by Biblica, Inc.®"), conforme exigido pela maioria dos provedores de conteúdo e detentores de direitos autorais. A conformidade não apenas evita problemas legais, mas também honra o trabalho e o ministério por trás da disponibilização das Escrituras.

#### **Referências citadas**

1. RESTful API da Bíblia: ABíbliaDigital, acessado em junho 20, 2025, [https://www.abibliadigital.com.br/](https://www.abibliadigital.com.br/)  
2. bible-api.com, acessado em junho 20, 2025, [https://bible-api.com/](https://bible-api.com/)  
3. Perguntas frequentes sobre direitos autorais (FAQ) \- HelpDocs, acessado em junho 20, 2025, [https://help.youversion.com/l/pt/article/o8t2xmy9q2-informa-es-sobre-direitos-autorais-de-planos-e-vers-es-da-b-blia](https://help.youversion.com/l/pt/article/o8t2xmy9q2-informa-es-sobre-direitos-autorais-de-planos-e-vers-es-da-b-blia)  
4. With the Global Bible Widget you can add a variety of tools to your website or blog that will enhance your readers' experience on your site. \- Bibles.org, acessado em junho 20, 2025, [https://bibles.org/widget](https://bibles.org/widget)  
5. RcVCite \- Pop-up Bible Verses on Mouse-over, acessado em junho 20, 2025, [http://rcvcite.net/](http://rcvcite.net/)  
6. Documentation | BibleLink, acessado em junho 20, 2025, [https://bible-link.com/documentation/](https://bible-link.com/documentation/)  
7. Embed RefTagger to instantly hyperlink Scripture references ..., acessado em junho 20, 2025, [http://help.pathwright.com/en/articles/2004065-embed-reftagger-to-instantly-hyperlink-scripture-references](http://help.pathwright.com/en/articles/2004065-embed-reftagger-to-instantly-hyperlink-scripture-references)  
8. MyOwnBible, acessado em junho 20, 2025, [https://www.myownbible.app/](https://www.myownbible.app/)  
9. Ready to Embed MyOwnBible?, acessado em junho 20, 2025, [https://www.myownbible.app/embed](https://www.myownbible.app/embed)  
10. MyOwnBible on the App Store, acessado em junho 20, 2025, [https://apps.apple.com/us/app/myownbible/id1501263507](https://apps.apple.com/us/app/myownbible/id1501263507)  
11. Frequently Asked Questions \- MyOwnBible, acessado em junho 20, 2025, [https://www.myownbible.app/faqs](https://www.myownbible.app/faqs)  
12. MyOwnBible on the App Store, acessado em junho 20, 2025, [https://apps.apple.com/jo/app/myownbible/id1501263507](https://apps.apple.com/jo/app/myownbible/id1501263507)  
13. Bible Verse Preview Tools: Ref Tag Vs Open Source RefTagger Plugin \- Church Tech Today, acessado em junho 20, 2025, [https://churchtechtoday.com/bible-verse-preview-wordpress-plugin/](https://churchtechtoday.com/bible-verse-preview-wordpress-plugin/)  
14. Convert Bible References into Links | Logos Reftagger \- Logos Bible Software, acessado em junho 20, 2025, [https://www.logos.com/reftagger](https://www.logos.com/reftagger)  
15. Extensions catégorisées comme bible | WordPress.org Français du Canada, acessado em junho 20, 2025, [https://fr-ca.wordpress.org/plugins/tags/bible/](https://fr-ca.wordpress.org/plugins/tags/bible/)  
16. Free Bible Widget for your Website or Blog, acessado em junho 20, 2025, [https://get.bible/free-bible-widget-for-your-website-or-blog/](https://get.bible/free-bible-widget-for-your-website-or-blog/)  
17. ABíbliaDigital | A RESTful API for Bible, acessado em junho 20, 2025, [https://www.abibliadigital.com.br/en](https://www.abibliadigital.com.br/en)  
18. omarciovsena/abibliadigital: A RESTful API for Bible \- GitHub, acessado em junho 20, 2025, [https://github.com/omarciovsena/abibliadigital](https://github.com/omarciovsena/abibliadigital)  
19. abibliadigital/DOCUMENTATION.md at master \- GitHub, acessado em junho 20, 2025, [https://github.com/omarciovsena/abibliadigital/blob/master/DOCUMENTATION.md](https://github.com/omarciovsena/abibliadigital/blob/master/DOCUMENTATION.md)  
20. API.Bible API, acessado em junho 20, 2025, [https://scripture.api.bible/](https://scripture.api.bible/)  
21. Bibles | API.bible Documentation, acessado em junho 20, 2025, [https://docs.api.bible/guides/bibles/](https://docs.api.bible/guides/bibles/)  
22. API.Bible, acessado em junho 20, 2025, [https://portal.dev.api.bible/](https://portal.dev.api.bible/)  
23. Bible SuperSearch API, acessado em junho 20, 2025, [https://api.biblesupersearch.com/](https://api.biblesupersearch.com/)  
24. MaatheusGois/bible: Bible API in JSON \- GitHub, acessado em junho 20, 2025, [https://github.com/MaatheusGois/bible](https://github.com/MaatheusGois/bible)  
25. rribeiro1/bible-edge: API da Bíblia Sagrada na versão NVI ... \- GitHub, acessado em junho 20, 2025, [https://github.com/rribeiro1/bible-edge](https://github.com/rribeiro1/bible-edge)  
26. Top 6 React Tooltip Libraries to Inform and Educate Users \- UserGuiding, acessado em junho 20, 2025, [https://userguiding.com/blog/react-tooltip](https://userguiding.com/blog/react-tooltip)  
27. atomiks/tippyjs-react: React component for Tippy.js (official) \- GitHub, acessado em junho 20, 2025, [https://github.com/atomiks/tippyjs-react](https://github.com/atomiks/tippyjs-react)  
28. God's Vue: An immersive tale (Chapter 1\) \- DEV Community, acessado em junho 20, 2025, [https://dev.to/zain725342/gods-vue-an-immersive-tale-chapter-1-1gfl](https://dev.to/zain725342/gods-vue-an-immersive-tale-chapter-1-1gfl)  
29. Components Basics | Vue.js, acessado em junho 20, 2025, [https://vuejs.org/guide/essentials/component-basics](https://vuejs.org/guide/essentials/component-basics)  
30. A curated list of awesome things related to Vue.js \- GitHub, acessado em junho 20, 2025, [https://github.com/vuejs/awesome-vue](https://github.com/vuejs/awesome-vue)  
31. Attribute directives \- Angular, acessado em junho 20, 2025, [https://angular.dev/guide/directives/attribute-directives](https://angular.dev/guide/directives/attribute-directives)  
32. Built-in directives \- Angular, acessado em junho 20, 2025, [https://v17.angular.io/guide/built-in-directives](https://v17.angular.io/guide/built-in-directives)  
33. PatrickJS/awesome-angular: :page\_facing\_up \- GitHub, acessado em junho 20, 2025, [https://github.com/PatrickJS/awesome-angular](https://github.com/PatrickJS/awesome-angular)  
34. Quem detém os direitos autorais da Bíblia? : r/COPYRIGHT \- Reddit, acessado em junho 20, 2025, [https://www.reddit.com/r/COPYRIGHT/comments/1dnypzm/who\_has\_copyright\_over\_the\_bible/?tl=pt-br](https://www.reddit.com/r/COPYRIGHT/comments/1dnypzm/who_has_copyright_over_the_bible/?tl=pt-br)  
35. Qual sua opinião sobre direitos autorais da Bíblia? \- Reddit, acessado em junho 20, 2025, [https://www.reddit.com/r/Bible/comments/1h7qd6f/whats\_your\_thought\_on\_bible\_copyright/?tl=pt-br](https://www.reddit.com/r/Bible/comments/1h7qd6f/whats_your_thought_on_bible_copyright/?tl=pt-br)  
36. Almeida Corrigida Fiel – Wikipédia, a enciclopédia livre, acessado em junho 20, 2025, [https://pt.wikipedia.org/wiki/Almeida\_Corrigida\_Fiel](https://pt.wikipedia.org/wiki/Almeida_Corrigida_Fiel)  
37. Sociedade Bíblica Trinitariana do Brasil, acessado em junho 20, 2025, [https://www.biblias.com.br/](https://www.biblias.com.br/)  
38. Ficheiro:Biblia ACF Classic.jpg – Wikipédia, a enciclopédia livre, acessado em junho 20, 2025, [https://pt.m.wikipedia.org/wiki/Ficheiro:Biblia\_ACF\_Classic.jpg](https://pt.m.wikipedia.org/wiki/Ficheiro:Biblia_ACF_Classic.jpg)  
39. A Situação Inclusiva da NVI: Reflexões um Ano Depois \- CBE International, acessado em junho 20, 2025, [https://www.cbeinternational.org/pt/recurso/situa%C3%A7%C3%A3o-niv-inclusiva/](https://www.cbeinternational.org/pt/recurso/situa%C3%A7%C3%A3o-niv-inclusiva/)  
40. Termos de Uso \- A Bíblia NVI, acessado em junho 20, 2025, [https://abiblianvi.com.br/pagina/termos](https://abiblianvi.com.br/pagina/termos)