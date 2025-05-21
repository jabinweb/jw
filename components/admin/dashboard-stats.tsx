"use client"

import { Card } from "@/components/ui/card"
import { Users, Globe, Mail, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Visitors",
    value: "15.2K",
    change: "+12%",
    icon: Users,
  },
  {
    title: "Active Services",
    value: "23",
    change: "+2",
    icon: Globe,
  },
  {
    title: "New Messages",
    value: "48",
    change: "+8",
    icon: Mail,
  },
  {
    title: "Revenue",
    value: "₹1.2M",
    change: "+18%",
    icon: TrendingUp,
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center gap-4">
            <stat.icon className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <span className="text-sm text-green-600">{stat.change}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
