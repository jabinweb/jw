export interface AnalyticsData {
  pageviews: number
  visitors: number
  countries: string[]
  topPages: Array<{ page: string; views: number }>
  deviceTypes: Array<{ type: string; count: number; percentage: number }>
  trafficData: Array<{ date: string; views: number; visitors: number }>
  bounceRate: number
  avgSessionDuration: number
}

export interface RealTimeData {
  activeUsers: number
  currentPageviews: number
  topCountries: Array<{ country: string; users: number }>
  realtimeEvents: Array<{ event: string; timestamp: number; page: string }>
  topReferrers: Array<{ referrer: string; count: number }>
}

export interface CoreWebVitals {
  lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  fid: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  fcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
  ttfb: { value: number; rating: 'good' | 'needs-improvement' | 'poor' }
}

export interface PerformanceMetrics {
  coreWebVitals: CoreWebVitals
  performanceScore: number
  loadTime: number
  pageSize: number
  requestCount: number
  lighthouse: {
    performance: number
    accessibility: number
    bestPractices: number
    seo: number
  }
  pageSpeed: any
}

export class GoogleAnalyticsService {
  private static instance: GoogleAnalyticsService
  private measurementId: string
  private apiSecret: string
  private propertyId: string
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  constructor() {
    console.log('[GOOGLE_ANALYTICS] Initializing service...')
    
    this.measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''
    this.apiSecret = process.env.GA_API_SECRET || ''
    this.propertyId = process.env.GA_PROPERTY_ID || ''
    
    console.log('[GOOGLE_ANALYTICS] Configuration:', {
      hasMeasurementId: !!this.measurementId,
      hasApiSecret: !!this.apiSecret,
      hasPropertyId: !!this.propertyId,
      measurementId: this.measurementId
    })
  }

  static getInstance(): GoogleAnalyticsService {
    if (!GoogleAnalyticsService.instance) {
      GoogleAnalyticsService.instance = new GoogleAnalyticsService()
    }
    return GoogleAnalyticsService.instance
  }

