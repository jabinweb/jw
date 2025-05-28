import { NextResponse } from 'next/server'
import { googleAnalytics } from '@/lib/google-analytics'

export async function GET() {
  try {
    console.log('[TRAFFIC_API] Starting traffic request...')
    
    const trafficData = await googleAnalytics.getAnalytics('7d')
    
    console.log('[TRAFFIC_API] Successfully fetched traffic data')
    
    return NextResponse.json(trafficData)
  } catch (error) {
    console.error('[TRAFFIC_API] Error:', error)
    
    return NextResponse.json(
      { 
        error: "Traffic API Error",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      }, 
      { status: 500 }
    )
  }
}
