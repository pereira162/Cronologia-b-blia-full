// Serviço para integração com a API da Bíblia Digital
// https://github.com/omarciovsena/abibliadigital/blob/master/DOCUMENTATION.md

import { BIBLE_API_CONFIG, getAuthHeaders, BOOK_ABBREVIATIONS, BibleVersion, BIBLE_VERSIONS } from '../config/bibleConfig';

// Interfaces para resposta da API
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
  verses: number;
}

export interface BibleVerseResponse {
  book: BibleBook;
  chapter: BibleChapter;
  number: number;
  text: string;
  version: string;
  comment?: string;
}

export interface BibleChapterResponse {
  book: BibleBook;
  chapter: BibleChapter;
  verses: BibleVerse[];
}

export interface BibleVersionInfo {
  version: string;
  verses: number;
}

export interface SearchResponse {
  occurrence: number;
  version: string;
  verses: BibleVerse[];
}

export interface UserResponse {
  name: string;
  email: string;
  token: string;
  notifications: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: string;
}

class BibleDigitalService {
  private baseUrl = BIBLE_API_CONFIG.BASE_URL;
  
  // Criar usuário na API
  async createUser(): Promise<UserResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(BIBLE_API_CONFIG.USER_INFO)
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar usuário: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  // Buscar todas as versões disponíveis
  async getVersions(token?: string): Promise<BibleVersionInfo[]> {
    try {
      const response = await fetch(`${this.baseUrl}/versions`, {
        headers: getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar versões: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar versões:', error);
      throw error;
    }
  }

  // Buscar todos os livros
  async getBooks(token?: string): Promise<BibleBook[]> {
    try {
      const response = await fetch(`${this.baseUrl}/books`, {
        headers: getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar livros: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      throw error;
    }
  }

  // Buscar um livro específico
  async getBook(bookAbbrev: string, token?: string): Promise<BibleBook> {
    try {
      const response = await fetch(`${this.baseUrl}/books/${bookAbbrev}`, {
        headers: getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar livro: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      throw error;
    }
  }

  // Buscar um capítulo completo
  async getChapter(version: BibleVersion, bookAbbrev: string, chapter: number, token?: string): Promise<BibleChapterResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/verses/${version}/${bookAbbrev}/${chapter}`, {
        headers: getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar capítulo: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar capítulo:', error);
      throw error;
    }
  }

  // Buscar um versículo específico
  async getVerse(version: BibleVersion, bookAbbrev: string, chapter: number, verse: number, token?: string): Promise<BibleVerseResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/verses/${version}/${bookAbbrev}/${chapter}/${verse}`, {
        headers: getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar versículo: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar versículo:', error);
      throw error;
    }
  }

  // Buscar versículo aleatório
  async getRandomVerse(version: BibleVersion, token?: string): Promise<BibleVerseResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/verses/${version}/random`, {
        headers: getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar versículo aleatório: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar versículo aleatório:', error);
      throw error;
    }
  }

  // Buscar versículo aleatório de um livro específico
  async getRandomVerseFromBook(version: BibleVersion, bookAbbrev: string, token?: string): Promise<BibleVerseResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/verses/${version}/${bookAbbrev}/random`, {
        headers: getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar versículo aleatório do livro: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar versículo aleatório do livro:', error);
      throw error;
    }
  }

  // Buscar por palavra-chave
  async searchVerses(version: BibleVersion, searchTerm: string, token?: string): Promise<SearchResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/verses/search`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          version,
          search: searchTerm
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na busca: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na busca de versículos:', error);
      throw error;
    }
  }

  // Função auxiliar para converter nome do livro para abreviação
  parseBookName(bookName: string): string {
    const normalized = bookName.toLowerCase().trim();
    return BOOK_ABBREVIATIONS[normalized] || bookName.toLowerCase();
  }

  // Função para analisar referência bíblica (ex: "João 3:16", "Gênesis 1:1-3")
  parseReference(reference: string): {
    book: string;
    chapter: number;
    verseStart?: number;
    verseEnd?: number;
  } {
    // Regex para capturar: Livro Capítulo:Versículo ou Livro Capítulo:Versículo-Versículo
    const match = reference.match(/^(.+?)\s+(\d+)(?::(\d+))?(?:-(\d+))?$/);
    
    if (!match) {
      throw new Error(`Formato de referência inválido: ${reference}. Use formato como "João 3:16" ou "Gênesis 1:1-3"`);
    }

    const [, bookName, chapterStr, verseStartStr, verseEndStr] = match;
    const book = this.parseBookName(bookName);
    const chapter = parseInt(chapterStr);
    const verseStart = verseStartStr ? parseInt(verseStartStr) : undefined;
    const verseEnd = verseEndStr ? parseInt(verseEndStr) : undefined;

    return {
      book,
      chapter,
      verseStart,
      verseEnd
    };
  }
}

// Exportar instância única do serviço
export const bibleService = new BibleDigitalService();
export default bibleService;
