import { useState, useCallback } from 'react';

interface BibleVerse {
  verse: number;
  text: string;
}

interface BibleChapter {
  chapter: number;
  verses: BibleVerse[];
}

interface BibleApiResponse {
  book: string;
  chapters: BibleChapter[];
  translation: string;
}

interface BibleApiError {
  message: string;
  details?: string;
}

interface UseBibleApiReturn {
  fetchVerses: (reference: string, translation?: string) => Promise<BibleApiResponse>;
  loading: boolean;
  error: BibleApiError | null;
}

// Supported translations
export const BIBLE_TRANSLATIONS = {
  ARA: 'ara', // Almeida Revista e Atualizada (Portuguese)
  ACF: 'acf', // Almeida Corrigida Fiel (Portuguese)
  NVI: 'nvi', // Nova Versão Internacional (Portuguese)
  KJV: 'kjv', // King James Version (English)
  ESV: 'esv', // English Standard Version (English)
} as const;

export type BibleTranslation = typeof BIBLE_TRANSLATIONS[keyof typeof BIBLE_TRANSLATIONS];

const API_BASE_URL = 'https://bible-api.com';

export const useBibleApi = (): UseBibleApiReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<BibleApiError | null>(null);

  const parseReference = (reference: string) => {
    // Parse references like "Genesis 1:1-3", "John 3:16", "Matthew 5:1-7:29"
    const match = reference.match(/^(.+?)\s+(\d+)(?::(\d+))?(?:-(?:(\d+):)?(\d+))?$/);
    if (!match) {
      throw new Error('Invalid reference format. Use format like "Genesis 1:1" or "Genesis 1:1-3"');
    }

    const [, book, startChapter, startVerse, endChapter, endVerse] = match;
    
    return {
      book: book.trim(),
      startChapter: parseInt(startChapter),
      startVerse: startVerse ? parseInt(startVerse) : null,
      endChapter: endChapter ? parseInt(endChapter) : null,
      endVerse: endVerse ? parseInt(endVerse) : null,
    };
  };

  const fetchSingleChapter = async (book: string, chapter: number, translation: string): Promise<BibleChapter> => {
    const url = `${API_BASE_URL}/${encodeURIComponent(book)}+${chapter}?translation=${translation}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${book} ${chapter}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.verses || !Array.isArray(data.verses)) {
      throw new Error(`Invalid response format for ${book} ${chapter}`);
    }

    return {
      chapter: chapter,
      verses: data.verses.map((verse: any) => ({
        verse: verse.verse,
        text: verse.text || ''
      }))
    };
  };

  const fetchVerses = useCallback(async (reference: string, translation: string = BIBLE_TRANSLATIONS.ARA): Promise<BibleApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      const parsed = parseReference(reference);
      const chapters: BibleChapter[] = [];

      if (parsed.endChapter && parsed.endChapter !== parsed.startChapter) {
        // Multi-chapter range
        for (let chapterNum = parsed.startChapter; chapterNum <= parsed.endChapter; chapterNum++) {
          const chapter = await fetchSingleChapter(parsed.book, chapterNum, translation);
          
          // Filter verses for first and last chapters if needed
          if (chapterNum === parsed.startChapter && parsed.startVerse) {
            chapter.verses = chapter.verses.filter(v => v.verse >= parsed.startVerse!);
          }
          if (chapterNum === parsed.endChapter && parsed.endVerse) {
            chapter.verses = chapter.verses.filter(v => v.verse <= parsed.endVerse!);
          }
          
          chapters.push(chapter);
        }
      } else {
        // Single chapter
        const chapter = await fetchSingleChapter(parsed.book, parsed.startChapter, translation);
        
        // Filter verses if specific range within chapter
        if (parsed.startVerse || parsed.endVerse) {
          const startVerse = parsed.startVerse || 1;
          const endVerse = parsed.endVerse || Math.max(...chapter.verses.map(v => v.verse));
          chapter.verses = chapter.verses.filter(v => v.verse >= startVerse && v.verse <= endVerse);
        }
        
        chapters.push(chapter);
      }

      return {
        book: parsed.book,
        chapters,
        translation
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      const apiError: BibleApiError = {
        message: 'Failed to fetch Bible verses',
        details: errorMessage
      };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchVerses,
    loading,
    error
  };
};

export default useBibleApi;
