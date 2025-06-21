// services/bibleService.ts
// Serviço para integração com a API da Bíblia Digital
// Reescrito para suportar múltiplos formatos de referência e realizar múltiplas requisições conforme limitações da API

const BIBLE_API_URL = 'https://www.abibliadigital.com.br/api';
const API_TOKEN = import.meta.env.VITE_ABIBLIADIGITAL_API_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHIiOiJGcmkgSnVuIDIwIDIwMjUgMjA6NTU6MTAgR01UKzAwMDAuNjg1NWM4ZGRlYWQxNDAwMDI4MDc0NTRkIiwiaWF0IjoxNzUwNDUyOTEwfQ.9cYLxYDbDyFcXV3oVeSbA1KmIpz0zsJWxMwQOMu54XU';

// Mapeamento de nomes de livros para abreviações da API
const BOOK_MAPPING: { [key: string]: string } = {
  // Antigo Testamento
  'genesis': 'gn',
  'gênesis': 'gn',
  'gn': 'gn',
  'êxodo': 'ex',
  'exodo': 'ex',
  'ex': 'ex',
  'levítico': 'lv',
  'levitico': 'lv',
  'lv': 'lv',
  'números': 'nm',
  'numeros': 'nm',
  'nm': 'nm',
  'deuteronômio': 'dt',
  'deuteronomio': 'dt',
  'dt': 'dt',
  'josué': 'js',
  'josue': 'js',
  'js': 'js',
  'juízes': 'jz',
  'juizes': 'jz',
  'jz': 'jz',
  'rute': 'rt',
  'rt': 'rt',
  '1samuel': '1sm',
  '1 samuel': '1sm',
  '2samuel': '2sm',
  '2 samuel': '2sm',
  '1reis': '1rs',
  '1 reis': '1rs',
  '2reis': '2rs',
  '2 reis': '2rs',
  '1crônicas': '1cr',
  '1 crônicas': '1cr',
  '1cronicas': '1cr',
  '2crônicas': '2cr',
  '2 crônicas': '2cr',
  '2cronicas': '2cr',
  'esdras': 'ed',
  'ed': 'ed',
  'neemias': 'ne',
  'ne': 'ne',
  'ester': 'et',
  'et': 'et',  'jó': 'job',
  'job': 'job',
  'salmos': 'sl',
  'sl': 'sl',
  'provérbios': 'pv',
  'proverbios': 'pv',
  'pv': 'pv',
  'eclesiastes': 'ec',
  'ec': 'ec',
  'cantares': 'ct',
  'ct': 'ct',
  'isaías': 'is',
  'isaias': 'is',
  'is': 'is',
  'jeremias': 'jr',
  'jr': 'jr',
  'lamentações': 'lm',
  'lamentacoes': 'lm',
  'lm': 'lm',
  'ezequiel': 'ez',
  'ez': 'ez',
  'daniel': 'dn',
  'dn': 'dn',
  'oséias': 'os',
  'oseias': 'os',
  'os': 'os',
  'joel': 'jl',
  'jl': 'jl',
  'amós': 'am',
  'amos': 'am',
  'am': 'am',
  'obadias': 'ob',
  'ob': 'ob',
  'jonas': 'jn',
  'jn': 'jn',
  'miquéias': 'mq',
  'miqueias': 'mq',
  'mq': 'mq',
  'naum': 'na',
  'na': 'na',
  'habacuque': 'hc',
  'hc': 'hc',
  'sofonias': 'sf',
  'sf': 'sf',
  'ageu': 'ag',
  'ag': 'ag',
  'zacarias': 'zc',
  'zc': 'zc',
  'malaquias': 'ml',
  'ml': 'ml',
  
  // Novo Testamento
  'mateus': 'mt',
  'mt': 'mt',
  'marcos': 'mc',
  'mc': 'mc',
  'lucas': 'lc',
  'lc': 'lc',
  'joão': 'jo',
  'joao': 'jo',
  'jo': 'jo',
  'atos': 'at',
  'at': 'at',
  'romanos': 'rm',
  'rm': 'rm',
  '1coríntios': '1co',
  '1 coríntios': '1co',
  '1corintios': '1co',
  '2coríntios': '2co',
  '2 coríntios': '2co',
  '2corintios': '2co',
  'gálatas': 'gl',
  'galatas': 'gl',
  'gl': 'gl',
  'efésios': 'ef',
  'efesios': 'ef',
  'ef': 'ef',
  'filipenses': 'fp',
  'fp': 'fp',
  'colossenses': 'cl',
  'cl': 'cl',
  '1tessalonicenses': '1ts',
  '1 tessalonicenses': '1ts',
  '2tessalonicenses': '2ts',
  '2 tessalonicenses': '2ts',
  '1timóteo': '1tm',
  '1 timóteo': '1tm',
  '1timoteo': '1tm',
  '2timóteo': '2tm',
  '2 timóteo': '2tm',
  '2timoteo': '2tm',
  'tito': 'tt',
  'tt': 'tt',
  'filemom': 'fm',
  'fm': 'fm',
  'hebreus': 'hb',
  'hb': 'hb',
  'tiago': 'tg',
  'tg': 'tg',
  '1pedro': '1pe',
  '1 pedro': '1pe',
  '2pedro': '2pe',
  '2 pedro': '2pe',
  '1joão': '1jo',
  '1 joão': '1jo',
  '1joao': '1jo',
  '2joão': '2jo',
  '2 joão': '2jo',
  '2joao': '2jo',
  '3joão': '3jo',
  '3 joão': '3jo',
  '3joao': '3jo',
  'judas': 'jd',
  'jd': 'jd',
  'apocalipse': 'ap',
  'ap': 'ap'
};

