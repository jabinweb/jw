"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, Users, Eye, Clock, Globe } from "lucide-react"

interface TrafficData {
  overview: {
    totalViews: number
    totalVisitors: number
    averageSession: number
    bounceRate: number
    growthRate: number
  }
  hourlyData: Array<{ hour: string; views: number; visitors: number }>
  weeklyTrends: Array<{ day: string; views: number; visitors: number; sessions: number }>
  topSources: Array<{ source: string; visitors: number; percentage: number }>
  deviceBreakdown: Array<{ device: string; percentage: number; color: string }>
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function TrafficOverview() {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('24h')

  const fetchTrafficData = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/analytics/traffic')
      if (response.ok) {
        const data = await response.json()
        setTrafficData(data)
      }
    } catch (error) {
      console.error('Failed to fetch traffic data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrafficData()
  }, [fetchTrafficData])

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
        <div className="h-64 bg-muted/50 rounded-lg animate-pulse"></div>
      </div>
    )
  }

  if (!trafficData.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load traffic overview
      </div>
    )
  }

  const data = trafficData[0]; // Assuming you want to display data for the first item in the array

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex flex-wrap gap-2">
        {['24h', '7d', '30d'].map((range) => (
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

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Total Views</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold">{data.overview.totalViews.toLocaleString()}</span>
            <Badge variant={data.overview.growthRate > 0 ? "default" : "secondary"} className="text-xs w-fit">
              {data.overview.growthRate > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {Math.abs(data.overview.growthRate)}%
            </Badge>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Unique Visitors</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold">{data.overview.totalVisitors.toLocaleString()}</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-muted-foreground">Avg. Session</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold">
            {Math.floor(data.overview.averageSession / 60)}m {data.overview.averageSession % 60}s
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-muted-foreground">Bounce Rate</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold">{data.overview.bounceRate}%</div>
        </Card>
      </div>

      {/* Traffic Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Traffic (for 24h) or Weekly Trends */}
        <Card className="p-4 sm:p-6">
          <h4 className="font-semibold mb-4">
            {timeRange === '24h' ? 'Hourly Traffic' : 'Weekly Trends'}
          </h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeRange === '24h' ? data.hourlyData : data.weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey={timeRange === '24h' ? 'hour' : 'day'} 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
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
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stackId="1"
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                  name="Page Views"
                />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stackId="1"
                  stroke="hsl(var(--secondary))" 
                  fill="hsl(var(--secondary))"
                  fillOpacity={0.6}
                  name="Visitors"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Traffic Sources */}
        <Card className="p-4 sm:p-6">
          <h4 className="font-semibold mb-4">Traffic Sources</h4>
          <div className="space-y-3">
            {data.topSources.map((source, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm capitalize truncate">{source.source}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-12 sm:w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${source.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-8 sm:w-12 text-right">
                    {source.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Device Breakdown */}
      <Card className="p-4 sm:p-6">
        <h4 className="font-semibold mb-4">Device Breakdown</h4>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-full lg:w-auto flex justify-center">
            <div className="w-[200px] h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.deviceBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="percentage"
                  >
                    {data.deviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-4 justify-center">
            {data.deviceBreakdown.map((device, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: device.color }}
                />
                <span className="text-sm capitalize">{device.device}</span>
                <span className="text-sm font-medium">{device.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
