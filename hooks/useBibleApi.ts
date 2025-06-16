// useBibleApi.ts
// Custom hook for fetching Bible verses from API
// Using the Bible API (https://bible-api.com/) for free access to Bible verses

import { useState, useCallback } from 'react';

export interface BibleVerse {
  reference: string;
  verses: Array<{
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }>;
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

export interface BibleApiState {
  verse: BibleVerse | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for fetching Bible verses from API
 * 
 * @returns Object with verse data, loading state, error state, and fetch function
 * 
 * @example
 * const { verse, loading, error, fetchVerse } = useBibleApi();
 * fetchVerse('João 3:16'); // Fetches John 3:16
 */
export function useBibleApi() {
  const [state, setState] = useState<BibleApiState>({
    verse: null,
    loading: false,
    error: null,
  });

  /**
   * Fetch a Bible verse by reference
   * @param reference - Bible reference (e.g., "João 3:16", "Gênesis 1:1")
   * @param translation - Translation to use (default: 'almeida')
   */
  const fetchVerse = useCallback(async (reference: string, translation: string = 'almeida') => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Clean and format the reference
      const formattedReference = encodeURIComponent(reference);
      
      // Try multiple API endpoints for better reliability
      const apiEndpoints = [
        `https://bible-api.com/${formattedReference}?translation=${translation}`,
        `https://bible-api.com/${formattedReference}`, // Fallback without translation
      ];

      let response: Response | null = null;
      let lastError: Error | null = null;

      for (const endpoint of apiEndpoints) {
        try {
          response = await fetch(endpoint);
          if (response.ok) break;
        } catch (err) {
          lastError = err as Error;
          continue;
        }
      }

      if (!response || !response.ok) {
        throw new Error(lastError?.message || 'Erro ao buscar versículo bíblico');
      }

      const data: BibleVerse = await response.json();
      
      setState({
        verse: data,
        loading: false,
        error: null,
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar versículo';
      
      setState({
        verse: null,
        loading: false,
        error: errorMessage,
      });

      throw err;
    }
  }, []);

  /**
   * Clear current verse and error state
   */
  const clearVerse = useCallback(() => {
    setState({
      verse: null,
      loading: false,
      error: null,
    });
  }, []);

  /**
   * Parse a Bible reference into components
   * @param reference - Bible reference string
   * @returns Parsed components
   */
  const parseReference = useCallback((reference: string) => {
    // Simple regex to parse references like "João 3:16" or "Gênesis 1:1-3"
    const match = reference.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
    
    if (match) {
      return {
        book: match[1],
        chapter: parseInt(match[2]),
        verseStart: parseInt(match[3]),
        verseEnd: match[4] ? parseInt(match[4]) : undefined,
      };
    }
    
    return null;
  }, []);

  return {
    ...state,
    fetchVerse,
    clearVerse,
    parseReference,
  };
}
