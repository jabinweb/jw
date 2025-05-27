"use client"

import { Card } from "@/components/ui/card"
import { Overview } from "@/components/admin/overview"
import { RecentMessages } from "@/components/admin/recent-messages"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { VercelAnalytics } from "@/components/admin/vercel-analytics"
import { RealTimeStats } from "@/components/admin/real-time-stats"
import { PerformanceMetrics } from "@/components/admin/performance-metrics"
import { TrafficOverview } from "@/components/admin/traffic-overview"

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold">Dashboard</h2>
      
      {/* Real-time stats from Vercel */}
      <RealTimeStats />
      
      <DashboardStats />
      
      {/* Performance and Traffic Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-4 sm:p-6">
          <h3 className="font-semibold mb-4">Performance Metrics</h3>
          <PerformanceMetrics />
        </Card>
        
        <Card className="p-4 sm:p-6">
          <h3 className="font-semibold mb-4">Traffic Overview</h3>
          <TrafficOverview />
        </Card>
      </div>
      
      {/* Vercel Analytics Integration */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-4 sm:p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4">Vercel Analytics</h3>
          <VercelAnalytics />
        </Card>
        
        {/* <Card className="p-4 sm:p-6">
          <h3 className="font-semibold mb-4">Recent Messages</h3>
          <RecentMessages />
        </Card> */}
      </div>
    </div>
  )
}
