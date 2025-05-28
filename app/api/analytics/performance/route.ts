import { NextResponse } from 'next/server'
import { googleAnalytics } from '@/lib/google-analytics'

export async function GET() {
  try {
    console.log('[PERFORMANCE_API] Starting performance request...')
    
    const performanceData = await googleAnalytics.getPerformanceMetrics()
    
    console.log('[PERFORMANCE_API] Successfully fetched performance data')
    
    return NextResponse.json(performanceData)
  } catch (error) {
    console.error('[PERFORMANCE_API] Error:', error)
    
    return NextResponse.json(
      { 
        error: "Performance API Error",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      }, 
      { status: 500 }
    )
  }
}
