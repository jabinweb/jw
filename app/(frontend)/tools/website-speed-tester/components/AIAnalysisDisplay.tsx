import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  BarChart3, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
  Lightbulb,
  ArrowUpRight
} from "lucide-react"

"use client"

interface AIAnalysisDisplayProps {
  analysis: string
}

export function AIAnalysisDisplay({ analysis }: AIAnalysisDisplayProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none prose-sm sm:prose-base">
      <div 
        className="text-sm sm:text-base leading-relaxed"
        dangerouslySetInnerHTML={{ 
          __html: analysis.replace(/\n/g, '<br />') 
        }} 
      />
    </div>
  )
}
