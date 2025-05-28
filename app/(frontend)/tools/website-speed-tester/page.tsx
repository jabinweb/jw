"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  Calendar,
  Crown,
  LogIn,
  ArrowRight,
  TrendingUp,
  Zap,
  Smartphone,
  BarChart3
} from "lucide-react"
import { LogoThinking } from "@/components/ui/logo"
import Link from "next/link"
import { useSession } from "next-auth/react"

// Import components
import { SpeedTestHeader } from "./components/SpeedTestHeader"
import { UsageCounter } from "./components/UsageCounter"
import { SearchBox } from "./components/SearchBox"
import { ResultsDisplay } from "./components/ResultsDisplay"
import { AIAnalysisDisplay } from "./components/AIAnalysisDisplay"

interface CoreWebVitals {
  lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  fid: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  fcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  ttfb: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
}

interface PerformanceMetrics {
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

interface Recommendation {
  category: string
  issue: string
  impact: 'high' | 'medium' | 'low'
  solution: string
}

interface SpeedTestResult {
  url: string
  timestamp: string
  overall: {
    score: number
    rating: 'fast' | 'average' | 'slow'
    loadTime: number
  }
  metrics: CoreWebVitals
  performance: PerformanceMetrics
  mobile: {
    score: number
    responsive: boolean
    viewport: boolean
  }
  recommendations: Recommendation[]
  aiAnalysis?: {
    analysis: string
    insights: any
    timestamp: string
  }
}

interface UsageInfo {
  used: number
  limit: number
  remaining: number
  plan?: 'guest' | 'free' | 'basic' | 'premium'
}

export default function WebsiteSpeedTesterPage() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SpeedTestResult | null>(null)
  const [error, setError] = useState("")
  const [usage, setUsage] = useState<UsageInfo | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<string>("")
  const [showAiInsights, setShowAiInsights] = useState(false)
  const { data: session, status } = useSession()

  // Debug session data
  useEffect(() => {
    console.log('Session status:', status)
    console.log('Session data:', { 
      userId: session?.user?.id, 
      email: session?.user?.email,
      name: session?.user?.name 
    })
  }, [session, status])

  const handleTest = async () => {
    if (!url) {
      setError("Please enter a valid URL")
      return
    }

    // Validate URL
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
    } catch {
      setError("Please enter a valid URL (e.g., example.com)")
      return
    }

    setLoading(true)
    setError("")
    
    try {
      console.log('Making speed test request with session:', !!session)
      
      const response = await fetch('/api/tools/speed-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.startsWith('http') ? url : `https://${url}` })
      })

      const data = await response.json()
      
