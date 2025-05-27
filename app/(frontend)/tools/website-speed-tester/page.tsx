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
      <div className="container mx-auto px-4 py-12">
        <SpeedTestHeader />

        {usage && <UsageCounter usage={usage} />}

        <SearchBox 
          url={url}
          setUrl={setUrl}
          loading={loading}
          error={error}
          onTest={handleTest}
        />

        {/* Upgrade Modal - Clean Professional Design */}
        {showUpgradeModal && (
          <div className="max-w-lg mx-auto mb-12">
            <Card className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800 rounded-3xl shadow-lg">
              <div className="text-center">
                {!session || status !== 'authenticated' ? (
                  <>
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <LogIn className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">Get More Tests</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                      Sign in to unlock 10 free tests per day and save your analysis history.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl">
                        <Link href="/auth/signin">
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign In Free
                        </Link>
                      </Button>
                      <Button variant="outline" onClick={() => setShowUpgradeModal(false)} className="rounded-xl">
                        Continue as Guest
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Crown className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">Upgrade for Unlimited</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                      Get unlimited tests, API access, and priority support with our professional plan.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                        <Link href="/pricing">
                          <Crown className="h-4 w-4 mr-2" />
                          View Plans
                        </Link>
                      </Button>
                      <Button variant="outline" onClick={() => setShowUpgradeModal(false)} className="rounded-xl">
                        Continue Free
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Loading State - Professional */}
        {loading && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-3xl shadow-lg text-center">
              <LogoThinking size={64} className="mx-auto mb-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Running PageSpeed Analysis
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                Analyzing performance metrics and Core Web Vitals...
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span>This usually takes 30-60 seconds</span>
              </div>
            </Card>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Score Overview */}
            <Card className="p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-3xl shadow-lg">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Main Score */}
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
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
                      <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{result.overall.score}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Performance Score</h3>
                  <Badge className={`${getRatingColor(result.overall.rating)} text-sm font-medium px-3 py-1 rounded-full`}>
                    {result.overall.rating.toUpperCase()}
                  </Badge>
                </div>

                {/* Load Time */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Clock className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Load Time</h3>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{result.overall.loadTime.toFixed(2)}s</p>
                </div>

                {/* Timestamp */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Calendar className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Analyzed</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(result.timestamp).toLocaleDateString()} at {new Date(result.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              {/* AI Analysis Button */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                <Button 
                  onClick={handleAiAnalysis}
                  disabled={aiLoading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  {aiLoading ? (
                    <>
                      <LogoThinking size={20} className="mr-2" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-blue-300 rounded-full animate-pulse mr-2"></span>
                      Get Jabin AI Insights
                    </>
                  )}
                </Button>
                {!session?.user && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Sign in required for Jabin AI analysis
                  </p>
                )}
              </div>
            </Card>

            {/* AI Analysis Results */}
            {showAiInsights && (
              <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800 rounded-3xl shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
                    <span className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"></span>
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Jabin AI Performance Analysis</h3>
                </div>
                
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <AIAnalysisDisplay analysis={aiAnalysis} />
                </div>
                
                <div className="mt-6 pt-4 border-t border-purple-200 dark:border-purple-700 text-sm text-slate-500 dark:text-slate-400">
                  ✨ Analysis powered by Jabin AI
                </div>
              </Card>
            )}

            <ResultsDisplay result={result} />

            {/* CTA Section - Professional */}
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 rounded-3xl shadow-lg">
              <div className="text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Ready to Optimize Your Website?</h3>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
                  Our web performance experts can implement these optimizations and boost your Core Web Vitals scores. 
                  Get a free consultation to discuss your specific needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all">
                    <Link href="/contact">
                      Get Free Consultation
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="font-medium px-8 py-3 rounded-xl border-slate-300 dark:border-slate-600">
                    <Link href="/services">View Our Services</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Features Section - When No Results */}
        {!result && !loading && (
          <div className="max-w-6xl mx-auto mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Comprehensive Performance Analysis
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Get detailed insights about your website&apos;s performance with the same metrics Google uses to rank websites.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">Core Web Vitals</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Analyze LCP, FID, CLS, FCP, and TTFB metrics that Google uses for search ranking and user experience.
                </p>
              </Card>
              
              <Card className="p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">Mobile Optimization</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Check mobile responsiveness, viewport configuration, and mobile-specific performance metrics.
                </p>
              </Card>
              
              <Card className="p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">Actionable Insights</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
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
