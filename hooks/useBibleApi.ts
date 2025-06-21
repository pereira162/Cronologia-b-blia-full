// Hook React para integração com a API da Bíblia Digital
import { useState, useCallback } from 'react';
import {
  getBooks,
  getVerseByReference,
  type BibleBook,
  type BibleReferenceResult
} from '../services/bibleService';

interface UseBibleApiState {
  loading: boolean;
  error: string | null;
  books: BibleBook[];
  currentReference: BibleReferenceResult | null;
}

export function useBibleApi() {
  const [state, setState] = useState<UseBibleApiState>({
    loading: false,
    error: null,
    books: [],
    currentReference: null
  });

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearResults = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentReference: null
    }));
  }, []);

  const fetchBooks = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const books = await getBooks();
      setState(prev => ({ ...prev, books, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar livros';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  const fetchByReference = useCallback(async (reference: string, version: string = 'nvi') => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await getVerseByReference(reference, version);
      setState(prev => ({ ...prev, currentReference: result, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar referência';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  return {
    ...state,
    fetchBooks,
    fetchByReference,
    clearError,
    clearResults
  };
}

export default useBibleApi;