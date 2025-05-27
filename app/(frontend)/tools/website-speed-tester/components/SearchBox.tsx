import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, AlertTriangle } from "lucide-react"
import { LogoThinking } from "@/components/ui/logo"

interface SearchBoxProps {
  url: string
  setUrl: (url: string) => void
  loading: boolean
  error: string
  onTest: () => void
}

export function SearchBox({ url, setUrl, loading, error, onTest }: SearchBoxProps) {
  return (
    <div className="max-w-2xl mx-auto mb-12">
      <Card className="p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-lg rounded-3xl">
        <div className="space-y-6">
          <div>
            <Label htmlFor="url" className="text-base font-medium text-slate-700 dark:text-slate-300 mb-3 block">
              Enter a web page URL
            </Label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyUp={(e) => e.key === 'Enter' && onTest()}
                  className="h-14 text-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button 
                onClick={onTest} 
                disabled={loading}
                className="h-14 px-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                {loading ? (
                  <LogoThinking size={20} />
                ) : (
                  <>
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive" className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-700 dark:text-red-300">
                {error}
                {error.includes('User not found') && (
                  <div className="mt-2 text-sm">
                    <p>Don&apos;t worry! You can still use the tool as a guest user.</p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>
    </div>
  )
}
