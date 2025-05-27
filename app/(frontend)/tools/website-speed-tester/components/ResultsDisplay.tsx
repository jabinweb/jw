import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Calendar,
  Smartphone,
  Monitor,
  Eye,
  Download,
  Globe,
  BarChart3
} from "lucide-react"

interface CoreWebVitals {
  lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  fid: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  fcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  ttfb: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
}

interface Recommendation {
  category: string
  issue: string
  impact: 'high' | 'medium' | 'low'
  solution: string
}

interface ResultsDisplayProps {
  result: {
    overall: {
      score: number
      rating: 'fast' | 'average' | 'slow'
      loadTime: number
    }
    timestamp: string
    metrics: CoreWebVitals
    performance: {
      pageSize: number
      requests: number
      compression: boolean
      caching: boolean
      images: {
        total: number
        optimized: number
        unoptimized: number
      }
    }
    mobile: {
      score: number
      responsive: boolean
      viewport: boolean
    }
    recommendations: Recommendation[]
  }
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
      case 'fast':
        return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800'
      case 'needs-improvement':
      case 'average':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800'
      case 'poor':
      case 'slow':
        return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-900/20 dark:border-gray-800'
    }
  }

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'good':
      case 'fast':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'needs-improvement':
      case 'average':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'poor':
      case 'slow':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const formatMetricValue = (metric: string, value: number) => {
    switch (metric) {
      case 'fcp':
      case 'lcp':
      case 'ttfb':
        return `${(value / 1000).toFixed(2)}s`
      case 'fid':
        return `${value}ms`
      case 'cls':
        return value.toFixed(3)
      default:
        return value.toString()
    }
  }

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-3xl shadow-lg overflow-hidden">
      <Tabs defaultValue="vitals" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-50 dark:bg-slate-800 h-16 rounded-none border-b border-slate-200 dark:border-slate-700">
          <TabsTrigger value="vitals" className="h-12 text-base font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="performance" className="h-12 text-base font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">Performance</TabsTrigger>
          <TabsTrigger value="mobile" className="h-12 text-base font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">Mobile</TabsTrigger>
          <TabsTrigger value="recommendations" className="h-12 text-base font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(result.metrics).map(([key, metric]) => (
              <Card key={key} className="p-6 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    {key.toUpperCase()}
                  </span>
                  {getRatingIcon(metric.rating)}
                </div>
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {formatMetricValue(key, metric.value)}
                  </div>
                  <Badge className={`${getRatingColor(metric.rating)} text-xs font-medium px-2 py-1 rounded-md`}>
                    {metric.rating.replace('-', ' ')}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Page Size</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {(result.performance.pageSize / 1024 / 1024).toFixed(2)} MB
              </div>
            </Card>

            <Card className="p-6 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Requests</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{result.performance.requests}</div>
            </Card>

            <Card className="p-6 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Images</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{result.performance.images.total}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {result.performance.images.optimized}% optimized
              </div>
            </Card>

            <Card className="p-6 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Compression</span>
              </div>
              <div className="flex items-center gap-3">
                {result.performance.compression ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {result.performance.compression ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mobile" className="p-8 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Mobile Score</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{result.mobile.score}/100</div>
            </Card>

            <Card className="p-6 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <Monitor className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Responsive</span>
              </div>
              <div className="flex items-center gap-3">
                {result.mobile.responsive ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {result.mobile.responsive ? 'Yes' : 'No'}
                </span>
              </div>
            </Card>

            <Card className="p-6 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Viewport</span>
              </div>
              <div className="flex items-center gap-3">
                {result.mobile.viewport ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {result.mobile.viewport ? 'Configured' : 'Missing'}
                </span>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="p-8 space-y-4">
          <div className="space-y-4">
            {result.recommendations.map((rec: Recommendation, index: number) => (
              <Card key={index} className="p-6 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl">
                <div className="flex items-start gap-4">
                  <Badge 
                    variant={rec.impact === 'high' ? 'destructive' : rec.impact === 'medium' ? 'secondary' : 'outline'}
                    className="mt-1 font-medium px-3 py-1 rounded-full"
                  >
                    {rec.impact.toUpperCase()} IMPACT
                  </Badge>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{rec.issue}</h4>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{rec.solution}</p>
                    <Badge variant="outline" className="text-xs font-medium bg-white dark:bg-slate-700 rounded-md">
                      {rec.category}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
