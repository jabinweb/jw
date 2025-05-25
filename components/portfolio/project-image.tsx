"use client"

import { useState } from 'react'
import Image from 'next/image'
import { ImageIcon } from 'lucide-react'

interface ProjectImageProps {
  src?: string | null
  websiteUrl?: string | null
  alt: string
  className?: string
}

export function ProjectImage({ src, websiteUrl, alt, className }: ProjectImageProps) {
  const [error, setError] = useState(false)
  
  const imageUrl = src || (websiteUrl 
    ? `https://jabin-screenshot-api.vercel.app/screenshot?url=${encodeURIComponent(websiteUrl)}`
    : null)

  if (!imageUrl || error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="rounded-full bg-muted p-4 mb-2">
          <ImageIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          {error ? "Image failed to load" : "No image available"}
        </span>
      </div>
    )
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill
      className={className || "object-cover"}
      onError={() => setError(true)}
    />
  )
}

export function ProjectGalleryImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <ImageIcon className="h-6 w-6 text-muted-foreground" />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setError(true)}
    />
  )
}
