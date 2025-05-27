import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { auth } from '@/auth'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const { speedTestResult, userPrompt } = await request.json()

    if (!speedTestResult) {
      return NextResponse.json({ error: 'Speed test result is required' }, { status: 400 })
    }

    // Basic rate limiting for AI analysis
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required for Jabin AI analysis' }, { status: 401 })
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables')
      return NextResponse.json({ 
        error: 'AI analysis temporarily unavailable',
        fallback: generateFallbackAnalysis(speedTestResult)
      }, { status: 500 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = userPrompt || generateAnalysisPrompt(speedTestResult)
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      analysis: text,
      insights: extractKeyInsights(text),
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Jabin AI analysis error:', error)
    
    // Get speedTestResult from the request for fallback
    const { speedTestResult } = await request.json().catch(() => ({ speedTestResult: null }))
    
    return NextResponse.json({ 
      error: 'Failed to generate Jabin AI analysis',
      fallback: speedTestResult ? generateFallbackAnalysis(speedTestResult) : 'Unable to analyze performance data.'
    }, { status: 500 })
  }
}

function generateAnalysisPrompt(speedTestResult: any) {
  return `
You are a web performance expert analyzing PageSpeed Insights data. Provide a comprehensive yet concise analysis.

**Website Performance Data:**
- URL: ${speedTestResult.url}
- Overall Score: ${speedTestResult.overall.score}/100 (${speedTestResult.overall.rating})
- Load Time: ${speedTestResult.overall.loadTime}s
- Core Web Vitals:
  - LCP: ${speedTestResult.metrics.lcp.value}ms (${speedTestResult.metrics.lcp.rating})
  - FID: ${speedTestResult.metrics.fid.value}ms (${speedTestResult.metrics.fid.rating})
  - CLS: ${speedTestResult.metrics.cls.value} (${speedTestResult.metrics.cls.rating})
  - FCP: ${speedTestResult.metrics.fcp.value}ms (${speedTestResult.metrics.fcp.rating})
  - TTFB: ${speedTestResult.metrics.ttfb.value}ms (${speedTestResult.metrics.ttfb.rating})

**Performance Metrics:**
- Page Size: ${(speedTestResult.performance.pageSize / 1024 / 1024).toFixed(2)}MB
- HTTP Requests: ${speedTestResult.performance.requests}
- Compression: ${speedTestResult.performance.compression ? 'Enabled' : 'Disabled'}
- Caching: ${speedTestResult.performance.caching ? 'Enabled' : 'Disabled'}
- Images: ${speedTestResult.performance.images.total} total, ${speedTestResult.performance.images.optimized}% optimized

**Mobile Performance:**
- Mobile Score: ${speedTestResult.mobile.score}/100
- Responsive: ${speedTestResult.mobile.responsive ? 'Yes' : 'No'}
- Viewport: ${speedTestResult.mobile.viewport ? 'Configured' : 'Missing'}

Please provide:
1. **Overall Assessment** (2-3 sentences)
2. **Top 3 Priority Issues** (what's hurting performance most)
3. **Business Impact** (how these issues affect users/conversions)
4. **Quick Wins** (easiest optimizations to implement)
5. **Implementation Roadmap** (order of optimizations by impact/effort)

Keep it practical, actionable, and business-focused. Use simple language that non-technical users can understand.
`
}

function extractKeyInsights(analysisText: string) {
  // Extract structured insights from the AI response
  const insights = {
    overallGrade: 'B',
    topIssues: [],
    quickWins: [],
    businessImpact: '',
    priorityScore: 0
  }

  // Simple pattern matching to extract insights
  if (analysisText.includes('critical') || analysisText.includes('poor')) {
    insights.priorityScore = 9
    insights.overallGrade = 'D'
  } else if (analysisText.includes('good') || analysisText.includes('excellent')) {
    insights.priorityScore = 3
    insights.overallGrade = 'A'
  } else {
    insights.priorityScore = 6
    insights.overallGrade = 'B'
  }

  return insights
}

function generateFallbackAnalysis(speedTestResult: any) {
  const score = speedTestResult.overall.score
  
  if (score >= 90) {
    return "Excellent performance! Your website loads quickly and provides a great user experience. Focus on maintaining these high standards and monitoring for any regressions."
  } else if (score >= 70) {
    return "Good performance with room for improvement. Your website loads reasonably fast, but optimizing images and reducing JavaScript could boost conversion rates by 10-15%."
  } else if (score >= 50) {
    return "Average performance that may be costing you conversions. Users expect fast-loading sites, and your current speed could be driving away potential customers. Priority fixes: optimize images, enable compression, and reduce server response time."
  } else {
    return "Poor performance that's likely hurting your business. Slow websites frustrate users and hurt search rankings. Immediate action needed on Core Web Vitals, especially Largest Contentful Paint and Cumulative Layout Shift."
  }
}
