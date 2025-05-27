import { Zap, Shield } from "lucide-react"

export function SpeedTestHeader() {
  return (
    <div className="text-center mb-16 max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
          <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-light text-slate-900 dark:text-slate-100">
          PageSpeed
          <span className="font-normal text-blue-600 dark:text-blue-400"> Insights</span>
        </h1>
      </div>
      <p className="text-base md:text-xl text-slate-600 dark:text-slate-300 font-light leading-relaxed max-w-3xl mx-auto">
        Analyze your website&apos;s performance with real Google metrics and Jabin AI-powered insights. Get detailed analysis about Core Web Vitals, 
        mobile optimization, and intelligent recommendations to improve user experience.
      </p>
      <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Google PageSpeed API</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          <span>Jabin AI Analysis</span>
        </div>
      </div>
    </div>
  )
}
