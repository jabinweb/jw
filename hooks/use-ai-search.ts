import { useState } from 'react';

export function useAISearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    query: string;
    aiResponse: string;
    timestamp: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setError('Please enter a search query with at least 2 characters');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI search results');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    search,
    result,
    isLoading,
    error,
    reset: () => {
      setResult(null);
      setError(null);
    },
  };
}
