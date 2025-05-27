"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { InteractiveGrid } from "./interactive-grid"
import { CheckCircle, ArrowRight, TrendingUp, Shield, Clock } from "lucide-react"
import { Container } from "@/components/ui/container"
import { GetStartedButton } from "../forms/get-started-button"

export function Hero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden py-12 md:py-16">
      {/* Improved Background Gradient for both themes */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/8 dark:from-background dark:via-background/98 dark:to-primary/12"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/8 to-purple-500/12 dark:via-blue-500/12 dark:to-purple-500/18"></div>
      
      <Container>
        {/* Background interactive grid */}
        <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-20">
          <InteractiveGrid />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-20 max-w-7xl w-full mx-auto">
          {/* Left: Refined Text Content */}
          <div className="space-y-8">
            {/* Subtle Trust Indicator */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-background/90 dark:bg-background/80 backdrop-blur-sm border border-border/60 dark:border-border/40 rounded-full text-sm text-muted-foreground shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Trusted by 100+ growing businesses</span>
            </motion.div>

            <div className="space-y-4 !mt-4">
              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold !leading-[1.4] tracking-tight text-foreground"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                We Build Digital Solutions That{" "}
                <span className="bg-gradient-to-r from-primary via-blue-600 dark:via-blue-500 to-purple-600 dark:to-purple-500 bg-clip-text text-transparent">
                  Drive Growth
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-muted-foreground leading-relaxed max-w-lg font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Transform your business with websites that convert, apps that engage, and digital strategies that deliver measurable results.
              </motion.p>
            </div>

            {/* Refined Value Props */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              { [
                { icon: TrendingUp, text: "Websites that increase conversions by 40%" },
                { icon: Shield, text: "Enterprise-grade security & performance" },
                { icon: Clock, text: "Delivered in 14 days or less" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground font-medium">{item.text}</span>
                </div>
              )) }
            </motion.div>

            {/* Simplified CTA */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="rounded-xl px-8 h-14 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90" 
                asChild
              >
                <GetStartedButton showIcon text="Start Your Project" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-xl px-8 h-14 text-base group border-border/60 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary transition-all duration-300" 
                asChild
              >
                <Link href="/portfolio" className="flex items-center gap-2">
                  View Portfolio
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right: Minimalist Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Clean Device Mockup */}
            <div className="relative">
              {/* Main Device Frame */}
              <div className="relative bg-background/90 dark:bg-background/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-border/60 dark:border-border/30">
                {/* Screen Content */}
                <div className="bg-gradient-to-br from-background via-muted/30 dark:via-muted/20 to-background rounded-2xl overflow-hidden">
                  {/* Refined Browser Bar */}
                  <div className="bg-muted/80 dark:bg-muted/60 px-6 py-4 flex items-center gap-3 border-b border-border/30 dark:border-border/20">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400/80 dark:bg-red-400/70"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400/80 dark:bg-yellow-400/70"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400/80 dark:bg-green-400/70"></div>
                    </div>
                    <div className="flex-1 bg-background/60 dark:bg-background/40 rounded-lg px-4 py-2 mx-6">
                      <span className="text-xs text-muted-foreground">yourproject.com</span>
                    </div>
                  </div>
                  
                  {/* Elegant Content Preview */}
                  <div className="p-8 space-y-6">
                    <div className="space-y-3">
                      <div className="h-3 bg-gradient-to-r from-primary/80 dark:from-primary/70 to-blue-500/80 dark:to-blue-500/70 rounded-full w-2/3"></div>
                      <div className="h-2 bg-muted/60 dark:bg-muted/40 rounded-full w-full"></div>
                      <div className="h-2 bg-muted/40 dark:bg-muted/30 rounded-full w-3/4"></div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="h-10 bg-gradient-to-r from-primary to-blue-600 dark:from-primary/90 dark:to-blue-600/90 rounded-xl px-6 flex items-center justify-center">
                        <div className="w-16 h-2 bg-white/90 dark:bg-white/95 rounded"></div>
                      </div>
                      <div className="h-10 border-2 border-muted dark:border-muted/60 rounded-xl px-6 flex items-center justify-center">
                        <div className="w-12 h-2 bg-muted dark:bg-muted/80 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Improved Floating Metrics */}
              <motion.div
                className="absolute -top-6 -right-6 bg-background/95 dark:bg-background/90 backdrop-blur-sm border border-border/60 dark:border-border/40 rounded-2xl px-4 py-3 shadow-lg"
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-foreground">+150% Traffic</span>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-6 -left-6 bg-background/95 dark:bg-background/90 backdrop-blur-sm border border-border/60 dark:border-border/40 rounded-2xl px-4 py-3 shadow-lg"
                animate={{ y: [3, -3, 3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-foreground">Fast & Secure</span>
                </div>
              </motion.div>
            </div>

            {/* Minimal Background Glow */}
            <div className="absolute inset-0 -z-10">
              <motion.div
                className="absolute top-1/3 right-1/3 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>

        {/* Enhanced Background Elements for both themes */}
        <div className="absolute inset-0 -z-20">
          <motion.div
            className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-primary/12 dark:from-primary/15 via-blue-500/10 dark:via-blue-500/12 to-transparent blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-gradient-to-l from-purple-500/10 dark:from-purple-500/12 via-pink-500/8 dark:via-pink-500/10 to-transparent blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-gradient-to-br from-primary/8 dark:from-primary/10 to-blue-500/8 dark:to-blue-500/10 blur-2xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Bottom fade with gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none" />
      </Container>
    </section>
  )
}
