"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Users, 
  Eye, 
  Globe, 
  Clock, 
  TrendingUp,
  Activity,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react"

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet
}

export function GoogleAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/analytics/traffic')
        if (!response.ok) {
          throw new Error('Failed to fetch analytics')
        }
        const data = await response.json()
        setAnalytics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Failed to load analytics data</p>
      </div>
    )
  }

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="traffic">Traffic</TabsTrigger>
        <TabsTrigger value="pages">Pages</TabsTrigger>
        <TabsTrigger value="devices">Devices</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Page Views</p>
                <p className="text-2xl font-bold">{analytics.pageviews.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Visitors</p>
                <p className="text-2xl font-bold">{analytics.visitors.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Bounce Rate</p>
                <p className="text-2xl font-bold">{analytics.bounceRate}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Avg. Session</p>
                <p className="text-2xl font-bold">{Math.floor(analytics.avgSessionDuration / 60)}m</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Countries */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Top Countries
          </h3>
          <div className="flex flex-wrap gap-2">
            {analytics.countries.slice(0, 8).map((country) => (
              <Badge key={country} variant="secondary">
                {country}
              </Badge>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="traffic" className="space-y-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Traffic Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#8884d8" name="Page Views" />
              <Bar dataKey="visitors" fill="#82ca9d" name="Visitors" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </TabsContent>

      <TabsContent value="pages" className="space-y-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Top Pages</h3>
          <div className="space-y-3">
            {analytics.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    #{index + 1}
                  </span>
                  <span className="font-medium">{page.page}</span>
                </div>
                <Badge variant="outline">
                  {page.views.toLocaleString()} views
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="devices" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Device Types</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics.deviceTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) => `${type}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {analytics.deviceTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Device Breakdown</h3>
            <div className="space-y-4">
              {analytics.deviceTypes.map((device) => {
                const Icon = deviceIcons[device.type as keyof typeof deviceIcons] || Monitor
                return (
                  <div key={device.type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium capitalize">{device.type}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{device.percentage}%</p>
                      <p className="text-sm text-muted-foreground">
                        {device.count.toLocaleString()} users
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
