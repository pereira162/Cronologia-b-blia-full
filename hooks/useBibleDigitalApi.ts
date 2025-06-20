// Hook React para integração com a API da Bíblia Digital
// Substitui o antigo useBibleApi.ts para usar a nova API

import { useState, useCallback } from 'react';
import { bibleService, BibleVerseResponse, BibleChapterResponse, BibleVersionInfo } from '../services/bibleService';
import { BIBLE_VERSIONS, BibleVersion } from '../config/bibleConfig';

// Interface para o estado do versículo/capítulo unificado
export interface BibleContent {
  // Para versículo único
  verse?: BibleVerseResponse;
  // Para capítulo completo
  chapter?: BibleChapterResponse;
  // Para múltiplos versículos (busca)
  verses?: BibleVerseResponse[];
  // Referência original
  reference: string;
  // Versão utilizada
  version: string;
  // Tipo de conteúdo
  type: 'verse' | 'chapter' | 'range' | 'search';
}

export interface UseBibleDigitalApiReturn {
  // Estado
  content: BibleContent | null;
  loading: boolean;
  error: string | null;
  
  // Ações principais
  fetchVerse: (reference: string, version?: BibleVersion) => Promise<void>;
  fetchContent: (reference: string, version?: BibleVersion) => Promise<BibleContent>;
  searchVerses: (term: string, version?: BibleVersion) => Promise<void>;
  getRandomVerse: (version?: BibleVersion, book?: string) => Promise<void>;
  
  // Informações da API
  getAvailableTranslations: () => Array<{ id: BibleVersion; name: string; language: string }>;
  versions: BibleVersionInfo[];
  loadVersions: () => Promise<void>;
  
  // Utilitários
  clearContent: () => void;
  createUser: () => Promise<void>;
}

export const useBibleDigitalApi = (): UseBibleDigitalApiReturn => {
  const [content, setContent] = useState<BibleContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [versions, setVersions] = useState<BibleVersionInfo[]>([]);

  // Limpar estado
  const clearContent = useCallback(() => {
    setContent(null);
    setError(null);
  }, []);

  // Criar usuário na API
  const createUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = await bibleService.createUser();
      console.log('Usuário criado com sucesso:', user);
      console.log('Token do usuário:', user.token);
      console.log('IMPORTANTE: Salve este token nas variáveis de ambiente como REACT_APP_BIBLE_API_TOKEN');
      
      // Salvar token temporariamente no localStorage para esta sessão
      localStorage.setItem('bible_api_token', user.token);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar usuário';
      setError(errorMessage);
      console.error('Erro ao criar usuário:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar versões disponíveis
  const loadVersions = useCallback(async () => {
    try {
      const token = localStorage.getItem('bible_api_token') || undefined;
      const versionsData = await bibleService.getVersions(token);
      setVersions(versionsData);
    } catch (err) {
      console.error('Erro ao carregar versões:', err);
    }
  }, []);

  // Buscar conteúdo baseado na referência
  const fetchContent = useCallback(async (reference: string, version: BibleVersion = BIBLE_VERSIONS.NVI): Promise<BibleContent> => {
    try {
      const token = localStorage.getItem('bible_api_token') || undefined;
      const parsed = bibleService.parseReference(reference);
      
      if (parsed.verseStart && parsed.verseEnd && parsed.verseStart !== parsed.verseEnd) {
        // Range de versículos - buscar capítulo completo e filtrar
        const chapterData = await bibleService.getChapter(version, parsed.book, parsed.chapter, token);
        const filteredVerses = chapterData.verses.filter(
          v => v.number >= parsed.verseStart! && v.number <= parsed.verseEnd!
        );
        
        return {
          chapter: {
            ...chapterData,
            verses: filteredVerses
          },
          reference,
          version,
          type: 'range'
        };
      } else if (parsed.verseStart) {
        // Versículo específico
        const verseData = await bibleService.getVerse(version, parsed.book, parsed.chapter, parsed.verseStart, token);
        
        return {
          verse: verseData,
          reference,
          version,
          type: 'verse'
        };
      } else {
        // Capítulo completo
        const chapterData = await bibleService.getChapter(version, parsed.book, parsed.chapter, token);
        
        return {
          chapter: chapterData,
          reference,
          version,
          type: 'chapter'
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar conteúdo bíblico';
      throw new Error(errorMessage);
    }
  }, []);

  // Buscar versículo/capítulo e atualizar estado
  const fetchVerse = useCallback(async (reference: string, version: BibleVersion = BIBLE_VERSIONS.NVI) => {
    try {
      setLoading(true);
      setError(null);
      
      const contentData = await fetchContent(reference, version);
      setContent(contentData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar versículo';
      setError(errorMessage);
      console.error('Erro ao buscar versículo:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchContent]);

  // Buscar versículos por palavra-chave
  const searchVerses = useCallback(async (term: string, version: BibleVersion = BIBLE_VERSIONS.NVI) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('bible_api_token') || undefined;
      const searchResults = await bibleService.searchVerses(version, term, token);
      
      setContent({
        verses: searchResults.verses as BibleVerseResponse[],
        reference: `Busca: "${term}"`,
        version,
        type: 'search'
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro na busca';
      setError(errorMessage);
      console.error('Erro na busca:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar versículo aleatório
  const getRandomVerse = useCallback(async (version: BibleVersion = BIBLE_VERSIONS.NVI, book?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('bible_api_token') || undefined;
      let verseData: BibleVerseResponse;
      
      if (book) {
        const bookAbbrev = bibleService.parseBookName(book);
        verseData = await bibleService.getRandomVerseFromBook(version, bookAbbrev, token);
      } else {
        verseData = await bibleService.getRandomVerse(version, token);
      }
      
      setContent({
        verse: verseData,
        reference: `${verseData.book.name} ${verseData.chapter.number}:${verseData.number}`,
        version,
        type: 'verse'
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar versículo aleatório';
      setError(errorMessage);
      console.error('Erro ao buscar versículo aleatório:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter traduções disponíveis
  const getAvailableTranslations = useCallback(() => {
    return [
      { id: BIBLE_VERSIONS.NVI, name: 'Nova Versão Internacional', language: 'pt-BR' },
      { id: BIBLE_VERSIONS.RA, name: 'Almeida Revista e Atualizada', language: 'pt-BR' },
      { id: BIBLE_VERSIONS.ACF, name: 'Almeida Corrigida Fiel', language: 'pt-BR' },
      { id: BIBLE_VERSIONS.KJV, name: 'King James Version', language: 'en' },
      { id: BIBLE_VERSIONS.BBE, name: 'Bible in Basic English', language: 'en' },
      { id: BIBLE_VERSIONS.APEE, name: 'A Palavra de Esperança Eterna', language: 'pt-BR' },
      { id: BIBLE_VERSIONS.RVR, name: 'Reina-Valera Revisada', language: 'es' }
    ];
  }, []);

  return {
    // Estado
    content,
    loading,
    error,
    
    // Ações principais
    fetchVerse,
    fetchContent,
    searchVerses,
    getRandomVerse,
    
    // Informações da API
    getAvailableTranslations,
    versions,
    loadVersions,
    
    // Utilitários
    clearContent,
    createUser
  };
};

export default useBibleDigitalApi;
