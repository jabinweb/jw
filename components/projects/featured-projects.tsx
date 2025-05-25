"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  coverImage: string | null
  category: string | null
  client: {
    name: string | null
  }
}

export function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects?featured=true')
        if (!res.ok) throw new Error('Failed to fetch projects')
        const data = await res.json()
        setProjects(data)
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <Skeleton className="h-[200px] w-full" />
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id}>
          {project.coverImage ? (
            <div className="relative h-[200px] w-full">
              <Image 
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          ) : (
            <div className="h-[200px] w-full bg-muted rounded-t-lg" />
          )}
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
            {project.category && (
              <div className="text-sm text-muted-foreground">{project.category}</div>
            )}
          </CardHeader>
          <CardContent>
            {project.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild size="sm" variant="outline" className="w-full">
              <Link href={`/projects/${project.slug}`}>View Project</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
