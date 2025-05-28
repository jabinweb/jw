"use client"

import { Card } from "@/components/ui/card"
import { Overview } from "@/components/admin/overview"
import { RecentMessages } from "@/components/admin/recent-messages"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { GoogleAnalytics } from "@/components/admin/google-analytics"
import { RealTimeStats } from "@/components/admin/real-time-stats"
import { PerformanceMetrics } from "@/components/admin/performance-metrics"
import { TrafficOverview } from "@/components/admin/traffic-overview"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&#39;s what&#39;s happening with your website.
          </p>
        </div>
        <Button asChild>
          <Link href="/" target="_blank" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View Website
          </Link>
        </Button>
      </div>

      {/* Real-time stats from Google Analytics */}
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

      {/* Google Analytics Integration */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-4 sm:p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4">Google Analytics</h3>
          <GoogleAnalytics />
        </Card>
      </div>
    </div>
  )
}
