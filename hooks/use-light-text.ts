'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

// Pages that should have light text when at the top
export const LIGHT_TEXT_PAGES = [
  '/careers',
  '/careers/',
  '/about',
  '/about/',
  '/services',
  '/services/',
  '/contact',
  '/contact/',
] as const

export type LightTextPage = typeof LIGHT_TEXT_PAGES[number]

export function useLightText(threshold = 20) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  // Check if current page needs light text
  const isLightTextPage = LIGHT_TEXT_PAGES.some(page => 
    pathname.startsWith(page)
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return {
    isLightText: isLightTextPage && !isScrolled,
    isScrolled
  }
}