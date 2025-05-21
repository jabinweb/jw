"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/ui/container"
import { Zap, Shield, Clock, Palette, Headphones, Rocket, Star, Code } from "lucide-react"

const benefits = [
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "End-to-End Brand Building",
    description: "We don't just create websites – we build comprehensive digital brands from strategy to execution.",
    color: "from-purple-600 to-indigo-600",
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: "Dedicated Support",
    description: "Get personalized attention with rapid response times and ongoing assistance for your digital needs.",
    color: "from-blue-600 to-cyan-600",
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: "Modern Design Standards",
    description: "Stay ahead with cutting-edge design trends and user experience best practices.",
    color: "from-emerald-600 to-teal-600",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast Performance",
    description: "Optimized for speed with modern tech stack and performance-first development approach.",
    color: "from-amber-600 to-yellow-600",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Security First",
    description: "Built-in security measures and regular updates to keep your digital assets protected.",
    color: "from-red-600 to-rose-600",
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Clean & Modern Code",
    description: "Future-proof solutions built with the latest technologies and best coding practices.",
    color: "from-violet-600 to-purple-600",
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "Quality Assurance",
    description: "Rigorous testing and quality checks ensure flawless functionality across all devices.",
    color: "from-fuchsia-600 to-pink-600",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Timely Delivery",
    description: "Consistent track record of delivering projects on schedule without compromising quality.",
    color: "from-cyan-600 to-blue-600",
  },
]

export function WhyUs() {
  return (
    <section className="relative py-24 bg-muted/50">
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
              Why Choose Us
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-4xl font-bold tracking-tight"
          >
            Beyond Website Development
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            We build lasting digital experiences that transform businesses
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="relative h-full rounded-2xl p-6 bg-background border border-muted hover:border-primary/20 transition-colors">
                <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${benefit.color} mb-4`}>
                  <div className="text-primary-foreground">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
