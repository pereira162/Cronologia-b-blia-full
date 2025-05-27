// characterProfiles.ts
// Este arquivo armazena os dados de perfil dos personagens bíblicos,
// como nome, significado do nome, descrição, referências bíblicas e relações familiares (IDs).
// Não contém dados cronológicos detalhados como ano de nascimento exato ou tempo de vida,
// que são gerenciados em `characterTimings.ts`.
// Estes dados são combinados com `characterTimings.ts` em `data.ts` para formar o array `peopleData` completo.

import { Person } from './types';

// Define o tipo para os perfis de personagens.
// Usamos `Omit` para indicar que certos campos (principalmente de tempo) não são primariamente definidos aqui,
// mas a estrutura `Person` é mantida para facilitar a mesclagem.
// Os campos de tempo (`birthYear`, `ageAtParenthood`, `totalLifespan`, `deathYear`)
// são declarados como opcionais aqui, pois serão preenchidos/sobrescritos a partir de `characterTimings.ts`.
type CharacterProfileData = Omit<Person, 'birthYear' | 'ageAtParenthood' | 'totalLifespan' | 'deathYear'> & {
  birthYear?: number; // Opcional aqui, pois virá de characterTimings
  ageAtParenthood?: number; // Opcional aqui
  totalLifespan?: number; // Opcional aqui
  deathYear?: number; // Opcional aqui
};

