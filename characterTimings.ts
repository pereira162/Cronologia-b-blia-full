// characterTimings.ts
// Este arquivo armazena os dados cronológicos dos personagens, como ano de nascimento,
// idade ao gerar o filho principal da linhagem e tempo total de vida.
// O 'birthYear' é relativo a Adão = 0.
// Estes dados são combinados com `characterProfiles.ts` em `data.ts` para formar o array `peopleData` completo.

// Interface para os dados de tempo de um personagem.
interface CharacterTiming {
  id: string; // ID do personagem, deve corresponder ao ID em characterProfiles.ts
  birthYear: number;      // Ano de nascimento relativo a Adão = 0 (obrigatório para cálculo da timeline)
  ageAtParenthood?: number; // Idade ao gerar o filho principal da linhagem (opcional)
  totalLifespan?: number;   // Tempo total de vida em anos (opcional)
}

// Array contendo os dados cronológicos dos personagens.
export const characterTimings: CharacterTiming[] = [
  // Adão e descendentes diretos até Noé
  // Os birthYears são calculados cumulativamente a partir de Adão.
  { id: 'adam', birthYear: 0, ageAtParenthood: 130, totalLifespan: 930 }, // Adão viveu 930 anos, gerou Sete aos 130.
  { id: 'seth_adam_child', birthYear: 130, ageAtParenthood: 105, totalLifespan: 912 }, // Sete nasceu quando Adão tinha 130.
  { id: 'cain_adam_child', birthYear: 2 /* Estimativa simbólica, pouco após Adão */, ageAtParenthood: undefined, totalLifespan: undefined /* Não especificado claramente*/ },
  { id: 'abel_adam_child', birthYear: 4 /* Estimativa simbólica, pouco após Caim */, ageAtParenthood: undefined, totalLifespan: undefined /* Morto jovem, não especificado */ },
  { id: 'enos_seth_child', birthYear: 130 + 105, ageAtParenthood: 90, totalLifespan: 905 }, // Enos nasceu quando Sete tinha 105.
  { id: 'caina_enos_child', birthYear: 130 + 105 + 90, ageAtParenthood: 70, totalLifespan: 910 },
  { id: 'maalalel_caina_child', birthYear: 130 + 105 + 90 + 70, ageAtParenthood: 65, totalLifespan: 895 },
  { id: 'jarede_maalalel_child', birthYear: 130 + 105 + 90 + 70 + 65, ageAtParenthood: 162, totalLifespan: 962 },
  { id: 'enoque_jarede_child', birthYear: 130 + 105 + 90 + 70 + 65 + 162, ageAtParenthood: 65, totalLifespan: 365 }, // Enoque foi arrebatado aos 365 anos.
  { id: 'enoque_cain_child', birthYear: 20 /* Estimativa simbólica para o filho de Caim */ },
  { id: 'matusalem_enoque_child', birthYear: 130 + 105 + 90 + 70 + 65 + 162 + 65, ageAtParenthood: 187, totalLifespan: 969 },
  { id: 'lameque_matusalem_child', birthYear: 130 + 105 + 90 + 70 + 65 + 162 + 65 + 187, ageAtParenthood: 182, totalLifespan: 777 },
  { id: 'noe_lameque_child', birthYear: 130 + 105 + 90 + 70 + 65 + 162 + 65 + 187 + 182, ageAtParenthood: 500 /* Idade ao gerar Sem, Cam e Jafé (aproximadamente) */, totalLifespan: 950 },
  
  // Filhos de Noé e descendentes de Sem até Abraão
  // O nascimento de Sem é quando Noé tem 500 anos.
  // Arfaxade nasce quando Sem tem 100 anos, "dois anos após o dilúvio".
  // Noé tinha 600 anos quando o dilúvio começou (Noe_BY + 600).
  // Se Sem nasceu em Noe_BY + 500, então quando Sem tem 100 anos, é (Noe_BY + 500) + 100 = Noe_BY + 600.
  // Isso coincide com o início do dilúvio, e "2 anos após" seria Noe_BY + 602.
  // Portanto, Arfaxade_BY = Sem_BY + 100 = (Noe_BY + 500) + 100 = Noe_BY + 600.
  // O dilúvio durou um ano. "2 anos após o dilúvio" significa 2 anos após o fim do dilúvio.
  // Dilúvio começa em Noe_BY + 600, termina em Noe_BY + 601.
  // Arfaxade_BY = (Noe_BY + 601) + 2 = Noe_BY + 603.
  // Sendo Noe_BY = 1056. Arfaxade_BY = 1056 + 603 = 1659. (Este é o birthYear relativo a Adão=0)
  // Sem_BY = Noe_BY + 500 = 1056 + 500 = 1556.
  // Arfaxade nasceu quando Sem tinha 100 (Sem_BY + 100 = 1656), ou 2 anos após o dilúvio (Dilúvio FIM Noe_BY+601, então Noe_BY+603 = 1659).
  // Gênesis 11:10 "Sem tinha cem anos e gerou Arfaxade, dois anos depois do dilúvio." -> Sem_BY + 100 = Dilúvio_FIM + 2.
  // (Noe_BY + 500) + 100 = (Noe_BY + 601) + 2  => Noe_BY + 600 = Noe_BY + 603.  Esta é uma contradição.
  // Vamos assumir que "gerou Arfaxade" aos 100 anos é o ponto de partida para a linhagem de Sem e "2 anos após o dilúvio" é contextual.
  // Ou seja, Sem_BY + 100 é o birthYear de Arfaxade.
  // Dilúvio começa em Noe_BY + 600 = 1656.
  // Arfaxade_BY = Sem_BY + 100 = 1556 + 100 = 1656.
  
  { id: 'sem_noe_child', birthYear: (1056) + 500, ageAtParenthood: 100, totalLifespan: 600 }, // Sem_BY = 1556
  { id: 'cam_noe_child', birthYear: (1056) + 502 /* Estimativa, pode ser um pouco depois de Sem */, totalLifespan: undefined },
  { id: 'jafe_noe_child', birthYear: (1056) + 503 /* Estimativa */, totalLifespan: undefined },
  { id: 'cus_cam_child', birthYear: ((1056) + 502) + 30 /* Estimativa */ },
  { id: 'mizraim_cam_child', birthYear: ((1056) + 502) + 32 /* Estimativa */ },
  { id: 'pute_cam_child', birthYear: ((1056) + 502) + 34 /* Estimativa */ },
  { id: 'canaa_cam_child', birthYear: ((1056) + 502) + 36 /* Estimativa */ },
  { id: 'ninrode_cus_child', birthYear: (((1056) + 502) + 30) + 25 /* Estimativa */ },

  { id: 'arfaxade_sem_child', birthYear: 1556 + 100, ageAtParenthood: 35, totalLifespan: 438 }, // Arfaxade_BY = 1656
  { id: 'sala_arfaxade_child', birthYear: 1656 + 35, ageAtParenthood: 30, totalLifespan: 433 }, // Sala_BY = 1691
  { id: 'eber_sala_child', birthYear: 1691 + 30, ageAtParenthood: 34, totalLifespan: 464 }, // Eber_BY = 1721
  { id: 'pelegue_eber_child', birthYear: 1721 + 34, ageAtParenthood: 30, totalLifespan: 239 }, // Pelegue_BY = 1755
  { id: 'jocta_eber_child', birthYear: 1721 + 36 /* Estimativa, irmão de Pelegue */ }, // Jocta_BY ~ 1757
  { id: 'reu_pelegue_child', birthYear: 1755 + 30, ageAtParenthood: 32, totalLifespan: 239 }, // Reu_BY = 1785
  { id: 'serugue_reu_child', birthYear: 1785 + 32, ageAtParenthood: 30, totalLifespan: 230 }, // Serugue_BY = 1817
  { id: 'naor_serugue_child', birthYear: 1817 + 30, ageAtParenthood: 29, totalLifespan: 148 }, // Naor_BY = 1847
  { id: 'tera_naor_child', birthYear: 1847 + 29, ageAtParenthood: 70 /* Idade ao gerar Abrão, Naor e Harã (primeiro deles ou início da geração) */, totalLifespan: 205 }, // Tera_BY = 1876
  
  // Abraão e seus descendentes
  { id: 'abraao_tera_child', birthYear: 1876 + 70, ageAtParenthood: 100 /* Idade ao nascimento de Isaque */, totalLifespan: 175 }, // Abraao_BY = 1946
  { id: 'sarai_abraao_esposa', birthYear: (1876 + 70) - 10 /* Sara era 10 anos mais nova que Abraão, Gênesis 17:17 */, totalLifespan: 127 }, // Sara_BY = 1936. Morreu aos 127 (Gn 23:1). Abraão tinha 137. 1936+127 = 2063. Abraão_BY + 137 = 1946+137 = 2083. Algo não bate.
  // Se Sara morreu aos 127 e Abraão tinha 137 (Gn 23:1, Abraão lamenta Sara), então Abraão era 10 anos mais velho.
  // Abraao_BY = 1946. Sara_BY = Abraao_BY + 10 = 1956 (se ela fosse mais nova). Ou Abraao_BY - 10 = 1936 (se ela fosse mais velha).
  // Gn 17:17: "Abraão ... riu-se, e disse no seu coração: A um homem de cem anos há de nascer um filho? E conceberá Sara, que é de noventa anos?"
  // Então Sara tinha 90 quando Abraão tinha 100. Logo, Sara é 10 anos mais nova. Sara_BY = Abraao_BY + 10 = 1946 + 10 = 1956.
  // Corrigindo Sara:
  // { id: 'sarai_abraao_esposa', birthYear: (1876 + 70) + 10, totalLifespan: 127 }, // Sara_BY = 1956.
  // Vamos recalcular a linha de Sete para verificar: Adão (0), Sete (130), Enos (235), Cainã (325), Maalalel (395), Jarede (460), Enoque (622), Matusalém (687), Lameque (874), Noé (1056).
  // Sem (1556), Arfaxade (1658 - Gn11:10 "dois anos depois do dilúvio", Dilúvio Noé 600 = 1056+600=1656. Arfaxade 1658).
  // Salá (1658+35=1693), Héber (1693+30=1723), Pelegue (1723+34=1757), Reú (1757+30=1787), Serugue (1787+32=1819), Naor (1819+30=1849), Terá (1849+29=1878).
  // Abrão (1878+70=1948).  (Gênesis 11:26: "E viveu Terá setenta anos, e gerou a Abrão, a Naor, e a Harã.")
  // (Gênesis 11:32: "E foram os dias de Terá duzentos e cinco anos; e morreu Terá em Harã.")
  // (Gênesis 12:4: "Ora, Abrão era da idade de setenta e cinco anos, quando saiu de Harã.")
  // Se Terá morreu aos 205 em Harã, e Abrão saiu de Harã após a morte de Terá (Atos 7:4),
  // então Abrão tinha 75 quando Terá tinha 205.
  // Terá_BY + 205 = Abrão_BY + 75  => 1878 + 205 = 1948 + 75 => 2083 = 2023 (INCONSISTENTE)
  // Se Abrão nasceu quando Terá tinha 130 (dedução de Atos 7:4 e Gn 11:32, 12:4): Terá_BY + 130 = Abrão_BY => 1878 + 130 = 2008.
  // Esta é uma interpretação comum para conciliar. Vamos usar esta: Abrão_BY = 2008.
  { id: 'abraao_tera_child', birthYear: 1878 + 130, ageAtParenthood: 100 /*Isaque*/, totalLifespan: 175 }, // Abrão_BY = 2008.
  { id: 'sarai_abraao_esposa', birthYear: (1878 + 130) + 10, totalLifespan: 127 }, // Sara_BY = 2018.
  
  { id: 'hagar_abraao_concubina', birthYear: undefined /* Não especificado */ },
  { id: 'quetura_abraao_esposa', birthYear: undefined /* Não especificado */ },
  { id: 'naor_tera_child', birthYear: 1878 + 70 /* Assumindo que Naor nasceu quando Terá tinha 70, antes de Abraão se a interpretação de 130 for usada para Abraão */, totalLifespan: undefined},
  { id: 'hara_tera_child', birthYear: 1878 + 70 /* Idem */, totalLifespan: undefined /* Morreu antes de Terá em Ur */ },
  { id: 'lo_hara_filho', birthYear: undefined /* Não especificado */},
  { id: 'milca_hara_filha', birthYear: undefined /* Não especificado */},
  { id: 'isca_hara_filha', birthYear: undefined /* Não especificado */},
  { id: 'betuel_naor_filho', birthYear: undefined /* Não especificado */},
  { id: 'rebeca_betuel_filha', birthYear: undefined /* Não especificado, mas Isaque tinha 40 quando casou (Gn 25:20), então Rebeca_BY deve ser ~Isaque_BY + 20-25 */},
  { id: 'labao_betuel_filho', birthYear: undefined /* Não especificado */},

  { id: 'ismael_abraao_child', birthYear: (2008) + 86, totalLifespan: 137 }, // Ismael_BY = 2094. (Abraão 86 anos - Gn 16:16)
  { id: 'isaque_abraao_child', birthYear: (2008) + 100, ageAtParenthood: 60, totalLifespan: 180 }, // Isaque_BY = 2108. (Abraão 100 anos - Gn 21:5)
  
  // Filhos de Quetura - nascimentos não especificados em relação à linha do tempo
  { id: 'zinra_quetura_filho', birthYear: undefined },
  { id: 'jocsa_quetura_filho', birthYear: undefined },
  { id: 'meda_quetura_filho', birthYear: undefined },
  { id: 'midia_quetura_filho', birthYear: undefined },
  { id: 'isbaque_quetura_filho', birthYear: undefined },
  { id: 'sua_quetura_filho', birthYear: undefined },
  
  // Jacó e seus filhos
  { id: 'esau_isaque_child', birthYear: (2108) + 60, totalLifespan: undefined /* Não especificado, mas viveu muito (Gn 35:29 menciona sua presença na morte de Isaque) */}, // Esaú_BY = 2168 (Isaque 60 anos - Gn 25:26)
  { id: 'jaco_isaque_child', birthYear: (2108) + 60, ageAtParenthood: 84 /* Idade ao nascimento de Rúben. Jacó (77) chega a Harã, 7 anos de serviço -> 84. */, totalLifespan: 147 }, // Jacó_BY = 2168
  { id: 'lia_labao_filha', birthYear: undefined /* Não especificado */},
  { id: 'raquel_labao_filha', birthYear: undefined /* Não especificado */},
  { id: 'bila_serva', birthYear: undefined },
  { id: 'zilpa_serva', birthYear: undefined },

  // Filhos de Jacó - nascimentos relativos a Jacó_BY + idade de Jacó
  // Jacó chegou em Harã com ~77 anos (se fugiu logo após roubar a bênção, e Isaque tinha ~137).
  // Isaque_BY = 2108. Isaque abençoa Jacó e Esaú. Idade de Isaque? Se Jacó tem 77, Isaque = 77+60 = 137. Ano = 2168+77 = 2245.
  // Jacó_BY = 2168. Jacó casa com Lia e Raquel após 7 anos de serviço por Raquel (Gn 29:20-28). Idade de Jacó = ~77 (chegada) + 7 = 84. Ano = 2168 + 84 = 2252.
  // Rúben (Lia): Jacó ~84-85. Ano ~2252-2253.
  // José (Raquel): Jacó ~91 (Gn 30:25). Nasceu após 14 anos de serviço de Jacó (7 por Lia, 7 por Raquel). Jacó ~77+14=91. Ano = 2168 + 91 = 2259.
  
  { id: 'ruben_jaco_lia_filho', birthYear: (2168) + 84, totalLifespan: undefined },
  { id: 'simeao_jaco_lia_filho', birthYear: (2168) + 85, totalLifespan: undefined },
  { id: 'levi_jaco_lia_filho', birthYear: (2168) + 86, totalLifespan: 137 /* Êxodo 6:16 */},
  { id: 'juda_jaco_lia_filho', birthYear: (2168) + 87, totalLifespan: undefined },
  { id: 'da_jaco_bila_filho', birthYear: (2168) + 87.5 /* Estimativa após Judá, Raquel deu Bila */, totalLifespan: undefined },
  { id: 'naftali_jaco_bila_filho', birthYear: (2168) + 88, totalLifespan: undefined },
  { id: 'gade_jaco_zilpa_filho', birthYear: (2168) + 88.5 /* Lia deu Zilpa */, totalLifespan: undefined },
  { id: 'aser_jaco_zilpa_filho', birthYear: (2168) + 89, totalLifespan: undefined },
  { id: 'issacar_jaco_lia_filho', birthYear: (2168) + 89.5 /* Lia novamente */, totalLifespan: undefined },
  { id: 'zebulom_jaco_lia_filho', birthYear: (2168) + 90, totalLifespan: undefined },
  { id: 'dina_jaco_lia_filha', birthYear: (2168) + 90.5 /* Após Zebulom */, totalLifespan: undefined },
  { id: 'jose_jaco_raquel_filho', birthYear: (2168) + 91, ageAtParenthood: 39 /* Governador aos 30 (Gn 41:46). 7 anos de fartura + 2 de fome quando filhos de Jacó descem pela 2a vez e José tem filhos. Efraim e Manassés nascem antes da fome. (Gn 41:50). Idade de José quando Efraim (2o filho) nasceu ~30+7-1 = 36. */, totalLifespan: 110 }, // Jose_BY = 2259.
  { id: 'benjamim_jaco_raquel_filho', birthYear: (2168) + 91 + 8 /* Estimativa, alguns anos depois de José, antes de Jacó retornar de Harã (20 anos lá). Jacó retorna ~97. */, totalLifespan: undefined },

  // Filhos de José (nascidos no Egito, antes dos 7 anos de fome)
  // José torna-se governador aos 30 (Jose_BY + 30 = 2259 + 30 = 2289).
  // Manassés e Efraim nascem durante os 7 anos de fartura (entre 2289 e 2296).
  { id: 'manasses_jose_filho', birthYear: (2259) + 32 /* Estimativa, no início dos anos de fartura */ },
  { id: 'efraim_jose_filho', birthYear: (2259) + 34 /* Estimativa */ },
];