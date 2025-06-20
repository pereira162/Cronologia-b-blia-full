// Configuração para integração com a API da Bíblia Digital
// https://www.abibliadigital.com.br/

export const BIBLE_API_CONFIG = {
  BASE_URL: 'https://www.abibliadigital.com.br/api',
  // Token será definido aqui após a criação da conta
  // Para uso sem token: 20 requisições/hora/IP
  // Com token de usuário: requisições ilimitadas (gratuito)
  TOKEN: process.env.REACT_APP_BIBLE_API_TOKEN || '', // Deixando espaço para o token
  
  // Informações para criação de usuário (conforme solicitado)
  USER_INFO: {
    name: "pereira162",
    email: "lucaspereiradecampos@hotmail.com", 
    password: "sacul321", // minimum size 6 digits
    notifications: true
  }
} as const;

// Versões disponíveis na API da Bíblia Digital
export const BIBLE_VERSIONS = {
  NVI: 'nvi', // Nova Versão Internacional
  RA: 'ra',   // Almeida Revista e Atualizada
  ACF: 'acf', // Almeida Corrigida Fiel
  KJV: 'kjv', // King James Version
  BBE: 'bbe', // Bible in Basic English
  APEE: 'apee', // A Palavra de Esperança Eterna
  RVR: 'rvr'  // Reina-Valera Revisada
} as const;

export type BibleVersion = typeof BIBLE_VERSIONS[keyof typeof BIBLE_VERSIONS];

// Headers para autenticação
export const getAuthHeaders = (token?: string): Record<string, string> => {
  const authToken = token || BIBLE_API_CONFIG.TOKEN;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};

// Mapeamento de livros bíblicos (português -> abreviação)
export const BOOK_ABBREVIATIONS: Record<string, string> = {
  // Antigo Testamento
  'gênesis': 'gn', 'genesis': 'gn',
  'êxodo': 'ex', 'exodo': 'ex',
  'levítico': 'lv', 'levitico': 'lv',
  'números': 'nm', 'numeros': 'nm',
  'deuteronômio': 'dt', 'deuteronomio': 'dt',
  'josué': 'js', 'josue': 'js',
  'juízes': 'jz', 'juizes': 'jz',
  'rute': 'rt',
  '1samuel': '1sm', '1 samuel': '1sm',
  '2samuel': '2sm', '2 samuel': '2sm',
  '1reis': '1rs', '1 reis': '1rs',
  '2reis': '2rs', '2 reis': '2rs',
  '1crônicas': '1cr', '1 cronicas': '1cr',
  '2crônicas': '2cr', '2 cronicas': '2cr',
  'esdras': 'ed',
  'neemias': 'ne',
  'ester': 'et',
  'jó': 'jo', 'jo': 'jo',
  'salmos': 'sl', 'salmo': 'sl',
  'provérbios': 'pv', 'proverbios': 'pv',
  'eclesiastes': 'ec',
  'cantares': 'ct', 'cânticos': 'ct',
  'isaías': 'is', 'isaias': 'is',
  'jeremias': 'jr',
  'lamentações': 'lm', 'lamentacoes': 'lm',
  'ezequiel': 'ez',
  'daniel': 'dn',
  'oséias': 'os', 'oseias': 'os',
  'joel': 'jl',
  'amós': 'am', 'amos': 'am',
  'obadias': 'ob',
  'jonas': 'jn',
  'miquéias': 'mq', 'miqueias': 'mq',
  'naum': 'na',
  'habacuque': 'hc',
  'sofonias': 'sf',
  'ageu': 'ag',
  'zacarias': 'zc',
  'malaquias': 'ml',
  
  // Novo Testamento
  'mateus': 'mt',
  'marcos': 'mc',
  'lucas': 'lc',
  'joão': 'jo', 'joao': 'jo',
  'atos': 'at',
  'romanos': 'rm',
  '1coríntios': '1co', '1 corintios': '1co',
  '2coríntios': '2co', '2 corintios': '2co',
  'gálatas': 'gl', 'galatas': 'gl',
  'efésios': 'ef', 'efesios': 'ef',
  'filipenses': 'fp',
  'colossenses': 'cl',
  '1tessalonicenses': '1ts', '1 tessalonicenses': '1ts',
  '2tessalonicenses': '2ts', '2 tessalonicenses': '2ts',
  '1timóteo': '1tm', '1 timoteo': '1tm',
  '2timóteo': '2tm', '2 timoteo': '2tm',
  'tito': 'tt',
  'filemom': 'fm',
  'hebreus': 'hb',
  'tiago': 'tg',
  '1pedro': '1pe', '1 pedro': '1pe',
  '2pedro': '2pe', '2 pedro': '2pe',
  '1joão': '1jo', '1 joao': '1jo',
  '2joão': '2jo', '2 joao': '2jo',
  '3joão': '3jo', '3 joao': '3jo',
  'judas': 'jd',
  'apocalipse': 'ap'
};

export default BIBLE_API_CONFIG;
