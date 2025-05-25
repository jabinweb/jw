"use client"

import { useState, useEffect, useRef, KeyboardEvent } from "react"
import { SearchIcon, Loader2, X, Wand2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearch } from "@/hooks/use-search"
import { SearchResults } from "./search-results"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useAISearch } from "@/hooks/use-ai-search"

interface GlobalSearchProps {
  className?: string
  variant?: "icon" | "input" | "command"
}

export function GlobalSearch({ 
  className, 
  variant = "input"
}: GlobalSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [totalItems, setTotalItems] = useState(0)
  const debouncedQuery = useDebounce(query, 150) // Reduced from 300ms to 150ms
  const router = useRouter()
  const { results, isLoading, search, error } = useSearch()
  const inputRef = useRef<HTMLInputElement>(null)

  // Calculate total items for keyboard navigation
  useEffect(() => {
    const total = (results?.posts?.length || 0) + 
                 (results?.projects?.length || 0) + 
                 (results?.services?.length || 0)
    setTotalItems(total)
    
    // Reset highlighted index when results change
    setHighlightedIndex(total > 0 ? 0 : -1)
  }, [results])
  
  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }, [open])

  // Search when debounced query changes
  useEffect(() => {
    if (query && query.length > 3) {
      search(query)
    }
  }, [query, search])

  // Still use debounced search for shorter queries to avoid too many API calls
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length > 1 && debouncedQuery.length <= 3) {
      search(debouncedQuery)
    }
  }, [debouncedQuery, search])

  // Listen to keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener("keydown", down as any)
    return () => document.removeEventListener("keydown", down as any)
  }, [])

  const handleSelect = (value: string) => {
    setOpen(false)
    router.push(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard navigation
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex(prev => 
        prev < totalItems - 1 ? prev + 1 : 0
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : totalItems - 1
      )
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault()
      // Find the selected item
      const allItems = [
        ...(results?.posts || []).map(p => `/blog/${p.slug}`),
        ...(results?.projects || []).map(p => `/portfolio/${p.slug}`),
        ...(results?.services || []).map(s => `/services/${s.slug}`)
      ]
      
      if (allItems[highlightedIndex]) {
        handleSelect(allItems[highlightedIndex])
      }
    }
  }

  if (variant === "icon") {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className={className}
          onClick={() => setOpen(true)}
          aria-label="Search"
        >
          <SearchIcon className="h-5 w-5" />
        </Button>
        <SearchDialog 
          open={open} 
          setOpen={setOpen} 
          query={query}
          setQuery={setQuery}
          results={results}
          isLoading={isLoading}
          onSelect={handleSelect}
          error={error}
          highlightedIndex={highlightedIndex}
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
        />
      </>
    )
  }

  // For standard input variant
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <SearchIcon className="w-4 h-4 text-muted-foreground" />
      </div>
      <Input
        className="pl-10 pr-10"
        placeholder="Search or ask AI..."
        value={query}
        onClick={() => setOpen(true)}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute inset-y-0 right-0 px-3 h-full"
          onClick={() => setQuery("")}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
      <SearchDialog 
        open={open} 
        setOpen={setOpen} 
        query={query}
        setQuery={setQuery}
        results={results}
        isLoading={isLoading}
        onSelect={handleSelect}
        error={error}
        highlightedIndex={highlightedIndex}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
      />
    </div>
  )
}

interface SearchDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  results: any;
  isLoading: boolean;
  onSelect: (value: string) => void;
  error: any;
  highlightedIndex: number;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

function SearchDialog({
  open,
  setOpen,
  query,
  setQuery,
  results,
  isLoading,
  onSelect,
  error,
  highlightedIndex,
  onKeyDown,
  inputRef
}: SearchDialogProps) {
  const [searchMode, setSearchMode] = useState<'normal' | 'ai'>('normal')
  const { search: aiSearch, result: aiResult, isLoading: aiLoading, error: aiError } = useAISearch()

  // Switch to AI mode
  const handleAISearch = () => {
    setSearchMode('ai')
    if (query) {
      aiSearch(query)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 gap-0 max-w-lg flex flex-col max-h-[85vh]" onKeyDown={onKeyDown}>
        <div className="flex border-b items-center px-3">
          <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            ref={inputRef}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search across site..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          
          {/* AI Mode Toggle Button */}
          <Button 
            variant="ghost" 
            size="sm"
            className="ml-2"
            onClick={handleAISearch}
            disabled={!query}
          >
            <Wand2 className={cn(
              "h-4 w-4",
              searchMode === 'ai' ? "text-primary" : "text-muted-foreground"
            )} />
            <span className="sr-only">Ask AI</span>
          </Button>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {/* Show regular search results or AI results based on mode */}
          {searchMode === 'normal' ? (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  {!query && (
                    <p className="py-6 text-center text-sm">
                      Enter at least 2 characters to search or try asking AI
                    </p>
                  )}
                  
                  {query.length > 1 && !error && 
                  (!results || !results.totalResults || results.totalResults === 0) && (
                    <div className="py-6 text-center">
                      <p className="text-sm mb-3">No results found</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleAISearch}
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        Ask AI Instead
                      </Button>
                    </div>
                  )}
                  
                  <SearchResults 
                    results={results} 
                    onSelect={onSelect} 
                    error={error} 
                    highlightedIndex={highlightedIndex}
                  />
                </>
              )}
            </>
          ) : (
            <>
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Thinking about your question...
                  </p>
                </div>
              ) : (
                <>
                  {aiError ? (
                    <div className="py-6 text-center">
                      <p className="text-sm text-destructive mb-2">{aiError}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSearchMode('normal')}
                      >
                        Back to Search
                      </Button>
                    </div>
                  ) : (
                    <>
                      {aiResult && (
                        <div className="p-4">
                          <div className="prose prose-sm dark:prose-invert overflow-y-auto max-h-[40vh] custom-scrollbar">
                            {aiResult.aiResponse.split('\n').map((line: string, i: number) => (
                              line.trim() ? <p key={i}>{line}</p> : <br key={i} />
                            ))}
                          </div>
                          <div className="mt-4 pt-2 border-t text-xs text-muted-foreground flex justify-between items-center">
                            <span>Generated by AI</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSearchMode('normal')}
                            >
                              Back to Search
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
          
          {/* Footer information */}
          {searchMode === 'normal' && !isLoading && results?.totalResults > 0 && (
            <div className="px-2 py-1 text-xs text-muted-foreground border-t">
              Found {results.totalResults} results
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
