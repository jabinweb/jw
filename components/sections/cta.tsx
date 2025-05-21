"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

interface CTAProps {
  title?: string
  description?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
  variant?: "default" | "gradient" | "subtle"
}

export function CTASection({
  title = "Ready to Transform Your Business?",
  description = "Let's discuss how AI can drive growth and innovation for your organization.",
  primaryButtonText = "Get Started",
  primaryButtonHref = "/contact",
  secondaryButtonText,
  secondaryButtonHref,
  variant = "default"
}: CTAProps) {
  const variants = {
    default: "bg-primary/10 dark:bg-primary/20 text-foreground",
    gradient: "bg-gradient-to-r from-background to-muted relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/20 before:to-secondary/20 before:opacity-50",
    subtle: "bg-muted/50 dark:bg-muted/10"
  }

  const containerClasses = `relative overflow-hidden py-20 px-4 ${variants[variant]}`

  return (
    <section className={containerClasses}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.h2 
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>
        <motion.p 
          className="text-lg mb-8 opacity-90"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {description}
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            size="lg" 
            className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
            asChild
          >
            <Link href={primaryButtonHref}>{primaryButtonText}</Link>
          </Button>
          {secondaryButtonText && (
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 border-primary/20 hover:bg-primary/10 text-foreground"
              asChild
            >
              <Link href={secondaryButtonHref || "#"}>{secondaryButtonText}</Link>
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  )
}