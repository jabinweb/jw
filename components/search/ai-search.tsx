"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Wand2, SendHorizontal, Loader2 } from "lucide-react"
import { useAISearch } from "@/hooks/use-ai-search"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface AISearchProps {
  className?: string
  variant?: "icon" | "full" | "minimal"
}

export function AISearch({ className, variant = "icon" }: AISearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const { search, result, isLoading, error, reset } = useAISearch()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  const handleSearch = () => {
    if (query.trim()) {
      search(query)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  const closeDialog = () => {
    setOpen(false)
    setQuery("")
    reset()
  }

  if (variant === "icon") {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className={className}
          onClick={() => setOpen(true)}
          aria-label="AI Search"
        >
          <Wand2 className="h-5 w-5" />
        </Button>
        <AISearchDialog
          open={open}
          setOpen={setOpen}
          query={query}
          setQuery={setQuery}
          handleSearch={handleSearch}
          handleKeyDown={handleKeyDown}
          result={result}
          isLoading={isLoading}
          error={error}
          closeDialog={closeDialog}
          inputRef={inputRef}
        />
      </>
    )
  }

  if (variant === "minimal") {
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn("gap-2", className)}
        onClick={() => setOpen(true)}
      >
        <Wand2 className="h-4 w-4" />
        <span>Ask AI</span>
        <AISearchDialog
          open={open}
          setOpen={setOpen}
          query={query}
          setQuery={setQuery}
          handleSearch={handleSearch}
          handleKeyDown={handleKeyDown}
          result={result}
          isLoading={isLoading}
          error={error}
          closeDialog={closeDialog}
          inputRef={inputRef}
        />
      </Button>
    )
  }

  // Full variant renders the input directly
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9 pr-14"
            placeholder="Ask AI about our services..."
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <Button onClick={handleSearch} disabled={isLoading}>
          <SendHorizontal className="h-4 w-4 mr-2" />
          Ask
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Response</CardTitle>
            <CardDescription>Based on your query: &quot;{result.query}&quot;</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert">
              {result.aiResponse.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function AISearchDialog({
  open,
  setOpen,
  query,
  setQuery,
  handleSearch,
  handleKeyDown,
  result,
  isLoading,
  error,
  closeDialog,
  inputRef
}: {
  open: boolean
  setOpen: (open: boolean) => void
  query: string
  setQuery: (query: string) => void
  handleSearch: () => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  result: any
  isLoading: boolean
  error: string | null
  closeDialog: () => void
  inputRef: React.RefObject<HTMLInputElement>
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>AI-Powered Search</DialogTitle>
          <DialogDescription>
            Ask a question about our services, web design, development, or digital marketing.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="relative mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-9 pr-14"
                  placeholder="e.g., How can you help improve my site's SEO?"
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <SendHorizontal className="h-4 w-4 mr-2" />
                    Ask
                  </>
                )}
              </Button>
            </div>
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          </div>

          <div className="overflow-y-auto flex-grow pr-1">
            {result && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Response</CardTitle>
                </CardHeader>
                <CardContent className="overflow-y-auto max-h-[40vh] custom-scrollbar">
                  <div className="prose prose-sm dark:prose-invert">
                    {result.aiResponse.split('\n').map((line: string, i: number) => (
                      line.trim() ? <p key={i}>{line}</p> : <br key={i} />
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
                  Remember, AI responses are generated automatically and may not be 100% accurate.
                </CardFooter>
              </Card>
            )}

            {isLoading && !result && (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">
                  Thinking about your question...
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
