import { useState, useCallback, useRef } from "react"

// Add a cache to store recent search results
const searchResultsCache = new Map<string, any>();
const MAX_CACHE_SIZE = 20;

export interface SearchResults {
  posts: any[]
  projects: any[]
  services: any[]
  totalResults: number
  query: string
}

export function useSearch() {
  const [results, setResults] = useState<SearchResults>({
    posts: [],
    projects: [],
    services: [],
    totalResults: 0,
    query: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string, type?: string) => {
    // Don't search if query is empty or too short
    if (!query || query.trim().length < 2) {
      setResults({
        posts: [],
        projects: [],
        services: [],
        totalResults: 0,
        query: query || ""
      })
      return
    }
    
    // Create cache key
    const cacheKey = `${query.toLowerCase()}-${type || 'all'}`;
    
    // Check cache first
    if (searchResultsCache.has(cacheKey)) {
      const cachedResults = searchResultsCache.get(cacheKey);
      console.log('[SEARCH] Cache hit:', cacheKey);
      setResults(cachedResults);
      return;
    }
    
    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort()
    }
    
    // Create new abort controller for this request
    const controller = new AbortController()
    abortRef.current = controller
    
    try {
      setIsLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      params.set("q", query.trim())
      if (type) params.set("type", type)
      
      const timestamp = Date.now()
      const response = await fetch(
        `/api/search?${params.toString()}&_=${timestamp}`,
        { 
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          },
          cache: 'no-store'
        }
      )
      
      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Create a fresh object with all arrays properly initialized
      const processedResults = {
        posts: Array.isArray(data.posts) ? [...data.posts] : [],
        projects: Array.isArray(data.projects) ? [...data.projects] : [],
        services: Array.isArray(data.services) ? [...data.services] : [],
        totalResults: Number(
          (Array.isArray(data.posts) ? data.posts.length : 0) +
          (Array.isArray(data.projects) ? data.projects.length : 0) +
          (Array.isArray(data.services) ? data.services.length : 0)
        ),
        query: data.query || query
      }
      
      // Store in cache
      searchResultsCache.set(cacheKey, processedResults);
      
      // Manage cache size
      if (searchResultsCache.size > MAX_CACHE_SIZE) {
        const oldestKey = searchResultsCache.keys().next().value;
        if (oldestKey !== undefined) {
          searchResultsCache.delete(oldestKey);
        }
      }
      
      setResults(processedResults)
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setError((error as Error).message || "Search failed")
        setResults({
          posts: [],
          projects: [],
          services: [],
          totalResults: 0,
          query: query
        })
      }
    } finally {
      if (abortRef.current === controller) {
        setIsLoading(false)
      }
    }
  }, [])

  // Create a fresh copy of results to avoid reference issues
  const safeResults = {
    posts: [...(results.posts || [])],
    projects: [...(results.projects || [])],
    services: [...(results.services || [])],
    totalResults: results.totalResults || 0,
    query: results.query || ""
  }

  return { 
    results: safeResults, 
    isLoading, 
    search, 
    error 
  }
}
