"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Gauge, Zap, Eye, Clock, Download, Activity, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

interface CoreWebVitals {
  lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  fid: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  fcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  ttfb: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
}

interface PerformanceMetrics {
  coreWebVitals: CoreWebVitals
  performanceScore: number
  loadTime: number
  pageSize: number
  requestCount: number
  lighthouse?: {
    performance: number
    accessibility: number
    bestPractices: number
    seo: number
  }
}

export function PerformanceMetrics() {
  const [data, setData] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPerformanceData()
  }, [])

  const fetchPerformanceData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/analytics/performance')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch performance metrics: ${response.status} ${response.statusText}`)
      }
      
      const performanceData = await response.json()
      setData(performanceData)
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'needs-improvement':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'poor':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'poor':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const formatMetricValue = (metric: string, value: number) => {
    switch (metric) {
      case 'lcp':
      case 'fcp':
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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-6 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 font-medium mb-2">Error Loading Performance Metrics</div>
        <div className="text-sm text-muted-foreground">{error}</div>
        <button 
          onClick={fetchPerformanceData}
          className="mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No performance data available
      </div>
    )
  }

  // Only use lighthouse data if it exists
  const lighthouseScores = data.lighthouse

  return (
    <div className="space-y-6">
      {/* Overall Performance Score */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold">Performance Score</h3>
          <Badge variant={data.performanceScore >= 90 ? "default" : data.performanceScore >= 75 ? "secondary" : "destructive"}>
            {data.performanceScore}/100
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 w-full">
            <Progress value={data.performanceScore} className="h-3" />
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary" />
            <span className="text-xl sm:text-2xl font-bold">{data.performanceScore}</span>
          </div>
        </div>
      </Card>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Object.entries(data.coreWebVitals).map(([key, vital]) => (
          <Card key={key} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase text-muted-foreground">
                {key.toUpperCase()}
              </span>
              {getRatingIcon(vital.rating)}
            </div>
            <div className="space-y-2">
              <div className="text-xl sm:text-2xl font-bold">
                {formatMetricValue(key, vital.value)}
              </div>
              <Badge className={`text-xs ${getRatingColor(vital.rating)}`}>
                {vital.rating?.replace('-', ' ')}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-2 leading-tight">
              {key === 'lcp' && 'Largest Contentful Paint'}
              {key === 'fid' && 'First Input Delay'}
              {key === 'cls' && 'Cumulative Layout Shift'}
              {key === 'fcp' && 'First Contentful Paint'}
              {key === 'ttfb' && 'Time to First Byte'}
            </div>
          </Card>
        ))}
      </div>

      {/* Lighthouse Scores - only show if data exists */}
      {lighthouseScores && (
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-6">Lighthouse Scores</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {Object.entries(lighthouseScores).map(([category, score]) => (
              <div key={category} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-muted stroke-current"
                      strokeDasharray="100, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeWidth="2"
                    />
                    <path
                      className={`stroke-current ${score >= 90 ? 'text-green-500' : score >= 75 ? 'text-yellow-500' : 'text-red-500'}`}
                      strokeDasharray={`${score}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">{score}</span>
                  </div>
                </div>
                <span className="text-sm font-medium capitalize text-center block">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Load Time</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold">{(data.loadTime / 1000).toFixed(2)}s</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Download className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Page Size</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold">{(data.pageSize / 1024).toFixed(1)} KB</div>
        </Card>

        <Card className="p-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-muted-foreground">Requests</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold">{data.requestCount}</div>
        </Card>
      </div>
    </div>
  )
}
