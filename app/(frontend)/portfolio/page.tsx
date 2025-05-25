'use client';

import { useEffect, useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define the type for projects
interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  category: string | null;
  clientId: string;
  status: string;
  featured: boolean;
  metadata?: {
    clientName?: string;
    clientWebsite?: string;
    technology?: string;
  } | null;
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Get featured projects from our database
        const response = await fetch('/api/projects?featured=true');
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="container py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary">Our Work</h1>
        <p className="mb-16 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our featured projects showcasing our expertise in web development and design
        </p>
      </div>

      {loading && (
        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden flex flex-col animate-pulse">
              <div className="relative w-full aspect-video bg-muted"></div>
              <CardHeader className="pb-2">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="h-4 bg-muted rounded w-full mt-2"></div>
                <div className="h-4 bg-muted rounded w-5/6 mt-2"></div>
              </CardContent>
              <CardFooter className="pt-2 flex gap-2">
                <div className="h-10 bg-muted rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {error && (
        <p className="text-center text-lg text-red-500">{error}</p>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="group overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 border-transparent hover:border-primary/20">
            <div className="relative w-full aspect-video overflow-hidden">
              {project.metadata?.clientWebsite ? (
                <>
                  <div className="absolute inset-0 bg-muted/80 flex items-center justify-center z-10 animate-pulse">
                    <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  </div>
                  <Image
                    src={`https://jabin-screenshot-api.vercel.app/screenshot?url=${encodeURIComponent(project.metadata.clientWebsite)}`}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 z-20"
                    onLoad={(e) => {
                      e.currentTarget.style.zIndex = "30";
                      e.currentTarget.previousElementSibling?.classList.add('hidden');
                    }}
                    onError={(e) => {
                      if (project.coverImage) {
                        e.currentTarget.previousElementSibling?.classList.add('hidden');
                        (e.currentTarget as HTMLImageElement).src = project.coverImage;
                      } else {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.previousElementSibling?.classList.remove('animate-pulse');
                        (e.currentTarget.previousElementSibling as HTMLElement).innerHTML = 
                          `<span class="text-muted-foreground font-medium">Preview not available</span>`;
                      }
                    }}
                  />
                </>
              ) : project.coverImage ? (
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <h3 className="text-xl font-semibold transition-colors group-hover:text-primary">
                {project.title}
              </h3>
              <p className="text-sm font-medium text-muted-foreground">{project.category}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground line-clamp-2">{project.description}</p>
              {project.metadata?.technology && (
                <p className="text-xs font-medium text-primary/80 mt-3 uppercase tracking-wider">
                  {project.metadata.technology}
                </p>
              )}
            </CardContent>
            <CardFooter className="pt-2 flex gap-2">
              <Button variant="outline" asChild className="flex-1 group-hover:border-primary/50">
                <Link href={`/portfolio/${project.slug}`}>View Details</Link>
              </Button>
              {project.metadata?.clientWebsite && (
                <Button variant="default" asChild className="flex-1">
                  <a 
                    href={project.metadata.clientWebsite}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Visit Site
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