// Array contendo os perfis dos personagens.
export const characterProfiles: CharacterProfileData[] = [
  // Adão e descendentes diretos até Noé
  { 
    id: 'adam', 
    name: 'Adão', 
    nameMeaning: "Homem, Humanidade", 
    description: "O primeiro homem criado por Deus, conforme a narrativa bíblica.", 
    bibleReference: 'Gênesis 1-5', 
    childrenIds: ['seth_adam_child', 'cain_adam_child', 'abel_adam_child'], 
    keyEventIds: ['creation', 'fall'], 
    isCovenantLine: true // Indica que Adão faz parte da linha principal do pacto.
  },
  { 
    id: 'seth_adam_child', 
    name: 'Sete', 
    nameMeaning: "Concedido, Substituto", 
    description: "Filho de Adão, nascido após a morte de Abel. Considerado o continuador da linhagem piedosa.", 
    bibleReference: 'Gênesis 4:25, 5:3-8', 
    fatherId: 'adam', 
    childrenIds: ['enos_seth_child'], 
    isCovenantLine: true 
  },
  { 
    id: 'cain_adam_child', 
    name: 'Caim', 
    nameMeaning: "Aquisição, Posse", 
    description: "Primeiro filho de Adão e Eva. Notório por ter matado seu irmão Abel por inveja.", 
    bibleReference: 'Gênesis 4', 
    fatherId: 'adam', 
    childrenIds: ['enoque_cain_child'] // Enoque, filho de Caim, diferente do Enoque da linhagem de Sete.
  },
  { 
    id: 'abel_adam_child', 
    name: 'Abel', 
    nameMeaning: "Sopro, Vaidade (efemeridade)", 
    description: "Segundo filho de Adão e Eva, pastor de ovelhas. Sua oferta foi aceita por Deus, o que gerou o ciúme de Caim, que o assassinou.", 
    bibleReference: 'Gênesis 4', 
    fatherId: 'adam' 
  },
  { 
    id: 'enos_seth_child', 
    name: 'Enos', 
    nameMeaning: "Homem mortal", 
    description: "Filho de Sete. Em seu tempo, a Bíblia relata que se começou a invocar o nome do Senhor.", 
    bibleReference: 'Gênesis 5:6-11', 
    fatherId: 'seth_adam_child', 
    childrenIds: ['caina_enos_child'], 
    isCovenantLine: true 
  },
  { 
    id: 'caina_enos_child', 
    name: 'Cainã', 
    nameMeaning: "Possessão, Ninho (ou Ferreiro)", 
    description: "Filho de Enos, parte da genealogia de Adão a Noé.", 
    bibleReference: 'Gênesis 5:9-14', 
    fatherId: 'enos_seth_child', 
    childrenIds: ['maalalel_caina_child'], 
    isCovenantLine: true 
  },
  { 
    id: 'maalalel_caina_child', 
    name: 'Maalalel', 
    nameMeaning: "Louvor de Deus", 
    description: "Filho de Cainã. Seu nome sugere uma devoção a Deus.", 
    bibleReference: 'Gênesis 5:12-17', 
    fatherId: 'caina_enos_child', 
    childrenIds: ['jarede_maalalel_child'], 
    isCovenantLine: true 
  },
  { 
    id: 'jarede_maalalel_child', 
    name: 'Jarede', 
    nameMeaning: "Descida, Governar (ou Servir)", 
    description: "Filho de Maalalel. Pai de Enoque.", 
    bibleReference: 'Gênesis 5:15-20', 
    fatherId: 'maalalel_caina_child', 
    childrenIds: ['enoque_jarede_child'], 
    isCovenantLine: true 
  },
  { 
    id: 'enoque_jarede_child', 
    name: 'Enoque', 
    nameMeaning: "Dedicado, Iniciado, Ensinado", 
    description: "Filho de Jarede. Notável por sua relação íntima com Deus ('andou com Deus') e por ter sido tomado por Deus, não experimentando a morte comum.", 
    bibleReference: 'Gênesis 5:18-24', 
    fatherId: 'jarede_maalalel_child', 
    childrenIds: ['matusalem_enoque_child'], 
    isCovenantLine: true 
  },
  { 
    id: 'enoque_cain_child', 
    name: 'Enoque (filho de Caim)', 
    nameMeaning: "Dedicado, Iniciado", 
    description: "Filho de Caim. Caim construiu uma cidade e deu a ela o nome de seu filho Enoque.", 
    bibleReference: 'Gênesis 4:17', 
    fatherId: 'cain_adam_child' 
  },
  { 
    id: 'matusalem_enoque_child', 
    name: 'Matusalém', 
    nameMeaning: "Homem do Dardo/Lança (ou Quando ele morrer, o juízo/envio virá)", 
    description: "Filho de Enoque. Conhecido por ser o homem que mais viveu, segundo o relato bíblico.", 
    bibleReference: 'Gênesis 5:21-27', 
    fatherId: 'enoque_jarede_child', 
    childrenIds: ['lameque_matusalem_child'], 
    isCovenantLine: true 
  },
  { 
    id: 'lameque_matusalem_child', 
    name: 'Lameque', 
    nameMeaning: "Poderoso, Jovem forte (ou Abatido, Pobre)", 
    description: "Filho de Matusalém e pai de Noé. Expressou esperança de alívio através de Noé.", 
    bibleReference: 'Gênesis 5:25-31', 
    fatherId: 'matusalem_enoque_child', 
    childrenIds: ['noe_lameque_child'], 
    isCovenantLine: true 
  },
  { 
    id: 'noe_lameque_child', 
    name: 'Noé', 
    nameMeaning: "Descanso, Conforto", 
    description: "Homem justo e íntegro em sua geração. Por ordem de Deus, construiu uma arca para salvar sua família e representantes dos animais do Dilúvio.", 
    bibleReference: 'Gênesis 5-9', 
    fatherId: 'lameque_matusalem_child', 
    childrenIds: ['sem_noe_child', 'cam_noe_child', 'jafe_noe_child'], 
    keyEventIds: ['flood'], 
    isCovenantLine: true 
  },
  
  // Filhos de Noé e descendentes de Sem até Abraão
  { 
    id: 'sem_noe_child', 
    name: 'Sem', 
    nameMeaning: "Nome, Renome", 
    description: "Um dos três filhos de Noé. Considerado ancestral dos povos semitas, incluindo Abraão.", 
    bibleReference: 'Gênesis 10, 11:10-11', 
    fatherId: 'noe_lameque_child', 
    childrenIds: ['arfaxade_sem_child'], 
    keyEventIds: ['flood'], 
    isCovenantLine: true 
  },
  { 
    id: 'cam_noe_child', 
    name: 'Cam', 
    nameMeaning: "Quente, Queimado pelo sol (ou Escuro)", 
    description: "Um dos três filhos de Noé. Pai de Canaã, cuja descendência foi amaldiçoada por Noé após um incidente.", 
    bibleReference: 'Gênesis 9, 10', 
    fatherId: 'noe_lameque_child', 
    childrenIds:['cus_cam_child', 'mizraim_cam_child', 'pute_cam_child', 'canaa_cam_child'], 
    keyEventIds: ['flood'] 
  },
  { 
    id: 'jafe_noe_child', 
    name: 'Jafé', 
    nameMeaning: "Expansão, Beleza (ou Ele Engrandecerá)", 
    description: "Um dos três filhos de Noé. Considerado ancestral de diversos povos europeus e asiáticos.", 
    bibleReference: 'Gênesis 10', 
    fatherId: 'noe_lameque_child', 
    keyEventIds: ['flood'] 
  },
  { id: 'cus_cam_child', name: 'Cuxe', fatherId: 'cam_noe_child', childrenIds: ['ninrode_cus_child'], description: "Filho de Cam, pai de Ninrode. Associado à região da Núbia/Etiópia."},
  { id: 'mizraim_cam_child', name: 'Mizraim', fatherId: 'cam_noe_child', description: "Filho de Cam, ancestral dos egípcios." },
  { id: 'pute_cam_child', name: 'Pute', fatherId: 'cam_noe_child', description: "Filho de Cam, associado a povos da Líbia ou Somália." },
  { id: 'canaa_cam_child', name: 'Canaã', fatherId: 'cam_noe_child', description: "Filho de Cam, ancestral dos cananeus. Amaldiçoado por Noé." },
  { 
    id: 'ninrode_cus_child', 
    name: 'Ninrode', 
    description: "Neto de Cam. Descrito como um poderoso caçador diante do Senhor e o fundador de reinos na Mesopotâmia, incluindo Babel.", 
    bibleReference: 'Gênesis 10:8-12', 
    fatherId: 'cus_cam_child'
  },
  { 
    id: 'arfaxade_sem_child', 
    name: 'Arfaxade', 
    description: "Filho de Sem, nascido dois anos após o Dilúvio.", 
    bibleReference: 'Gênesis 11:10-13', 
    fatherId: 'sem_noe_child', 
    childrenIds: ['sala_arfaxade_child'], 
    isCovenantLine: true 
  },
  { 
    id: 'sala_arfaxade_child', 
    name: 'Salá', 
    nameMeaning: "Brote, Petição", 
    description: "Filho de Arfaxade, da linhagem de Sem.", 
    bibleReference: 'Gênesis 11:12-15', 
    fatherId: 'arfaxade_sem_child', 
    childrenIds: ['eber_sala_child'], 
    isCovenantLine: true 
  },
  { 
    id: 'eber_sala_child', 
    name: 'Héber', 
    nameMeaning: "Aquele que cruza, Passagem (ou Região Além)", 
    description: "Filho de Salá. Epônimo dos hebreus.", 
    bibleReference: 'Gênesis 11:14-17', 
    fatherId: 'sala_arfaxade_child', 
    childrenIds: ['pelegue_eber_child', 'jocta_eber_child'], 
    isCovenantLine: true 
  },
  { 
    id: 'pelegue_eber_child', 
    name: 'Pelegue', 
    nameMeaning: "Divisão", 
    description: "Filho de Héber. A Bíblia menciona que em seus dias a terra foi dividida, possivelmente referindo-se à dispersão de Babel.", 
    bibleReference: 'Gênesis 11:16-19', 
    fatherId: 'eber_sala_child', 
    childrenIds: ['reu_pelegue_child'], 
    isCovenantLine: true 
  },
  { id: 'jocta_eber_child', name: 'Joctã', fatherId: 'eber_sala_child', description: "Filho de Héber, irmão de Pelegue. Ancestral de várias tribos árabes."},
  { 
    id: 'reu_pelegue_child', 
    name: 'Reú', 
    nameMeaning: "Amigo, Companheiro", 
    description: "Filho de Pelegue.", 
    bibleReference: 'Gênesis 11:18-21', 
    fatherId: 'pelegue_eber_child', 
    childrenIds: ['serugue_reu_child'], 
    isCovenantLine: true 
  },
  { 
    id: 'serugue_reu_child', 
    name: 'Serugue', 
    nameMeaning: "Ramo, Entrelaçado", 
    description: "Filho de Reú.", 
    bibleReference: 'Gênesis 11:20-23', 
    fatherId: 'reu_pelegue_child', 
    childrenIds: ['naor_serugue_child'], 
    isCovenantLine: true 
  },
  { 
    id: 'naor_serugue_child', 
    name: 'Naor (Avô de Abraão)', 
    nameMeaning: "Respirador, Roncador (ou Luz)", 
    description: "Filho de Serugue e avô de Abraão.", 
    bibleReference: 'Gênesis 11:22-25', 
    fatherId: 'serugue_reu_child', 
    childrenIds: ['tera_naor_child'], 
    isCovenantLine: true 
  },
  { 
    id: 'tera_naor_child', 
    name: 'Terá', 
    nameMeaning: "Estação, Demora (ou Cabra Montesa)", 
    description: "Filho de Naor e pai de Abraão, Naor (irmão de Abraão) e Harã. Saiu de Ur dos Caldeus com sua família.", 
    bibleReference: 'Gênesis 11:24-32', 
    fatherId: 'naor_serugue_child', 
    childrenIds: ['abraao_tera_child', 'naor_tera_child', 'hara_tera_child'], 
    isCovenantLine: true 
  },
  
  // Abraão e seus descendentes
  { 
    id: 'abraao_tera_child', 
    name: 'Abraão (originalmente Abrão)', 
    nameMeaning: "Abrão: Pai Exaltado; Abraão: Pai de Multidões", 
    description: "Figura central do Antigo Testamento, chamado por Deus para deixar sua terra e ir para Canaã. Deus estabeleceu um pacto com ele, prometendo-lhe numerosa descendência e a terra de Canaã.", 
    bibleReference: 'Gênesis 11-25', 
    fatherId: 'tera_naor_child', 
    spouseIds: ['sarai_abraao_esposa', 'hagar_abraao_concubina', 'quetura_abraao_esposa'], 
    childrenIds: ['ismael_abraao_child', 'isaque_abraao_child', 'zinra_quetura_filho', 'jocsa_quetura_filho', 'meda_quetura_filho', 'midia_quetura_filho', 'isbaque_quetura_filho', 'sua_quetura_filho'], 
    keyEventIds: ['covenant_abraham', 'birth_isaac', 'sacrifice_isaac'], 
    isCovenantLine: true 
  },
  { 
    id: 'sarai_abraao_esposa', 
    name: 'Sara (originalmente Sarai)', 
    nameMeaning: "Sarai: Minha Princesa; Sara: Princesa (de multidões)", 
    description: "Meia-irmã e esposa de Abraão. Estéril por muitos anos, deu à luz Isaque na velhice, conforme a promessa de Deus.", 
    bibleReference: 'Gênesis 11-23'
  },
  { 
    id: 'hagar_abraao_concubina', 
    name: 'Hagar', 
    nameMeaning: "Fuga, Estrangeira", 
    description: "Serva egípcia de Sara. Dada a Abraão por Sara para gerar um filho, Ismael. Posteriormente, foi expulsa com Ismael.", 
    bibleReference: 'Gênesis 16, 21'
  },
  { 
    id: 'quetura_abraao_esposa', 
    name: 'Quetura', 
    nameMeaning: "Incenso", 
    description: "Segunda esposa ou concubina de Abraão após a morte de Sara, com quem teve vários filhos.", 
    bibleReference: 'Gênesis 25:1-4'
  },
  { id: 'naor_tera_child', name: 'Naor (irmão de Abraão)', fatherId: 'tera_naor_child', spouseIds: ['milca_hara_filha'], childrenIds:['betuel_naor_filho'], description: "Irmão de Abraão e Harã. Casou-se com Milca, sua sobrinha."},
  { id: 'hara_tera_child', name: 'Harã', fatherId: 'tera_naor_child', childrenIds:['lo_hara_filho', 'milca_hara_filha', 'isca_hara_filha'], description: "Irmão de Abraão e Naor. Pai de Ló, Milca e Iscá. Morreu em Ur dos Caldeus, antes de seu pai Terá."},
  { 
    id: 'lo_hara_filho', 
    name: 'Ló', 
    fatherId: 'hara_tera_child', 
    description: "Sobrinho de Abraão. Acompanhou Abraão a Canaã. Separou-se de Abraão e habitou em Sodoma, sendo salvo da destruição da cidade."
  },
  { id: 'milca_hara_filha', name: 'Milca', fatherId: 'hara_tera_child', spouseIds:['naor_tera_child'], childrenIds:['betuel_naor_filho'], description: "Filha de Harã, esposa de seu tio Naor (irmão de Abraão). Mãe de Betuel."},
  { id: 'isca_hara_filha', name: 'Iscá', fatherId: 'hara_tera_child', description: "Filha de Harã, irmã de Ló e Milca."},
  { id: 'betuel_naor_filho', name: 'Betuel', fatherId: 'naor_tera_child', motherId:'milca_hara_filha', childrenIds:['rebeca_betuel_filha', 'labao_betuel_filho'], description: "Filho de Naor e Milca. Pai de Rebeca e Labão."},
  { id: 'rebeca_betuel_filha', name: 'Rebeca', fatherId: 'betuel_naor_filho', spouseIds:['isaque_abraao_child'], childrenIds:['esau_isaque_child', 'jaco_isaque_child'], description: "Filha de Betuel, neta de Naor. Esposa de Isaque e mãe de Esaú e Jacó."},
  { id: 'labao_betuel_filho', name: 'Labão', fatherId: 'betuel_naor_filho', childrenIds:['lia_labao_filha', 'raquel_labao_filha'], description: "Filho de Betuel, irmão de Rebeca. Pai de Lia e Raquel. Jacó trabalhou para ele por suas esposas e rebanhos."},

  { 
    id: 'ismael_abraao_child', 
    name: 'Ismael', 
    nameMeaning: "Deus Ouve", 
    description: "Filho de Abraão com Hagar, a serva egípcia de Sara. Considerado o progenitor de várias tribos árabes.", 
    bibleReference: 'Gênesis 16, 21, 25', 
    fatherId: 'abraao_tera_child', 
    motherId: 'hagar_abraao_concubina'
  },
  { 
    id: 'isaque_abraao_child', 
    name: 'Isaque', 
    nameMeaning: "Ele Ri (ou Riso)", 
    description: "Filho da promessa, nascido de Abraão e Sara em sua velhice. Herdeiro do pacto. Quase foi sacrificado por Abraão como teste de fé.", 
    bibleReference: 'Gênesis 21-28, 35', 
    fatherId: 'abraao_tera_child', 
    motherId: 'sarai_abraao_esposa', 
    spouseIds:['rebeca_betuel_filha'], 
    childrenIds: ['esau_isaque_child', 'jaco_isaque_child'], 
    keyEventIds: ['birth_isaac', 'sacrifice_isaac'], 
    isCovenantLine: true 
  },
  
  // Filhos de Quetura
  { id: 'zinra_quetura_filho', name: 'Zinrã', fatherId: 'abraao_tera_child', motherId: 'quetura_abraao_esposa'},
  { id: 'jocsa_quetura_filho', name: 'Jocsã', fatherId: 'abraao_tera_child', motherId: 'quetura_abraao_esposa'},
  { id: 'meda_quetura_filho', name: 'Medã', fatherId: 'abraao_tera_child', motherId: 'quetura_abraao_esposa'},
  { id: 'midia_quetura_filho', name: 'Midiã', fatherId: 'abraao_tera_child', motherId: 'quetura_abraao_esposa', description: "Ancestral dos midianitas."},
  { id: 'isbaque_quetura_filho', name: 'Isbaque', fatherId: 'abraao_tera_child', motherId: 'quetura_abraao_esposa'},
  { id: 'sua_quetura_filho', name: 'Suá', fatherId: 'abraao_tera_child', motherId: 'quetura_abraao_esposa'},
  
  // Jacó e seus filhos (os 12 patriarcas)
  { 
    id: 'esau_isaque_child', 
    name: 'Esaú (também Edom)', 
    nameMeaning: "Peludo", 
    description: "Filho primogênito de Isaque e Rebeca, irmão gêmeo de Jacó. Vendeu seu direito de primogenitura a Jacó por um prato de lentilhas. Ancestral dos edomitas.", 
    bibleReference: 'Gênesis 25, 27, 32-33, 36', 
    fatherId: 'isaque_abraao_child', 
    motherId: 'rebeca_betuel_filha'
  },
  { 
    id: 'jaco_isaque_child', 
    name: 'Jacó (posteriormente Israel)', 
    nameMeaning: "Jacó: Suplantador, Aquele que segura o calcanhar; Israel: Deus Luta/Prevalece, Príncipe de Deus", 
    description: "Filho de Isaque e Rebeca. Recebeu a bênção da primogenitura de seu pai. Teve seu nome mudado para Israel após lutar com um ser divino. Pai dos doze patriarcas, que deram origem às doze tribos de Israel.", 
    bibleReference: 'Gênesis 25-50', 
    fatherId: 'isaque_abraao_child', 
    motherId: 'rebeca_betuel_filha', 
    spouseIds:['lia_labao_filha', 'raquel_labao_filha', 'bila_serva', 'zilpa_serva'], 
    childrenIds:[
      'ruben_jaco_lia_filho', 'simeao_jaco_lia_filho', 'levi_jaco_lia_filho', 'juda_jaco_lia_filho', 'issacar_jaco_lia_filho', 'zebulom_jaco_lia_filho', 'dina_jaco_lia_filha', // Filhos de Lia
      'da_jaco_bila_filho', 'naftali_jaco_bila_filho', // Filhos de Bila (serva de Raquel)
      'gade_jaco_zilpa_filho', 'aser_jaco_zilpa_filho', // Filhos de Zilpa (serva de Lia)
      'jose_jaco_raquel_filho', 'benjamim_jaco_raquel_filho' // Filhos de Raquel
    ], 
    keyEventIds:['jacob_ladder', 'jacob_wrestles', 'jacob_moves_to_egypt'], 
    isCovenantLine: true
  },
  { id: 'lia_labao_filha', name: 'Lia', fatherId: 'labao_betuel_filho', spouseIds:['jaco_isaque_child'], description: "Filha mais velha de Labão, primeira esposa de Jacó. Mãe de seis filhos de Jacó (Rúben, Simeão, Levi, Judá, Issacar, Zebulom) e uma filha (Diná)."},
  { id: 'raquel_labao_filha', name: 'Raquel', fatherId: 'labao_betuel_filho', spouseIds:['jaco_isaque_child'], description: "Filha mais nova de Labão, segunda e amada esposa de Jacó. Mãe de José e Benjamim. Morreu ao dar à luz Benjamim."},
  { id: 'bila_serva', name: 'Bila', description: "Serva de Raquel, dada a Jacó como concubina. Mãe de Dã e Naftali."},
  { id: 'zilpa_serva', name: 'Zilpa', description: "Serva de Lia, dada a Jacó como concubina. Mãe de Gade e Aser."},

  // Filhos de Jacó (Patriarcas das Tribos de Israel)
  { id: 'ruben_jaco_lia_filho', name: 'Rúben', fatherId: 'jaco_isaque_child', motherId: 'lia_labao_filha', nameMeaning: "Vede, um filho!", isCovenantLine: false},
  { id: 'simeao_jaco_lia_filho', name: 'Simeão', fatherId: 'jaco_isaque_child', motherId: 'lia_labao_filha', nameMeaning: "Ouvido (Deus ouviu)", isCovenantLine: false},
  { id: 'levi_jaco_lia_filho', name: 'Levi', fatherId: 'jaco_isaque_child', motherId: 'lia_labao_filha', nameMeaning: "Unido, Apegado", isCovenantLine: false, description: "Ancestral da tribo sacerdotal de Israel."}, // Linha sacerdotal, mas Judá é a real para o pacto messiânico
  { id: 'juda_jaco_lia_filho', name: 'Judá', fatherId: 'jaco_isaque_child', motherId: 'lia_labao_filha', nameMeaning: "Louvor", isCovenantLine: true, description: "Ancestral da tribo real de Israel, da qual descenderam Davi e Jesus (segundo a tradição cristã)."}, // Linha Messiânica
  { id: 'issacar_jaco_lia_filho', name: 'Issacar', fatherId: 'jaco_isaque_child', motherId: 'lia_labao_filha', nameMeaning: "Recompensa (Ele é salário)", isCovenantLine: false},
  { id: 'zebulom_jaco_lia_filho', name: 'Zebulom', fatherId: 'jaco_isaque_child', motherId: 'lia_labao_filha', nameMeaning: "Habitação, Honra (ou Exaltado)", isCovenantLine: false},
  { id: 'dina_jaco_lia_filha', name: 'Diná', fatherId: 'jaco_isaque_child', motherId: 'lia_labao_filha', nameMeaning: "Julgamento (ou Justificada)", description: "Filha de Jacó e Lia. Sua história em Siquém é um episódio notável."},

  { id: 'da_jaco_bila_filho', name: 'Dã', fatherId: 'jaco_isaque_child', motherId: 'bila_serva', nameMeaning: "Ele fez justiça (Juiz)", isCovenantLine: false},
  { id: 'naftali_jaco_bila_filho', name: 'Naftali', fatherId: 'jaco_isaque_child', motherId: 'bila_serva', nameMeaning: "Minha luta", isCovenantLine: false},
  
  { id: 'gade_jaco_zilpa_filho', name: 'Gade', fatherId: 'jaco_isaque_child', motherId: 'zilpa_serva', nameMeaning: "Sorte, Tropa (Boa fortuna)", isCovenantLine: false},
  { id: 'aser_jaco_zilpa_filho', name: 'Aser', fatherId: 'jaco_isaque_child', motherId: 'zilpa_serva', nameMeaning: "Feliz, Bem-aventurado", isCovenantLine: false},

  { 
    id: 'jose_jaco_raquel_filho', 
    name: 'José', 
    nameMeaning: "Que Ele acrescente (Deus adicionou), Deus tirou o meu opróbrio", 
    description: "Filho amado de Jacó e Raquel. Vendido por seus irmãos como escravo, tornou-se governador do Egito e salvou sua família da fome.", 
    bibleReference: 'Gênesis 30, 37-50', 
    fatherId: 'jaco_isaque_child', 
    motherId: 'raquel_labao_filha', 
    keyEventIds: ['joseph_sold', 'joseph_governor'], 
    isCovenantLine: true, // Importante para a narrativa, mas a linhagem real vem de Judá.
    childrenIds: ['manasses_jose_filho', 'efraim_jose_filho'] 
  },
  { id: 'benjamim_jaco_raquel_filho', name: 'Benjamim', fatherId: 'jaco_isaque_child', motherId: 'raquel_labao_filha', nameMeaning: "Filho da minha mão direita (originalmente Benoni: Filho da minha dor)", isCovenantLine: false, description: "Filho mais novo de Jacó e Raquel. Raquel morreu ao dar à luz a ele."},

  // Filhos de José
  { id: 'manasses_jose_filho', name: 'Manassés', fatherId: 'jose_jaco_raquel_filho', nameMeaning: "Deus me fez esquecer", description: "Filho mais velho de José no Egito. Abençoado por Jacó."},
  { id: 'efraim_jose_filho', name: 'Efraim', fatherId: 'jose_jaco_raquel_filho', nameMeaning: "Deus me fez próspero", description: "Filho mais novo de José no Egito. Recebeu a bênção principal de Jacó sobre seu irmão mais velho."},
];