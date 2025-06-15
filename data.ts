// data.ts
// Este arquivo é responsável por:
// 1. Importar dados de perfis (`characterProfiles.ts`) e cronologias (`characterTimings.ts`) dos personagens.
// 2. Mesclar esses dados em um único array `peopleData`.
// 3. Definir os dados dos eventos bíblicos (`eventsData`).
// 4. Calcular os anos de morte (`deathYear`) para os personagens, se não estiverem definidos mas `birthYear` e `totalLifespan` estiverem.

import { Person, BibleEvent } from './types';
import { characterProfiles } from './characterProfiles'; // Importa os perfis dos personagens
import { characterTimings } from './characterTimings';   // Importa os dados cronológicos dos personagens

// Mescla os dados de perfis e cronologias dos personagens.
// O objetivo é ter um objeto Person completo para cada indivíduo.
const mergedPeopleData: Person[] = characterProfiles.map(profile => {
  // Encontra os dados cronológicos correspondentes para o perfil atual.
  const timing = characterTimings.find(t => t.id === profile.id);
  
  // Começa com os dados do perfil, que contém a maioria das informações descritivas e relacionais.
  const person: Person = { ...profile };
  // Se dados cronológicos correspondentes forem encontrados (em characterTimings),
  // eles são adicionados ou sobrescrevem os campos de tempo no objeto `person`.
  if (timing) {
    if (timing.birthYear !== undefined) {
      person.birthYear = timing.birthYear;
    }
    if (timing.ageAtParenthood !== undefined) {
      person.ageAtParenthood = timing.ageAtParenthood;
    }
    if (timing.totalLifespan !== undefined) {
      person.totalLifespan = timing.totalLifespan;
    }
  }
  // Nota: Se um ID de `characterProfiles` não existir em `characterTimings`,
  // os campos de tempo podem permanecer `undefined`. A lógica da timeline
  // precisa lidar com isso, especialmente a ausência de `birthYear`.
  // Atualmente, `CharacterTiming` requer `birthYear`, o que minimiza esse risco.

  return person;
});

// Verificação adicional (opcional): Adiciona pessoas de characterTimings que podem não estar em characterProfiles.
// Isso é improvável no design atual, mas adiciona robustez.
characterTimings.forEach(timing => {
  if (!mergedPeopleData.some(p => p.id === timing.id)) {
    // Se uma pessoa só tem dados de tempo, um objeto Person mínimo seria criado.
    // Isso exigiria que 'name' fosse opcional em Person ou que characterTimings também tivesse 'name'.
    // Para o escopo atual, assume-se que characterProfiles é a lista mestre de IDs e nomes.
    console.warn(`Dados cronológicos encontrados para ID "${timing.id}" mas não há dados de perfil. Pulando esta entrada.`);
  }
});

// Exporta o array `peopleData` final, já mesclado.
export const peopleData: Person[] = [...mergedPeopleData];


