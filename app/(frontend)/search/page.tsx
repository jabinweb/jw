"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Container } from "@/components/ui/container"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchIcon, Loader2, X } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState("all")
  const [results, setResults] = useState({ posts: [], projects: [], services: [], totalResults: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      const params = new URLSearchParams()
      params.set("q", debouncedQuery)
      
      // Update URL with search query
      router.push(`/search?${params.toString()}`, { scroll: false })
      
      const performSearch = async () => {
        setIsLoading(true)
        try {
          const typeParam = activeTab !== "all" ? `&type=${activeTab}` : ""
          const res = await fetch(`/api/search?q=${debouncedQuery}${typeParam}`)
          if (!res.ok) throw new Error("Search failed")
          const data = await res.json()
          setResults(data)
        } catch (error) {
          console.error("Search error:", error)
        } finally {
          setIsLoading(false)
        }
      }
      
      performSearch()
    } else {
      // Clear results when query is too short
      setResults({ posts: [], projects: [], services: [], totalResults: 0 })
    }
  }, [debouncedQuery, activeTab, router])

  return (
    <Container className="py-16 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="h-5 w-5 text-muted-foreground" />
        </div>

        <Input 
          type="text"
          placeholder="Search for content..."
          className="pl-10 pr-10 h-12 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-0 px-3"
            onClick={() => setQuery("")}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">
            All Results ({results.totalResults})
          </TabsTrigger>
          <TabsTrigger value="posts">
            Blog Posts ({results.posts.length})
          </TabsTrigger>
          <TabsTrigger value="projects">
            Projects ({results.projects.length})
          </TabsTrigger>
          <TabsTrigger value="services">
            Services ({results.services.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8">
          {debouncedQuery.length < 2 ? (
            <p className="text-center text-muted-foreground py-8">
              Enter at least 2 characters to search
            </p>
          ) : results.totalResults === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-2">No results found</h2>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find what you&apos;re looking for
              </p>
            </div>
          ) : (
            <div>
              <TabsContent value="all" className="space-y-12 mt-0">
                {renderSearchResults(results)}
              </TabsContent>
              
              <TabsContent value="posts" className="mt-0">
                {renderPosts(results.posts)}
              </TabsContent>
              
              <TabsContent value="projects" className="mt-0">
                {renderProjects(results.projects)}
              </TabsContent>
              
              <TabsContent value="services" className="mt-0">
                {renderServices(results.services)}
              </TabsContent>
            </div>
          )}
        </div>
      )}
    </Container>
  )
}

function renderSearchResults(results: any) {
  return (
    <>
      {results.posts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Blog Posts</h2>
          {renderPosts(results.posts.slice(0, 3))}
          {results.posts.length > 3 && (
            <div className="mt-4">
              <Button variant="outline" asChild>
                <Link href="?tab=posts">View all {results.posts.length} posts</Link>
              </Button>
            </div>
          )}
        </div>
      )}
      
      {results.projects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
          {renderProjects(results.projects.slice(0, 3))}
          {results.projects.length > 3 && (
            <div className="mt-4">
              <Button variant="outline" asChild>
                <Link href="?tab=projects">View all {results.projects.length} projects</Link>
              </Button>
            </div>
          )}
        </div>
      )}
      
      {results.services.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Services</h2>
          {renderServices(results.services)}
        </div>
      )}
    </>
  )
}

function renderPosts(posts: any[]) {
  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <Link href={`/blog/${post.slug}`} className="flex flex-col md:flex-row">
            {post.featuredImage && (
              <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              {post.excerpt && (
                <p className="text-muted-foreground line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
              )}
              <div className="text-sm text-muted-foreground">
                {post.publishedAt && formatDate(post.publishedAt)}
                {post.author?.name && (
                  <span> • By {post.author.name}</span>
                )}
              </div>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  )
}

function renderProjects(projects: any[]) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden flex flex-col h-full">
          <Link href={`/portfolio/${project.slug}`} className="h-full">
            <div className="relative w-full h-48">
              {project.coverImage ? (
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No Image</span>
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              {project.description && (
                <p className="text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {project.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.category && (
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    {project.category}
                  </span>
                )}
                {project.tags?.slice(0, 3).map((tag: string) => (
                  <span 
                    key={tag} 
                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  )
}

function renderServices(services: any[]) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {services.map((service) => (
        <Card key={service.id} className="p-6">
          <Link href={`/services/${service.slug}`} className="block h-full">
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            {service.description && (
              <p className="text-muted-foreground">
                {service.description}
              </p>
            )}
          </Link>
        </Card>
      ))}
    </div>
  )
}
