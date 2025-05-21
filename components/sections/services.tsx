"use client"

import { motion } from "framer-motion"
import { useRef, useState } from "react"
import { Laptop, ShoppingBag, Palette, Search, ArrowUpRight, CheckCircle, MessageSquare, Settings, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/ui/container"
import { useRouter } from 'next/navigation'

const services = [
  {
    icon: <Laptop className="h-10 w-10" />,
    title: "Website Design",
    description: "Create stunning, user-friendly websites that captivate visitors and drive conversions.",
    features: [
      "Responsive Design",
      "Custom Development",
      "CMS Integration",
      "Performance Optimization"
    ],
    tag: "Core Service",
    color: "from-blue-600 to-violet-600",
    gradientBg: "from-blue-600/10 via-violet-600/5 to-transparent",
    link: "/services/website-design",
  },
  {
    icon: <ShoppingBag className="h-10 w-10" />, 
    title: "eCommerce Solutions",
    description: "Launch and manage powerful online stores with seamless shopping experiences. We build secure, scalable eCommerce platforms that drive sales.",
    features: [
      "Product Management",
      "Payment Gateway Integration",
      "Order Tracking",
      "Customer Reviews"
    ],
    tag: "Core Service",
    color: "from-purple-600 to-pink-600",
    gradientBg: "from-purple-600/10 via-pink-600/5 to-transparent",
    link: "/services/ecommerce",
  },
  {
    icon: <Palette className="h-10 w-10" />,
    title: "Logo & Branding",
    description: "Build a strong identity with unique, professional logos and cohesive branding. We help you stand out with memorable visual assets.",
    features: [
      "Logo Design",
      "Brand Guidelines",
      "Visual Identity",
      "Marketing Collateral"
    ],
    tag: "Core Service",
    color: "from-green-600 to-emerald-600",
    gradientBg: "from-green-600/10 via-emerald-600/5 to-transparent",
    link: "/services/branding",
  },
  {
    icon: <Search className="h-10 w-10" />,
    title: "SEO & Marketing",
    description: "Improve your visibility and attract organic leads with our comprehensive SEO and digital marketing services. Rise above the competition.",
    features: [
      "Keyword Research",
      "On-Page SEO",
      "Link Building",
      "Content Marketing"
    ],
    tag: "Core Service",
    color: "from-red-600 to-rose-600",
    gradientBg: "from-red-600/10 via-rose-600/5 to-transparent",
    link: "/services/seo",
  },
  {
    icon: <Settings className="h-10 w-10" />,
    title: "Website Maintenance",
    description: "Keep your website secure, fast, and up-to-date with our comprehensive maintenance services.",
    features: [
      "Security Updates",
      "Performance Monitoring",
      "Content Updates",
      "Regular Backups"
    ],
    tag: "Support Service",
    color: "from-amber-600 to-yellow-600",
    gradientBg: "from-amber-600/10 via-yellow-600/5 to-transparent",
    link: "/services/maintenance",
  },
  {
    icon: <Smartphone className="h-10 w-10" />,
    title: "App Development",
    description: "Create custom mobile and web applications that streamline your business operations and engage users.",
    features: [
      "Custom Development",
      "Cross-platform Apps",
      "UI/UX Design",
      "API Integration"
    ],
    tag: "Core Service",
    color: "from-cyan-600 to-blue-600",
    gradientBg: "from-cyan-600/10 via-blue-600/5 to-transparent",
    link: "/services/app-development",
  }
]

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter();

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Background Elements with lower z-index */}
      <div className="absolute inset-0 -z-20 bg-grid-pattern opacity-40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-transparent to-background" />
      
      <Container className="max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-sm font-medium text-primary">
              Our Services
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-4xl font-bold tracking-tight"
          >
            Digital Solutions That Deliver
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Empowering your online presence with tailored web solutions
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                onClick={() => router.push(service.link)}
                className="cursor-pointer block group h-full"
              >
                <motion.div
                  className="relative h-full rounded-3xl p-6 lg:p-8 overflow-hidden bg-gradient-to-br from-background to-muted border border-muted/20"
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Service Content */}
                  <div className="relative z-10">
                    {service.tag && (
                      <Badge variant="secondary" className="mb-4">
                        {service.tag}
                      </Badge>
                    )}
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${service.gradientBg} mb-6`}>
                      <div className={`bg-gradient-to-br ${service.color} rounded-xl p-2 text-primary-foreground`}>
                        {service.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {service.description}
                    </p>
                    {service.features && (
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    <motion.div
                      className="flex items-center text-primary font-medium"
                      whileHover={{ x: 5 }}
                    >
                      Learn more 
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </motion.div>
                  </div>

                  {/* Enhanced Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}