// Definição dos dados dos eventos bíblicos.
// Estes podem ser movidos para um arquivo separado (`eventsData.ts`) se a lista crescer muito.
export const eventsData: BibleEvent[] = [
  { id: 'creation', name: 'Criação', year: peopleData.find(p=>p.id==='adam')?.birthYear ?? 0, description: 'Deus cria o universo e a vida, culminando com a criação de Adão e Eva.', characterIds: ['adam'], genesisChapter: '1-2', category: 'principal' },
  { id: 'fall', name: 'A Queda', year: (peopleData.find(p=>p.id==='adam')?.birthYear ?? 0) + 1 /* Ano simbólico logo após a criação */, description: 'Adão e Eva desobedecem a Deus ao comerem do fruto proibido, resultando na expulsão do Jardim do Éden e na entrada do pecado no mundo.', characterIds: ['adam'], genesisChapter: '3', category: 'principal' },
  { id: 'cain_murders_abel', name: 'Caim Mata Abel', year: (peopleData.find(p=>p.id==='adam')?.birthYear ?? 0) + 30 /* Estimativa, antes do nascimento de Sete (Adão com 130) */, description: 'Caim, movido por inveja da aceitação da oferta de Abel por Deus, mata seu irmão. Este é o primeiro assassinato registrado.', characterIds: ['cain_adam_child', 'abel_adam_child', 'adam'], genesisChapter: '4', category: 'secundario'},
  { id: 'flood', name: 'O Dilúvio', year: (peopleData.find(p=>p.id==='noe_lameque_child')?.birthYear ?? 0) + 600 /* Noé tinha 600 anos quando o dilúvio começou */, description: 'Devido à grande corrupção da humanidade, Deus envia um dilúvio global para purificar a Terra, salvando Noé, sua família e pares de animais na arca.', characterIds: ['noe_lameque_child', 'sem_noe_child', 'cam_noe_child', 'jafe_noe_child'], genesisChapter: '6-9', category: 'principal' },
  { id: 'tower_babel', name: 'Torre de Babel', year: (peopleData.find(p=>p.id==='pelegue_eber_child')?.birthYear ?? 0) - 50 /* Estimativa, durante a vida de Pelegue ("divisão"), antes do seu nascimento ou no início da vida. O ano relativo aqui precisa de ajuste para ser consistente com Pelegue_BY */, description: 'Após o Dilúvio, a humanidade unida tenta construir uma torre que alcance os céus. Deus confunde suas línguas, resultando na dispersão dos povos pela Terra.', characterIds:[], genesisChapter: '11', category: 'secundario'},
  { id: 'covenant_abraham', name: 'Pacto com Abraão', year: (peopleData.find(p=>p.id==='abraao_tera_child')?.birthYear ?? 0) + 75 /* Abraão tinha 75 anos quando Deus o chamou */, description: 'Deus chama Abrão (posteriormente Abraão) de Ur dos Caldeus, ordena que vá para uma terra que Ele lhe mostraria (Canaã) e estabelece um pacto, prometendo-lhe uma grande descendência e que seria uma bênção para todas as nações.', characterIds: ['abraao_tera_child'], genesisChapter: '12, 15, 17', category: 'principal' },
  { id: 'sodom_gomorrah', name: 'Destruição de Sodoma e Gomorra', year: (peopleData.find(p=>p.id==='abraao_tera_child')?.birthYear ?? 0) + 99 /* Pouco antes do nascimento de Isaque (Abraão com 99/100) */, description: 'As cidades de Sodoma e Gomorra são destruídas por Deus devido à sua grande perversidade. Ló, sobrinho de Abraão, e suas filhas são salvos.', characterIds: ['abraao_tera_child', 'lo_hara_filho'], genesisChapter: '18-19', category: 'secundario'},
  { id: 'birth_isaac', name: 'Nascimento de Isaque', year: peopleData.find(p=>p.id==='isaque_abraao_child')?.birthYear!, description: 'Isaque, o filho da promessa, nasce de Abraão e Sara em sua velhice, cumprindo a promessa de Deus.', characterIds: ['abraao_tera_child', 'sarai_abraao_esposa', 'isaque_abraao_child'], genesisChapter: '21', category: 'principal' },
  { id: 'sacrifice_isaac', name: 'Quase-Sacrifício de Isaque', year: (peopleData.find(p=>p.id==='isaque_abraao_child')?.birthYear ?? 0) + 15 /* Estimativa (Isaque jovem, entre 13-17 anos, ou mais) */, description: 'Deus testa a fé de Abraão ordenando que ele sacrifique seu filho Isaque no monte Moriá. No último momento, Deus provê um carneiro para o sacrifício.', characterIds:['abraao_tera_child', 'isaque_abraao_child'], genesisChapter: '22', category: 'principal'},
  { id: 'jacob_blessing', name: 'Jacó Recebe a Bênção de Isaque', year: (peopleData.find(p=>p.id==='jaco_isaque_child')?.birthYear ?? 0) + 77 /* Estimativa: Isaque com ~137, Jacó e Esaú com ~77 */, description: 'Jacó, com a ajuda de sua mãe Rebeca, engana seu pai cego Isaque e recebe a bênção da primogenitura que pertencia a Esaú.', characterIds: ['jaco_isaque_child', 'esau_isaque_child', 'isaque_abraao_child', 'rebeca_betuel_filha'], genesisChapter: '27', category: 'secundario'},
  { id: 'jacob_ladder', name: 'Escada de Jacó (Sonho em Betel)', year: (peopleData.find(p=>p.id==='jaco_isaque_child')?.birthYear ?? 0) + 77 /* Durante sua fuga para Harã, após receber a bênção */, description: 'Fugindo de Esaú, Jacó tem um sonho em Betel com uma escada que alcançava os céus, com anjos subindo e descendo. Deus renova o pacto abraâmico com ele.', characterIds:['jaco_isaque_child'], genesisChapter: '28', category: 'secundario'},
  { id: 'jacob_wrestles', name: 'Jacó Luta com Deus (Peniel)', year: (peopleData.find(p=>p.id==='jaco_isaque_child')?.birthYear ?? 0) + 97 /* Após 20 anos em Harã, ao retornar para Canaã */, description: 'Na véspera de reencontrar Esaú, Jacó luta com um ser divino (identificado como Deus ou um anjo) em Peniel e tem seu nome mudado para Israel.', characterIds:['jaco_isaque_child'], genesisChapter: '32', category: 'principal'},
  { id: 'joseph_sold', name: 'José Vendido pelos Irmãos', year: (peopleData.find(p=>p.id==='jose_jaco_raquel_filho')?.birthYear ?? 0) + 17 /* José tinha 17 anos */, description: 'José, filho favorito de Jacó, é vendido como escravo por seus irmãos ciumentos e levado ao Egito.', characterIds:['jose_jaco_raquel_filho', 'ruben_jaco_lia_filho', 'juda_jaco_lia_filho', /* outros irmãos de José */], genesisChapter: '37', category: 'principal'},
  { id: 'joseph_governor', name: 'José se torna Governador do Egito', year: (peopleData.find(p=>p.id==='jose_jaco_raquel_filho')?.birthYear ?? 0) + 30 /* José tinha 30 anos */, description: 'Após interpretar os sonhos do Faraó, José é nomeado governador do Egito, encarregado de preparar o país para sete anos de fome.', characterIds:['jose_jaco_raquel_filho'], genesisChapter: '41', category: 'principal'},
  { id: 'jacob_moves_to_egypt', name: 'Jacó e Família se Mudam para o Egito', year: (peopleData.find(p=>p.id==='jaco_isaque_child')?.birthYear ?? 0) + 130 /* Jacó tinha 130 anos ao se apresentar ao Faraó */, description: 'Durante a fome, Jacó e toda a sua família (cerca de 70 pessoas) se mudam para o Egito a convite de José, estabelecendo-se na terra de Gósen.', characterIds:['jaco_isaque_child', 'jose_jaco_raquel_filho', /* todos os filhos de Jacó */], genesisChapter: '46-47', category: 'principal'},
];

// Calcula os anos de morte (`deathYear`) para os personagens.
// Este passo é crucial e deve ser feito após a mesclagem completa dos dados de `peopleData`.
peopleData.forEach(p => {
  // Se `deathYear` não está definido, mas `birthYear` e `totalLifespan` estão, calcula-se `deathYear`.
  if (p.birthYear !== undefined && p.totalLifespan !== undefined && p.deathYear === undefined) {
    p.deathYear = p.birthYear + p.totalLifespan;
  }
  // Nota: Se `birthYear` ou `totalLifespan` (ou ambos) forem `undefined`, `deathYear` permanecerá `undefined`
  // a menos que já tenha sido fornecido diretamente nos arquivos de dados.
});