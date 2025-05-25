"use client"
import { FileText, Briefcase, Globe, AlertTriangle } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

// Define types for our data structures
interface Post {
  id: string;
  title: string;
  slug: string;
  featuredImage?: string | null;
  excerpt?: string | null;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  coverImage?: string | null;
  category?: string | null;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
}

interface SearchResultsProps {
  results: {
    posts?: Post[];
    projects?: Project[];
    services?: Service[];
  } | null;
  onSelect: (value: string) => void;
  error?: string | null;
  highlightedIndex?: number;
}

export function SearchResults({ 
  results, 
  onSelect,
  error,
  highlightedIndex = -1
}: SearchResultsProps) {
  // Always declare hooks at the top level, regardless of conditions
  const highlightedRef = useRef<HTMLDivElement>(null);
  
  // Always use effects at the top level
  useEffect(() => {
    if (highlightedRef.current && highlightedIndex >= 0) {
      highlightedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [highlightedIndex]);

  // Handle error state
  if (error) {
    return (
      <div className="py-6 text-center">
        <AlertTriangle className="h-6 w-6 text-destructive mx-auto mb-2" />
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  // Handle empty or missing results
  if (!results || typeof results !== 'object') {
    console.warn("[SearchResults] Invalid results data:", results);
    return null;
  }
  
  // Ensure the arrays exist even if they're not in the results
  const posts = Array.isArray(results.posts) ? results.posts : [];
  const projects = Array.isArray(results.projects) ? results.projects : [];
  const services = Array.isArray(results.services) ? results.services : [];
  
  // Check if there are actually any results
  const totalResults = posts.length + projects.length + services.length;
  
  if (totalResults === 0) {
    return null;
  }

  // Helper for creating URLs
  const handleSelectItem = (url: string) => {
    console.log("[SearchResults] Selected item with URL:", url);
    onSelect(url);
  };

  // Flatten all results for keyboard navigation (not used in this implementation but kept for reference)
  const allItems = [
    ...posts.map(p => ({ type: 'post' as const, item: p, url: `/blog/${p.slug}` })),
    ...projects.map(p => ({ type: 'project' as const, item: p, url: `/portfolio/${p.slug}` })),
    ...services.map(s => ({ type: 'service' as const, item: s, url: `/services/${s.slug}` }))
  ];

  return (
    <div className="max-h-80 overflow-y-auto">
      {/* Blog Posts */}
      {posts.length > 0 && (
        <div className="py-1.5 px-2">
          <div className="text-xs font-medium text-muted-foreground px-2 mb-1.5">
            Blog Posts
          </div>
          <div className="space-y-1">
            {posts.map((post: Post, idx: number) => {
              const index = idx;
              const isHighlighted = index === highlightedIndex;
              
              return (
                <div
                  ref={isHighlighted ? highlightedRef : null}
                  key={post.id}
                  className={cn(
                    "flex items-center py-3 px-2 cursor-pointer rounded-md",
                    isHighlighted ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                  )}
                  onClick={() => handleSelectItem(`/blog/${post.slug}`)}
                >
                  <div className="flex-shrink-0 mr-3">
                    {post.featuredImage ? (
                      <div className="relative w-10 h-10 rounded overflow-hidden">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-10 h-10 bg-muted rounded">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <p className="font-medium truncate">{post.title}</p>
                    {post.excerpt && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {posts.length > 0 && (projects.length > 0 || services.length > 0) && (
        <hr className="my-1 border-border" />
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="py-1.5 px-2">
          <div className="text-xs font-medium text-muted-foreground px-2 mb-1.5">
            Projects
          </div>
          <div className="space-y-1">
            {projects.map((project: Project, idx: number) => {
              const index = posts.length + idx;
              const isHighlighted = index === highlightedIndex;
              
              return (
                <div
                  ref={isHighlighted ? highlightedRef : null}
                  key={project.id}
                  className={cn(
                    "flex items-center py-3 px-2 cursor-pointer rounded-md",
                    isHighlighted ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                  )}
                  onClick={() => handleSelectItem(`/portfolio/${project.slug}`)}
                >
                  <div className="flex-shrink-0 mr-3">
                    {project.coverImage ? (
                      <div className="relative w-10 h-10 rounded overflow-hidden">
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-10 h-10 bg-muted rounded">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <p className="font-medium truncate">{project.title}</p>
                    {project.category && (
                      <p className="text-xs text-muted-foreground">
                        {project.category}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {projects.length > 0 && services.length > 0 && (
        <hr className="my-1 border-border" />
      )}

      {/* Services */}
      {services.length > 0 && (
        <div className="py-1.5 px-2">
          <div className="text-xs font-medium text-muted-foreground px-2 mb-1.5">
            Services
          </div>
          <div className="space-y-1">
            {services.map((service: Service, idx: number) => {
              const index = posts.length + projects.length + idx;
              const isHighlighted = index === highlightedIndex;
              
              return (
                <div
                  ref={isHighlighted ? highlightedRef : null}
                  key={service.id}
                  className={cn(
                    "flex items-center py-3 px-2 cursor-pointer rounded-md",
                    isHighlighted ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                  )}
                  onClick={() => handleSelectItem(`/services/${service.slug}`)}
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full mr-3">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <p className="font-medium truncate">{service.title}</p>
                    {service.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
