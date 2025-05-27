import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { vercelAnalytics } from '@/lib/vercel-analytics'

export async function GET(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const realtimeData = await vercelAnalytics.getRealTimeData()
    return NextResponse.json(realtimeData)
  } catch (error) {
    console.error('Real-time analytics API error:', error)
    return NextResponse.json({ error: 'Failed to fetch real-time data' }, { status: 500 })
  }
}
