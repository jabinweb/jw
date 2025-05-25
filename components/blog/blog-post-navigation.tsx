"use client"

import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface BlogPostNavigationProps {
  previousPost: { slug: string; title: string } | null
  nextPost: { slug: string; title: string } | null
}

export function BlogPostNavigation({ previousPost, nextPost }: BlogPostNavigationProps) {
  return (
    <div className="mt-12">
      <Separator className="my-8" />
      
      <div className="flex justify-between flex-wrap gap-4">
        {previousPost ? (
          <Link 
            href={`/blog/${previousPost.slug}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex-1 sm:flex-initial"
            )}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous Post
          </Link>
        ) : (
          <div></div>
        )}
        
        <Link 
          href="/blog" 
          className={buttonVariants({ variant: "secondary" })}
        >
          All Posts
        </Link>
        
        {nextPost ? (
          <Link 
            href={`/blog/${nextPost.slug}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex-1 sm:flex-initial"
            )}
          >
            Next Post
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}
