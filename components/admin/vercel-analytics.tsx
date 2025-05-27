"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, Eye, Clock, Globe, MousePointer, Smartphone } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface AnalyticsData {
  pageviews: number
  visitors: number
  countries: string[]
  topPages: Array<{ page: string; views: number }>
  deviceTypes: Array<{ type: string; count: number; percentage: number }>
  trafficData: Array<{ date: string; views: number; visitors: number }>
  bounceRate: number
  avgSessionDuration: number
}

const DEVICE_COLORS = {
  desktop: '#3b82f6',
  mobile: '#10b981',
  tablet: '#f59e0b'
}

export function VercelAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('24h')

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/analytics/vercel')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-6 bg-muted rounded"></div>
            </div>
          ))}
        </div>
        <div className="h-64 bg-muted/50 rounded-lg animate-pulse"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No analytics data available
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2">
        {['24h', '7d', '30d', '90d'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              timeRange === range
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Page Views</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{analytics.pageviews.toLocaleString()}</span>
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5%
            </Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Unique Visitors</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{analytics.visitors.toLocaleString()}</span>
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.3%
            </Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MousePointer className="h-4 w-4 text-red-500" />
            <span className="text-sm text-muted-foreground">Bounce Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{analytics.bounceRate}%</span>
            <Badge variant="secondary" className="text-xs">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2.1%
            </Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-muted-foreground">Avg. Session</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              {Math.floor(analytics.avgSessionDuration / 60)}m {analytics.avgSessionDuration % 60}s
            </span>
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5.2%
            </Badge>
          </div>
        </Card>
      </div>

      {/* Traffic Chart */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Traffic Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.trafficData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="views" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              name="Page Views"
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--primary))' }}
            />
            <Line 
              type="monotone" 
              dataKey="visitors" 
              stroke="hsl(var(--secondary))" 
              strokeWidth={3}
              name="Visitors"
              dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--secondary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Bottom Row */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Top Pages */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Top Pages</h4>
          <div className="space-y-3">
            {analytics.topPages.map((page, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm truncate flex-1 mr-2">{page.page}</span>
                <Badge variant="outline">{page.views.toLocaleString()}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Device Types */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Device Types</h4>
          <div className="space-y-3">
            {analytics.deviceTypes.map((device, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{device.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${device.percentage}%`,
                        backgroundColor: DEVICE_COLORS[device.type as keyof typeof DEVICE_COLORS] || '#6b7280'
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {device.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Countries */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Top Countries</h4>
          <div className="space-y-3">
            {analytics.countries.slice(0, 5).map((country, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{country}</span>
                </div>
                <Badge variant="outline">
                  {Math.floor(Math.random() * 1000) + 100}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
