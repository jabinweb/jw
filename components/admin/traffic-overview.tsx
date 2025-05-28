"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, TrendingUp, Users, Eye, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TrafficData {
  pageviews: number
  visitors: number
  countries: string[]
  topPages: Array<{ page: string; views: number }>
  deviceTypes: Array<{ type: string; count: number; percentage: number }>
  trafficData: Array<{ date: string; views: number; visitors: number }>
  bounceRate: number
  avgSessionDuration: number
}

export function TrafficOverview() {
  const [data, setData] = useState<TrafficData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTrafficData() {
      try {
        setLoading(true)
        setError(null)
        
        // Use the vercel analytics service through our API
        const response = await fetch('/api/analytics/traffic')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch traffic data: ${response.status}`)
        }
        
        const trafficData = await response.json()
        setData(trafficData)
      } catch (error) {
        console.error('Traffic overview fetch error:', error)
        setError(error instanceof Error ? error.message : 'Unknown error occurred')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchTrafficData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <div className="text-red-600 font-medium mb-2">Failed to load traffic overview</div>
        <div className="text-sm text-muted-foreground">{error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No traffic data available
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Traffic Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Page Views</p>
              <p className="text-lg font-semibold">{data.pageviews.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Visitors</p>
              <p className="text-lg font-semibold">{data.visitors.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Bounce Rate</p>
              <p className="text-lg font-semibold">{data.bounceRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">Avg. Session</p>
              <p className="text-lg font-semibold">
                {Math.floor(data.avgSessionDuration / 60)}m {data.avgSessionDuration % 60}s
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Traffic Chart */}
      {data.trafficData && data.trafficData.length > 0 && (
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.trafficData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Views"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                name="Visitors"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
