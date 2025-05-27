import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { vercelAnalytics } from '@/lib/vercel-analytics'

export async function GET(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const performanceData = await vercelAnalytics.getPerformanceMetrics()
    return NextResponse.json(performanceData)
  } catch (error) {
    console.error('Performance API error:', error)
    return NextResponse.json({ error: 'Failed to fetch performance metrics' }, { status: 500 })
  }
}
