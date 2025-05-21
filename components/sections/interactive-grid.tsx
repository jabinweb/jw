"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function InteractiveGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let rafId: number
    let lastX = 0
    let lastY = 0

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const rect = container.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      const updatePosition = () => {
        lastX = lerp(lastX, x, 0.1)
        lastY = lerp(lastY, y, 0.1)
        
        container.style.setProperty('--mouse-x', `${lastX}px`)
        container.style.setProperty('--mouse-y', `${lastY}px`)

        rafId = requestAnimationFrame(updatePosition)
      }

      rafId = requestAnimationFrame(updatePosition)
    }

    container.addEventListener('mousemove', handleMouseMove)
    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
    >
      {/* Main grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 transition-opacity duration-300 hover:opacity-40" />
      
      {/* Grid shine effect */}
      <div className="pointer-events-none absolute inset-0">
        {/* Primary gradient */}
        <div className="absolute inset-0 [background:radial-gradient(1200px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(var(--primary-rgb),0.06),transparent_50%)]" />
        
        {/* Accent gradient for extra depth */}
        <div className="absolute inset-0 [background:radial-gradient(800px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(var(--accent-rgb),0.08),transparent_50%)] blur-[2px]" />
      </div>
      
      {/* Animated background gradients */}
      <motion.div
        className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-gradient-to-l from-secondary/5 via-accent/5 to-primary/5 blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  )
}