// Interfaces para tipos de dados da API
export interface BibleBook {
  abbrev: {
    pt: string;
    en: string;
  };
  author: string;
  chapters: number;
  group: string;
  name: string;
  testament: string;
}

export interface BibleVerse {
  number: number;
  text: string;
}

export interface BibleChapter {
  number: number;
  verses: BibleVerse[];
}

export interface BibleReferenceResult {
  book: BibleBook;
  chapters: BibleChapter[];
  reference: string;
  version: string;
  versionName?: string;
  totalVerses?: number;
  content?: string;
  text?: string; // Para compatibilidade com diferentes formatos de resposta
}

// Função para buscar livros da Bíblia
export async function getBooks(): Promise<BibleBook[]> {
  try {
    const response = await fetch(`${BIBLE_API_URL}/books`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar livros: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar livros da Bíblia:', error);
    throw error;
  }
}

// Função simplificada para buscar versículos por referência
export async function getVerseByReference(reference: string, version: string = 'acf'): Promise<BibleReferenceResult> {
  try {
    // Validar entrada
    if (!reference || typeof reference !== 'string' || reference.trim() === '') {
      throw new Error('Referência inválida ou não fornecida');
    }

    // Parse da referência com validação
    const trimmedRef = reference.trim();
    const parts = trimmedRef.split(' ');
    
    if (parts.length < 2) {
      throw new Error(`Formato de referência inválido: ${reference}`);
    }
    const bookName = parts[0];
    // Mapear nome do livro para abreviação da API
    const normalizedBookName = bookName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const bookAbbrev = BOOK_MAPPING[normalizedBookName] || BOOK_MAPPING[bookName.toLowerCase()] || bookName.toLowerCase();


    // Determinar versão a usar (suporta apenas ACF e NVI; padrão ACF)
    const providedVersion = version.toLowerCase();
    const usedVersion = providedVersion === 'nvi' ? 'nvi' : 'acf';
    const versionName = usedVersion === 'nvi' ? 'Nova Versão Internacional' : 'Almeida Corrigida Fiel';

    // Extrair múltiplas referências separadas por vírgula (ex: "4:25, 5:3-8")
    const rawRefs = parts.slice(1).join(' ').split(',').map(r => r.trim()).filter(r => r);
    const urls: string[] = [];
    rawRefs.forEach(ref => {
      const verseRangeMatch = ref.match(/^(\d+):(\d+)-(\d+)$/);
      const chapterRangeMatch = ref.match(/^(\d+)-(\d+)$/);
      if (verseRangeMatch) {
        // Verses range in same chapter
        const chap = parseInt(verseRangeMatch[1], 10);
        const startV = parseInt(verseRangeMatch[2], 10);
        const endV = parseInt(verseRangeMatch[3], 10);
        for (let v = startV; v <= endV; v++) {
          urls.push(`${BIBLE_API_URL}/verses/${usedVersion}/${bookAbbrev}/${chap}/${v}`);
        }
      } else if (chapterRangeMatch) {
        // Multiple full chapters
        const startC = parseInt(chapterRangeMatch[1], 10);
        const endC = parseInt(chapterRangeMatch[2], 10);
        for (let c = startC; c <= endC; c++) {
          urls.push(`${BIBLE_API_URL}/verses/${usedVersion}/${bookAbbrev}/${c}`);
        }
      } else if (ref.includes(':')) {
        // Single verse
        const [chapStr, vStr] = ref.split(':');
        const chap = parseInt(chapStr, 10);
        const v = parseInt(vStr, 10);
        urls.push(`${BIBLE_API_URL}/verses/${usedVersion}/${bookAbbrev}/${chap}/${v}`);
      } else {
        // Single chapter
        const chap = parseInt(ref, 10);
        urls.push(`${BIBLE_API_URL}/verses/${usedVersion}/${bookAbbrev}/${chap}`);
      }
    });

    // Requisições paralelas (ignorar falhas/404)
    const settled = await Promise.allSettled(
      urls.map(u => fetch(u, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }))
    );
    const responses = settled
      .filter((r: any) => r.status === 'fulfilled' && r.value.ok)
      .map((r: any) => r.value);
    if (responses.length === 0) {
      throw new Error('Nenhum versículo encontrado para a versão selecionada');
    }
    // Extrair JSONs e remover aspas desnecessárias
    const datas = await Promise.all(responses.map(r => r.json()));
    datas.forEach((d: any) => {
      if (d.text) d.text = d.text.replace(/^"(.*)"$/, '$1');
      if (d.verses) d.verses.forEach((v: any) => {
        if (v.text) v.text = v.text.replace(/^"(.*)"$/, '$1');
      });
    });

    // Combinar resultados em capítulos e versos
    const chaptersMap: { [chapNum: number]: BibleVerse[] } = {};
    // Associar cada resposta ao URL correspondente para extrair capítulo e verso
    datas.forEach((d, idx) => {
      const url = urls[idx];
      const parts = url.split('/');
      if (d.verses) {
        // resposta de capítulo completo
        const chapNum = parseInt(parts[parts.length - 1], 10);
        d.verses.forEach((v: any) => {
          if (!chaptersMap[chapNum]) chaptersMap[chapNum] = [];
          chaptersMap[chapNum].push({ number: v.number || v.verse, text: v.text });
        });
      } else if (d.text !== undefined) {
        // resposta de versículo único
        const chapNum = parseInt(parts[parts.length - 2], 10);
        const num = parseInt(parts[parts.length - 1], 10);
        if (!chaptersMap[chapNum]) chaptersMap[chapNum] = [];
        chaptersMap[chapNum].push({ number: num, text: d.text });
      }
    });

    const resultChapters = Object.keys(chaptersMap)
      .map(n => parseInt(n, 10))
      .sort((a, b) => a - b)
      .map(c => ({ number: c, verses: chaptersMap[c] }));

    const allVerses = resultChapters.flatMap(ch => ch.verses);
    return {
      book: datas[0].book || { name: bookName, abbrev: { pt: bookName, en: bookName }, author: '', chapters: 0, group: '', testament: '' },
      chapters: resultChapters,
      reference,
      version: usedVersion.toUpperCase(),
      versionName,
      totalVerses: allVerses.length,
      content: allVerses.map(v => v.text).join(' '),
      text: allVerses.map(v => v.text).join(' '),
    };
  } catch (error) {
    console.error('Erro ao buscar referência bíblica:', error);
    throw error;
  }
}
