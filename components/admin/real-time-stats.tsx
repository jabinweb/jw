"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Wifi, Users } from "lucide-react"
import { LogoPulsing } from "@/components/ui/logo"

interface RealTimeData {
  activeUsers: number
  currentPageviews: number
  topCountries: Array<{ country: string; users: number }>
  realtimeEvents: Array<{ event: string; timestamp: number; page: string }>
}

export function RealTimeStats() {
  const [data, setData] = useState<RealTimeData | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Simulate real-time connection
    const interval = setInterval(() => {
      fetchRealTimeData()
    }, 30000) // Update every 30 seconds

    fetchRealTimeData()
    setIsConnected(true)

    return () => clearInterval(interval)
  }, [])

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch('/api/analytics/realtime')
      if (response.ok) {
        const realtimeData = await response.json()
        setData(realtimeData)
      }
    } catch (error) {
      console.error('Failed to fetch real-time data:', error)
      setIsConnected(false)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="p-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Live Users</span>
              {isConnected && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
            <div className="text-2xl font-bold mt-1">
              {data?.activeUsers || 0}
            </div>
          </div>
          {data?.activeUsers && data.activeUsers > 0 && (
            <LogoPulsing size={24} className="opacity-60" />
          )}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-muted-foreground">Real-time Views</span>
        </div>
        <div className="text-2xl font-bold mt-1">
          {data?.currentPageviews || 0}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Last 5 minutes
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-500" />
          <span className="text-sm text-muted-foreground">Top Country</span>
        </div>
        <div className="text-2xl font-bold mt-1">
          {data?.topCountries?.[0]?.country || 'N/A'}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {data?.topCountries?.[0]?.users || 0} users
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-orange-500" />
          <span className="text-sm text-muted-foreground">Status</span>
        </div>
        <div className="mt-1">
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Vercel Analytics
        </div>
      </Card>
    </div>
  )
}