      console.log('Speed test response:', { 
        status: response.status, 
        usage: data.usage,
        error: data.error 
      })

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit exceeded
          setShowUpgradeModal(true)
          setError(data.error)
        } else if (response.status === 401 || data.error === 'User not found') {
          // Authentication/User issues - treat as guest
          console.warn('Authentication issue, continuing as guest:', data.error)
          // Retry the request as guest by clearing any auth headers
          const guestResponse = await fetch('/api/tools/speed-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url.startsWith('http') ? url : `https://${url}` })
          })
          
          const guestData = await guestResponse.json()
          
          if (!guestResponse.ok) {
            if (guestResponse.status === 429) {
              setShowUpgradeModal(true)
              setError(guestData.error)
            } else {
              setError(guestData.error || 'Failed to analyze website')
            }
            return
          }
          
          setResult(guestData)
          setUsage(guestData.usage)
          return
        } else {
          setError(data.error || 'Failed to analyze website')
        }
        return
      }

      setResult(data)
      setUsage(data.usage)
    } catch (err) {
      console.error('Speed test error:', err)
      setError("Failed to analyze website. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAiAnalysis = async () => {
    if (!result || !session?.user) {
      setShowUpgradeModal(true)
      return
    }

    setAiLoading(true)
    try {
      const response = await fetch('/api/tools/speed-test/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speedTestResult: result })
      })

      const data = await response.json()
      
      if (response.ok) {
        setAiAnalysis(data.analysis)
        setShowAiInsights(true)
      } else {
        setAiAnalysis(data.fallback || 'Unable to generate AI analysis at this time.')
        setShowAiInsights(true)
      }
    } catch (error) {
      console.error('AI analysis error:', error)
      setAiAnalysis('Unable to generate AI analysis. Please try again later.')
      setShowAiInsights(true)
    } finally {
      setAiLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <SpeedTestHeader />

        {usage && <UsageCounter usage={usage} />}

        <SearchBox 
          url={url}
          setUrl={setUrl}
          loading={loading}
          error={error}
          onTest={handleTest}
        />

        {/* Upgrade Modal - Mobile Responsive */}
        {showUpgradeModal && (
          <div className="max-w-lg mx-auto mb-8 sm:mb-12 px-4">
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800 rounded-2xl sm:rounded-3xl shadow-lg">
              <div className="text-center">
                {!session || status !== 'authenticated' ? (
                  <>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 dark:bg-orange-900/50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <LogIn className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3">Get More Tests</h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4 sm:mb-6 leading-relaxed">
                      Sign in to unlock 10 free tests per day and save your analysis history.
                    </p>
                    <div className="flex flex-col gap-3">
                      <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl w-full py-3">
                        <Link href="/auth/signin">
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign In Free
                        </Link>
                      </Button>
                      <Button variant="outline" onClick={() => setShowUpgradeModal(false)} className="rounded-xl w-full py-3">
                        Continue as Guest
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900/50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3">Upgrade for Unlimited</h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4 sm:mb-6 leading-relaxed">
                      Get unlimited tests, API access, and priority support with our professional plan.
                    </p>
                    <div className="flex flex-col gap-3">
                      <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-full py-3">
                        <Link href="/pricing">
                          <Crown className="h-4 w-4 mr-2" />
                          View Plans
                        </Link>
                      </Button>
                      <Button variant="outline" onClick={() => setShowUpgradeModal(false)} className="rounded-xl w-full py-3">
                        Continue Free
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Loading State - Mobile Responsive */}
        {loading && (
          <div className="max-w-2xl mx-auto px-4">
            <Card className="p-6 sm:p-8 lg:p-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl shadow-lg text-center">
              <LogoThinking size={48} className="sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3">
                Running PageSpeed Analysis
              </h3>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
                Analyzing performance metrics and Core Web Vitals...
              </p>
              <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm">This usually takes 30-60 seconds</span>
              </div>
            </Card>
          </div>
        )}

        {/* Results Section - Mobile Responsive */}
        {result && (
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            {/* Score Overview - Mobile Stack */}
            <Card className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-2xl sm:rounded-3xl shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Main Score */}
                <div className="text-center sm:col-span-2 lg:col-span-1">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto mb-4 sm:mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="stroke-slate-200 dark:stroke-slate-700"
                        strokeDasharray="100, 100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        strokeWidth="2"
                      />
                      <path
                        className={`stroke-current ${result.overall.score >= 90 ? 'text-green-500' : result.overall.score >= 50 ? 'text-orange-500' : 'text-red-500'}`}
                        strokeDasharray={`${result.overall.score}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{result.overall.score}</span>
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Performance Score</h3>
                  <Badge className={`${getRatingColor(result.overall.rating)} text-sm font-medium px-3 py-1 rounded-full`}>
                    {result.overall.rating.toUpperCase()}
                  </Badge>
                </div>

                {/* Load Time */}
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 dark:bg-blue-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Load Time</h3>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{result.overall.loadTime.toFixed(2)}s</p>
                </div>

                {/* Timestamp */}
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 dark:bg-purple-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Analyzed</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {new Date(result.timestamp).toLocaleDateString()} at {new Date(result.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              {/* AI Analysis Button - Mobile Responsive */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                <Button 
                  onClick={handleAiAnalysis}
                  disabled={aiLoading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 sm:px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                >
                  {aiLoading ? (
                    <>
                      <LogoThinking size={20} className="mr-2" />
                      <span className="hidden sm:inline">Analyzing with AI...</span>
                      <span className="sm:hidden">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-blue-300 rounded-full animate-pulse mr-2"></span>
                      <span className="hidden sm:inline">Get Jabin AI Insights</span>
                      <span className="sm:hidden">AI Insights</span>
                    </>
                  )}
                </Button>
                {!session?.user && (
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Sign in required for Jabin AI analysis
                  </p>
                )}
              </div>
            </Card>

            {/* AI Analysis Results - Mobile Responsive */}
            {showAiInsights && (
              <Card className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800 rounded-2xl sm:rounded-3xl shadow-lg">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-600 rounded-full animate-pulse"></span>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    <span className="hidden sm:inline">Jabin AI Performance Analysis</span>
                    <span className="sm:hidden">AI Analysis</span>
                  </h3>
                </div>
                
                <div className="prose prose-slate dark:prose-invert max-w-none prose-sm sm:prose-base">
                  <AIAnalysisDisplay analysis={aiAnalysis} />
                </div>
                
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-purple-200 dark:border-purple-700 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  ✨ Analysis powered by Jabin AI
                </div>
              </Card>
            )}

            <ResultsDisplay result={result} />

            {/* CTA Section - Mobile Responsive */}
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 rounded-2xl sm:rounded-3xl shadow-lg">
              <div className="text-center max-w-2xl mx-auto">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900/50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4">Ready to Optimize Your Website?</h3>
                <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6 sm:mb-8">
                  Our web performance experts can implement these optimizations and boost your Core Web Vitals scores. 
                  Get a free consultation to discuss your specific needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 sm:px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
                    <Link href="/contact">
                      <span className="hidden sm:inline">Get Free Consultation</span>
                      <span className="sm:hidden">Free Consultation</span>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="font-medium px-6 sm:px-8 py-3 rounded-xl border-slate-300 dark:border-slate-600 w-full sm:w-auto">
                    <Link href="/services">
                      <span className="hidden sm:inline">View Our Services</span>
                      <span className="sm:hidden">Our Services</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Features Section - Mobile Responsive */}
        {!result && !loading && (
          <div className="max-w-6xl mx-auto mt-12 sm:mt-16 lg:mt-20">
            <div className="text-center mb-8 sm:mb-12 px-4">
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4">
                Comprehensive Performance Analysis
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Get detailed insights about your website&apos;s performance with the same metrics Google uses to rank websites.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
              <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3">Core Web Vitals</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Analyze LCP, FID, CLS, FCP, and TTFB metrics that Google uses for search ranking and user experience.
                </p>
              </Card>
              
              <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 dark:bg-green-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Smartphone className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3">Mobile Optimization</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Check mobile responsiveness, viewport configuration, and mobile-specific performance metrics.
                </p>
              </Card>
              
              <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3">Actionable Insights</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Get specific, prioritized recommendations to improve your website&apos;s performance and user experience.
                </p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