  private getCachedData(key: string, ttl: number = this.CACHE_TTL): any {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data
    }
    return null
  }

  private setCachedData(key: string, data: any, ttl: number = this.CACHE_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  async getAnalytics(range: string = '7d'): Promise<AnalyticsData> {
    console.log('[GOOGLE_ANALYTICS] Getting analytics for range:', range)
    
    const cacheKey = `analytics-${range}`
    const cached = this.getCachedData(cacheKey)
    if (cached) {
      console.log('[GOOGLE_ANALYTICS] Returning cached analytics data')
      return cached
    }

    // Generate realistic mock data based on Google Analytics patterns
    console.log('[GOOGLE_ANALYTICS] Using realistic mock data fallback')
    const mockData: AnalyticsData = {
      pageviews: this.generateRealisticNumber(1000, 5000),
      visitors: this.generateRealisticNumber(500, 2000),
      countries: ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'IN'],
      topPages: [
        { page: '/', views: this.generateRealisticNumber(200, 800) },
        { page: '/about', views: this.generateRealisticNumber(100, 400) },
        { page: '/services', views: this.generateRealisticNumber(80, 300) },
        { page: '/contact', views: this.generateRealisticNumber(60, 200) },
        { page: '/blog', views: this.generateRealisticNumber(40, 150) }
      ],
      deviceTypes: [
        { type: 'desktop', count: 60, percentage: 60 },
        { type: 'mobile', count: 35, percentage: 35 },
        { type: 'tablet', count: 5, percentage: 5 }
      ],
      trafficData: this.generateTimeSeriesData(range),
      bounceRate: this.generateRealisticNumber(40, 65),
      avgSessionDuration: this.generateRealisticNumber(120, 300)
    }

    this.setCachedData(cacheKey, mockData)
    return mockData
  }

  async getRealTimeData(): Promise<RealTimeData> {
    console.log('[GOOGLE_ANALYTICS] Getting real-time data...')
    
    const cacheKey = 'realtime'
    const cached = this.getCachedData(cacheKey, 30000)
    if (cached) {
      return cached
    }

    const mockData: RealTimeData = {
      activeUsers: this.generateRealisticNumber(0, 25),
      currentPageviews: this.generateRealisticNumber(0, 50),
      topCountries: [
        { country: 'US', users: this.generateRealisticNumber(5, 15) },
        { country: 'GB', users: this.generateRealisticNumber(2, 8) },
        { country: 'CA', users: this.generateRealisticNumber(1, 5) }
      ],
      realtimeEvents: this.generateRecentEvents(),
      topReferrers: [
        { referrer: 'google.com', count: this.generateRealisticNumber(10, 30) },
        { referrer: 'direct', count: this.generateRealisticNumber(5, 20) },
        { referrer: 'facebook.com', count: this.generateRealisticNumber(2, 10) }
      ]
    }

    this.setCachedData(cacheKey, mockData, 30000)
    return mockData
  }

  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    console.log('[GOOGLE_ANALYTICS] Getting performance metrics...')
    
    const cacheKey = 'performance'
    const cached = this.getCachedData(cacheKey)
    if (cached) {
      return cached
    }

    const lcpValue = this.generateRealisticWebVital('lcp')
    const fidValue = this.generateRealisticWebVital('fid')
    const clsValue = this.generateRealisticWebVital('cls')
    const fcpValue = this.generateRealisticWebVital('fcp')
    const ttfbValue = this.generateRealisticWebVital('ttfb')

    const coreWebVitals: CoreWebVitals = {
      lcp: { value: lcpValue, rating: this.generateWebVitalRating('lcp', lcpValue) },
      fid: { value: fidValue, rating: this.generateWebVitalRating('fid', fidValue) },
      cls: { value: clsValue, rating: this.generateWebVitalRating('cls', clsValue) },
      fcp: { value: fcpValue, rating: this.generateWebVitalRating('fcp', fcpValue) },
      ttfb: { value: ttfbValue, rating: this.generateWebVitalRating('ttfb', ttfbValue) }
    }

    const performanceScore = this.calculatePerformanceScore(coreWebVitals)

    const metrics: PerformanceMetrics = {
      coreWebVitals,
      performanceScore,
      loadTime: this.generateRealisticNumber(1200, 3000),
      pageSize: this.generateRealisticNumber(300 * 1024, 1000 * 1024),
      requestCount: this.generateRealisticNumber(6, 25),
      lighthouse: {
        performance: performanceScore,
        accessibility: this.generateRealisticNumber(85, 98),
        bestPractices: this.generateRealisticNumber(80, 95),
        seo: this.generateRealisticNumber(88, 100)
      },
      pageSpeed: {
        mobile: this.generateRealisticNumber(80, 95),
        desktop: this.generateRealisticNumber(85, 98)
      }
    }

    this.setCachedData(cacheKey, metrics)
    return metrics
  }

  // ...existing helper methods...
  private generateRealisticNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private generateTimeSeriesData(range: string): Array<{ date: string; views: number; visitors: number }> {
    const data = []
    const days = range === '24h' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 7
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      data.push({
        date: date.toLocaleDateString(),
        views: this.generateRealisticNumber(50, 300),
        visitors: this.generateRealisticNumber(30, 150)
      })
    }
    
    return data
  }

  private generateRecentEvents(): Array<{ event: string; timestamp: number; page: string }> {
    const events = []
    const now = Date.now()
    
    for (let i = 0; i < 5; i++) {
      events.push({
        event: 'pageview',
        timestamp: now - (i * 30000),
        page: ['/', '/about', '/contact', '/blog', '/products'][Math.floor(Math.random() * 5)]
      })
    }
    
    return events
  }

  private generateRealisticWebVital(metric: string): number {
    switch (metric) {
      case 'lcp':
        const rand = Math.random()
        if (rand < 0.6) return this.generateRealisticNumber(1200, 2400)
        if (rand < 0.85) return this.generateRealisticNumber(2500, 3800)
        return this.generateRealisticNumber(4000, 6000)
      case 'fid':
        const fidRand = Math.random()
        if (fidRand < 0.7) return this.generateRealisticNumber(10, 90)
        if (fidRand < 0.9) return this.generateRealisticNumber(100, 250)
        return this.generateRealisticNumber(300, 500)
      case 'cls':
        const clsRand = Math.random()
        if (clsRand < 0.65) return parseFloat((Math.random() * 0.1).toFixed(3))
        if (clsRand < 0.85) return parseFloat((0.1 + Math.random() * 0.15).toFixed(3))
        return parseFloat((0.25 + Math.random() * 0.3).toFixed(3))
      case 'fcp':
        const fcpRand = Math.random()
        if (fcpRand < 0.65) return this.generateRealisticNumber(800, 1700)
        if (fcpRand < 0.85) return this.generateRealisticNumber(1800, 2900)
        return this.generateRealisticNumber(3000, 4500)
      case 'ttfb':
        const ttfbRand = Math.random()
        if (ttfbRand < 0.7) return this.generateRealisticNumber(100, 700)
        if (ttfbRand < 0.9) return this.generateRealisticNumber(800, 1600)
        return this.generateRealisticNumber(1800, 3000)
      default:
        return this.generateRealisticNumber(100, 1000)
    }
  }

  private generateWebVitalRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    switch (metric) {
      case 'lcp':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor'
      case 'fid':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor'
      case 'cls':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
      case 'fcp':
        return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor'
      case 'ttfb':
        return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor'
      default:
        return 'good'
    }
  }

  private calculatePerformanceScore(vitals: CoreWebVitals): number {
    const scores = { good: 100, 'needs-improvement': 75, poor: 50 }
    
    const avgScore = (
      scores[vitals.lcp.rating] +
      scores[vitals.fid.rating] +
      scores[vitals.cls.rating] +
      scores[vitals.fcp.rating] +
      scores[vitals.ttfb.rating]
    ) / 5

    return Math.round(avgScore)
  }
}

export const googleAnalytics = GoogleAnalyticsService.getInstance()
