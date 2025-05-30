import { NextResponse } from 'next/server'
import { googleAnalytics } from '@/lib/google-analytics'

export async function GET() {
  try {
    console.log('[REALTIME_API] Starting realtime request...')
    
    const realtimeData = await googleAnalytics.getRealTimeData()
    
    console.log('[REALTIME_API] Successfully fetched realtime data')
    
    return NextResponse.json(realtimeData)
  } catch (error) {
    console.error('[REALTIME_API] Error:', error)
    
    return NextResponse.json(
      { 
        error: "Realtime API Error",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      }, 
      { status: 500 }
    )
  }
}
