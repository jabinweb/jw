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

interface AIAnalysisDisplayProps {
  analysis: string
}

export function AIAnalysisDisplay({ analysis }: AIAnalysisDisplayProps) {
  const formatAnalysis = (text: string) => {
    const sections = text.split(/\*\*(\d+\.\s*[^:]+):\*\*/);
    const content = [];
    
    for (let i = 0; i < sections.length; i++) {
      if (i === 0) {
        if (sections[i].trim()) {
          content.push(
            <div key="intro" className="mb-8">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Executive Summary
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {sections[i].trim()}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          );
        }
        continue;
      }
      
      if (i % 2 === 1) {
        const sectionTitle = sections[i];
        const sectionContent = sections[i + 1] || '';
        
        let icon = null;
        let bgGradient = 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30';
        let borderColor = 'border-blue-200 dark:border-blue-800';
        let iconBg = 'bg-blue-100 dark:bg-blue-900/50';
        let iconColor = 'text-blue-600 dark:text-blue-400';
        
        if (sectionTitle.includes('Overall Assessment')) {
          icon = <Target className="h-5 w-5" />;
          bgGradient = 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30';
          borderColor = 'border-green-200 dark:border-green-800';
          iconBg = 'bg-green-100 dark:bg-green-900/50';
          iconColor = 'text-green-600 dark:text-green-400';
        } else if (sectionTitle.includes('Priority Issues')) {
          icon = <AlertTriangle className="h-5 w-5" />;
          bgGradient = 'from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30';
          borderColor = 'border-red-200 dark:border-red-800';
          iconBg = 'bg-red-100 dark:bg-red-900/50';
          iconColor = 'text-red-600 dark:text-red-400';
        } else if (sectionTitle.includes('Business Impact')) {
          icon = <TrendingUp className="h-5 w-5" />;
          bgGradient = 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30';
          borderColor = 'border-orange-200 dark:border-orange-800';
          iconBg = 'bg-orange-100 dark:bg-orange-900/50';
          iconColor = 'text-orange-600 dark:text-orange-400';
        } else if (sectionTitle.includes('Quick Wins')) {
          icon = <Zap className="h-5 w-5" />;
          bgGradient = 'from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30';
          borderColor = 'border-yellow-200 dark:border-yellow-800';
          iconBg = 'bg-yellow-100 dark:bg-yellow-900/50';
          iconColor = 'text-yellow-600 dark:text-yellow-400';
        } else if (sectionTitle.includes('Implementation')) {
          icon = <ArrowRight className="h-5 w-5" />;
          bgGradient = 'from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30';
          borderColor = 'border-purple-200 dark:border-purple-800';
          iconBg = 'bg-purple-100 dark:bg-purple-900/50';
          iconColor = 'text-purple-600 dark:text-purple-400';
        }
        
        content.push(
          <div key={sectionTitle} className="mb-6">
            <Card className={`p-6 bg-gradient-to-br ${bgGradient} border ${borderColor} hover:shadow-md transition-all duration-200`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
                  <span className={iconColor}>{icon}</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {sectionTitle.replace(/^\d+\.\s*/, '')}
                </h4>
              </div>
              <div className="space-y-4">
                {formatSectionContent(sectionContent, sectionTitle)}
              </div>
            </Card>
          </div>
        );
      }
    }
    
    return content;
  };
  
  const formatSectionContent = (content: string, sectionTitle: string) => {
    if (!content.trim()) return null;
    
    if (content.includes('*')) {
      const lines = content.split('\n').filter(line => line.trim());
      const items = [];
      let currentItem = '';
      
      for (const line of lines) {
        if (line.trim().startsWith('*')) {
          if (currentItem) items.push(currentItem);
          currentItem = line.replace(/^\s*\*\s*/, '').trim();
        } else if (currentItem && line.trim()) {
          currentItem += ' ' + line.trim();
        } else if (!currentItem && line.trim()) {
          items.push(line.trim());
        }
      }
      
      if (currentItem) items.push(currentItem);
      
      return (
        <div className="space-y-3">
          {items.map((item, index) => {
            if (item.includes('**') && item.includes(':')) {
              const [title, ...descParts] = item.split(':');
              const description = descParts.join(':').trim();
              const cleanTitle = title.replace(/\*\*/g, '').trim();
              
              return (
                <div key={index} className="group p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <AlertTriangle className="h-3 w-3 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {cleanTitle}
                      </h5>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={index} className="flex items-start gap-3 group hover:bg-white/50 dark:hover:bg-slate-800/50 p-2 rounded-lg transition-all duration-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0 group-hover:scale-125 transition-transform duration-200"></div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item.replace(/\*\*/g, '')}
                  </p>
                </div>
              );
            }
          })}
        </div>
      );
    }
    
    if (sectionTitle.includes('Implementation') && /^\s*\d+\./.test(content)) {
      const items = content.split(/(?=\d+\.)/).filter(item => item.trim());
      
      return (
        <div className="space-y-3">
          {items.map((item, index) => {
            const [numberAndTitle, ...descParts] = item.split(':');
            const description = descParts.join(':').trim();
            const title = numberAndTitle.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').trim();
            const impactMatch = description.match(/\(([^)]+Impact[^)]*)\)/);
            const impact = impactMatch ? impactMatch[1] : '';
            
            const priorityColors = [
              'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
              'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
              'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
              'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
              'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
            ];
            
            return (
              <div key={index} className={`group p-4 ${priorityColors[index] || priorityColors[4]} border rounded-lg hover:shadow-sm transition-all duration-200`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center font-semibold text-sm text-slate-700 dark:text-slate-300 shadow-sm">
                      {index + 1}
                    </div>
                    <h5 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {title}
                    </h5>
                  </div>
                  {impact && (
                    <Badge variant="secondary" className="text-xs font-medium bg-white/70 dark:bg-slate-800/70">
                      <Clock className="h-3 w-3 mr-1" />
                      {impact}
                    </Badge>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed ml-11">
                  {description.replace(/\([^)]+Impact[^)]*\)/g, '').trim()}
                </p>
                <div className="flex items-center gap-2 mt-3 ml-11">
                  <ArrowUpRight className="h-4 w-4 text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {index === 0 ? 'Start here for maximum impact' : 
                     index === 1 ? 'High priority optimization' :
                     index === 2 ? 'Medium priority task' :
                     'Future enhancement'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    return (
      <div className="space-y-3">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {paragraph.replace(/\*\*/g, '').trim()}
          </p>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {formatAnalysis(analysis)}
      
      {/* Action CTA */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
            <Lightbulb className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Need Help Implementing These Changes?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Our performance optimization experts can implement these improvements for you. Get faster results with professional support.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-0">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Free Consultation
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
