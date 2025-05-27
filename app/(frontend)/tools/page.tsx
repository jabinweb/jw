import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  Zap, 
  Smartphone, 
  Search, 
  BarChart3, 
  Shield, 
  Palette,
  Code,
  Globe,
  ArrowRight
} from "lucide-react"

const tools = [
  {
    title: "Website Speed Tester",
    description: "Analyze your website's performance and Core Web Vitals",
    icon: Zap,
    href: "/tools/website-speed-tester",
    category: "Performance",
    popular: true
  },
  {
    title: "Mobile Responsiveness Checker",
    description: "Test how your website looks on different devices",
    icon: Smartphone,
    href: "/tools/mobile-checker",
    category: "Design",
    coming: true
  },
  {
    title: "SEO Analyzer",
    description: "Comprehensive SEO audit and recommendations",
    icon: Search,
    href: "/tools/seo-analyzer",
    category: "SEO",
    coming: true
  },
  {
    title: "Meta Tag Generator",
    description: "Generate optimized meta tags for better SEO",
    icon: Code,
    href: "/tools/meta-generator",
    category: "SEO",
    coming: true
  },
  {
    title: "Color Palette Generator",
    description: "Create beautiful color schemes for your brand",
    icon: Palette,
    href: "/tools/color-palette",
    category: "Design",
    coming: true
  },
  {
    title: "Website Security Scanner",
    description: "Check your website for security vulnerabilities",
    icon: Shield,
    href: "/tools/security-scanner",
    category: "Security",
    coming: true
  }
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Free Web Development Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional-grade tools to analyze, optimize, and improve your website. 
            Used by developers and businesses worldwide.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool, index) => {
            const Icon = tool.icon
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow relative">
                {tool.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500">
                    Popular
                  </Badge>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <Badge variant="outline">{tool.category}</Badge>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {tool.description}
                </p>
                
                <Button 
                  asChild 
                  className="w-full" 
                  variant={tool.coming ? "outline" : "default"}
                  disabled={tool.coming}
                >
                  {tool.coming ? (
                    <span>Coming Soon</span>
                  ) : (
                    <Link href={tool.href}>
                      Use Tool
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  )}
                </Button>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 text-center">
          <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Need Professional Help?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our tools help you identify issues, but sometimes you need expert implementation. 
            Let our team build you a fast, secure, and optimized website.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">
                Get Free Consultation
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/services">View Our Services</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
