"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useLightText } from "@/hooks/use-light-text"
import Image from "next/image"

interface LogoProps {
  className?: string
  size?: number
  asLink?: boolean
  animated?: boolean
}

export function Logo({ className = "", size = 44, asLink = false, animated = false }: LogoProps) {
  const logoImage = (
    <motion.div
      animate={animated ? {
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      } : {}}
      transition={animated ? {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
    >
      <Image
        src="/jabinweb_logo.png"
        alt="Jabin Web Logo"
        width={size}
        height={size}
        className={cn("object-contain", animated && "animate-pulse", className)}
        priority
      />
    </motion.div>
  )

  if (asLink) {
    return (
      <Link href="/" className="hover:opacity-90 transition-opacity">
        {logoImage}
      </Link>
    )
  }

  return logoImage
}

export function LogoText({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 hover:opacity-90 transition-opacity ${className}`}>
      <Logo size={40} />
      <div className="flex flex-col leading-none">
        <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Jabin Web
        </span>
        <span className="text-xs text-primary font-medium tracking-[0.15em] mt-0.5">
          DIGITAL SOLUTIONS
        </span>
      </div>
    </Link>
  )
}

// Alternative compact version for smaller spaces
export function LogoCompact({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 hover:opacity-90 transition-opacity ${className}`}>
      <Logo size={32} />
      <div className="flex flex-col leading-none">
        <span className="text-lg font-bold text-foreground">
          Jabin
        </span>
        <span className="text-xs text-primary font-medium tracking-wider -mt-0.5">
          WEB
        </span>
      </div>
    </Link>
  )
}

// Logo only version for favicon or minimal spaces
export function LogoOnly({ size = 32, className = "", asLink = true }: { size?: number; className?: string; asLink?: boolean }) {
  return (
    <Logo size={size} className={className} asLink={asLink} />
  )
}

// Animated thinking logo for AI search
export function LogoThinking({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={cn("flex items-center justify-center", className)}
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <Logo size={size} animated={true} />
    </motion.div>
  )
}

// Pulsing logo for loading states
export function LogoPulsing({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={cn("flex items-center justify-center", className)}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Logo size={size} />
    </motion.div>
  )
}