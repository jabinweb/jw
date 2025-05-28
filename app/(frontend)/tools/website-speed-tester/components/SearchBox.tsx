"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, AlertCircle } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface SearchBoxProps {
  url: string
  setUrl: (url: string) => void
  loading: boolean
  error: string
  onTest: () => void
}

export function SearchBox({ url, setUrl, loading, error, onTest }: SearchBoxProps) {
  return (
    <Card className="max-w-2xl mx-auto mb-8 sm:mb-12 p-6 sm:p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl shadow-lg">
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Enter Website URL
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            We&apos;ll analyze your website&apos;s performance and provide detailed insights
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <Input
              type="url"
              placeholder="example.com or https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && onTest()}
              disabled={loading}
              className="w-full h-12 sm:h-14 text-base sm:text-lg px-4 sm:px-6 rounded-xl border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <Button
            onClick={onTest}
            disabled={loading || !url.trim()}
            className="h-12 sm:h-14 px-6 sm:px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
          >
            {loading ? (
              <>
                <LoadingSpinner className="mr-2" />
                <span className="hidden sm:inline">Analyzing...</span>
                <span className="sm:hidden">Testing...</span>
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Analyze Website</span>
                <span className="sm:hidden">Analyze</span>
              </>
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="rounded-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm sm:text-base">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <p>
            Powered by Google PageSpeed Insights • 
            <span className="mx-1">Free tool by Jabin</span>
          </p>
        </div>
      </div>
    </Card>
  )
}
