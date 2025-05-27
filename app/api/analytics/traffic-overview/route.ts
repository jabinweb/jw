import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range') || '7d'

  try {
    // Generate traffic overview data
    const trafficData = generateTrafficOverview(range)
    return NextResponse.json(trafficData)
  } catch (error) {
    console.error('Traffic overview API error:', error)
    return NextResponse.json({ error: 'Failed to fetch traffic overview' }, { status: 500 })
  }
}

function generateTrafficOverview(range: string) {
  const baseViews = range === '24h' ? 1200 : range === '7d' ? 8500 : 25000
  const baseVisitors = Math.floor(baseViews * 0.7)

  return {
    overview: {
      totalViews: baseViews + Math.floor(Math.random() * 1000),
      totalVisitors: baseVisitors + Math.floor(Math.random() * 500),
      averageSession: 145 + Math.floor(Math.random() * 60),
      bounceRate: 45 + Math.floor(Math.random() * 20),
      growthRate: Math.floor(Math.random() * 30) - 5 // -5 to +25
    },
    hourlyData: range === '24h' ? generateHourlyData() : [],
    weeklyTrends: range !== '24h' ? generateWeeklyData(range) : [],
    topSources: [
      { source: 'google', visitors: Math.floor(Math.random() * 1000) + 500, percentage: 45 },
      { source: 'direct', visitors: Math.floor(Math.random() * 500) + 300, percentage: 25 },
      { source: 'linkedin', visitors: Math.floor(Math.random() * 300) + 150, percentage: 15 },
      { source: 'github', visitors: Math.floor(Math.random() * 200) + 100, percentage: 10 },
      { source: 'twitter', visitors: Math.floor(Math.random() * 100) + 50, percentage: 5 }
    ],
    deviceBreakdown: [
      { device: 'desktop', percentage: 55, color: '#3b82f6' },
      { device: 'mobile', percentage: 35, color: '#10b981' },
      { device: 'tablet', percentage: 10, color: '#f59e0b' }
    ]
  }
}

function generateHourlyData() {
  const data = []
  for (let hour = 0; hour < 24; hour++) {
    data.push({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      views: Math.floor(Math.random() * 100) + 20,
      visitors: Math.floor(Math.random() * 80) + 15
    })
  }
  return data
}

function generateWeeklyData(range: string) {
  const days = range === '7d' ? 7 : 30
  const data = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    data.push({
      day: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      views: Math.floor(Math.random() * 500) + 100,
      visitors: Math.floor(Math.random() * 350) + 70,
      sessions: Math.floor(Math.random() * 300) + 50
    })
  }
  
  return data
}
