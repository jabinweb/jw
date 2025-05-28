"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity } from "lucide-react"

interface UsageInfo {
  used: number
  limit: number
  remaining: number
  plan?: 'guest' | 'free' | 'basic' | 'premium'
}

interface UsageCounterProps {
  usage: UsageInfo
}

export function UsageCounter({ usage }: UsageCounterProps) {
  const percentage = (usage.used / usage.limit) * 100

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'premium':
        return 'text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-900/20 dark:border-purple-800'
      case 'basic':
        return 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800'
      case 'free':
        return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-900/20 dark:border-gray-800'
    }
  }

  return (
    <Card className="max-w-lg mx-auto mb-6 sm:mb-8 p-4 sm:p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl shadow-sm">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 dark:bg-slate-800 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
          <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600 dark:text-slate-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
            <span className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">
              Tests Today: {usage.used} / {usage.limit}
            </span>
            {usage.plan && (
              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium capitalize border ${getPlanColor(usage.plan)}`}>
                {usage.plan}
              </span>
            )}
          </div>
          
          <Progress 
            value={percentage} 
            className="h-2 sm:h-3" 
          />
          
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {usage.remaining} tests remaining
          </div>
        </div>
      </div>
    </Card>
  )
}
