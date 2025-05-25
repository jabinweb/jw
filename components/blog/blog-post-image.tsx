"use client"

import Image from 'next/image'

interface BlogPostImageProps {
  src: string
  alt: string
}

export function BlogPostImage({ src, alt }: BlogPostImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      className="object-cover rounded-lg"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
    />
  )
}
