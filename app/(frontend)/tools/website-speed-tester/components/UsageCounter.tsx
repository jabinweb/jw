import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface UsageCounterProps {
  usage: {
    used: number
    limit: number
    remaining: number
    plan?: 'guest' | 'free' | 'basic' | 'premium'
  }
}

export function UsageCounter({ usage }: UsageCounterProps) {
  return (
    <div className="max-w-md mx-auto mb-8">
      <Card className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge 
              variant={usage.plan === 'guest' ? 'secondary' : 'default'}
              className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-0"
            >
              {usage.plan === 'guest' ? 'Guest User' : usage.plan === 'free' ? 'Free Account' : usage.plan?.toUpperCase()}
            </Badge>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {usage.used} of {usage.limit} tests today
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Progress 
              value={(usage.used / usage.limit) * 100} 
              className="w-16 h-1 bg-slate-200 dark:bg-slate-700"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[3rem]">
              {usage.remaining} left
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
