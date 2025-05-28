"use client"

import { Gauge, Zap, BarChart3 } from "lucide-react"

export function SpeedTestHeader() {
  return (
    <div className="text-center mb-8 sm:mb-12">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center">
          <Gauge className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100">
          Website Speed Tester
        </h1>
      </div>
      
      <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
        Analyze your website&apos;s performance with Google&apos;s Core Web Vitals. 
        Get actionable insights to improve your search rankings and user experience.
      </p>

      {/* Feature badges - Mobile responsive */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 sm:px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
          <Zap className="h-4 w-4 text-green-600" />
          <span className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">Core Web Vitals</span>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 sm:px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          <span className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">Performance Insights</span>
        </div>
      </div>
    </div>
  )
}
