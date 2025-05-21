"use client"

import { Card } from "@/components/ui/card"
import { Overview } from "@/components/admin/overview"
import { RecentMessages } from "@/components/admin/recent-messages"
import { DashboardStats } from "@/components/admin/dashboard-stats"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      
      <DashboardStats />
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Traffic Overview</h3>
          <Overview />
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Messages</h3>
          <RecentMessages />
        </Card>
      </div>
    </div>
  )
}
