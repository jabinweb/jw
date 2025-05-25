export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

// In-memory cache for recent search results
const CACHE = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_ENTRIES = 100;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q") || ""
    const type = searchParams.get("type")
    const limit = Number(searchParams.get("limit")) || 5
    
    if (!query || query.length < 2) {
      return NextResponse.json({ 
        posts: [],
        projects: [],
        services: [],
        totalResults: 0,
        query
      })
    }

    // Create cache key
    const cacheKey = `${query.toLowerCase()}-${type || 'all'}-${limit}`;
    
    // Check cache first
    const now = Date.now();
    if (CACHE.has(cacheKey)) {
      const cachedValue = CACHE.get(cacheKey)!;
      if (now - cachedValue.timestamp < CACHE_TTL) {
        // Return cached result if still valid
        return new NextResponse(JSON.stringify(cachedValue.data), { 
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "X-Cache": "HIT"
          }
        });
      } else {
        // Remove expired entry
        CACHE.delete(cacheKey);
      }
    }

    const session = await auth()
    const isAdmin = session?.user?.role === "admin"

    // Prepare search terms for more flexible matching
    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 1);
    
    // Optimize db queries by using Promise.all for parallel execution
    const [posts, projects, services] = await Promise.all([
      !type || type === "posts" ? fetchPosts(searchTerms, query, isAdmin, limit) : [],
      !type || type === "projects" ? fetchProjects(searchTerms, query, limit) : [],
      !type || type === "services" ? fetchServices(searchTerms, query, limit) : []
    ]);

    const totalResults = posts.length + projects.length + services.length;

    const result = {
      posts,
      projects,
      services,
      totalResults,
      query
    };
    
    // Store in cache
    CACHE.set(cacheKey, { data: result, timestamp: now });
    
    // Clean up old cache entries if needed
    if (CACHE.size > MAX_CACHE_ENTRIES) {
      let oldest = { key: '', time: Infinity };
      Array.from(CACHE.keys()).forEach(key => {
        const value = CACHE.get(key)!;
        if (value.timestamp < oldest.time) {
          oldest = { key, time: value.timestamp };
        }
      });
      CACHE.delete(oldest.key);
    }

    return new NextResponse(JSON.stringify(result), { 
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Cache": "MISS"
      }
    });
  } catch (error) {
    console.error("[SEARCH API] Error:", error)
    return new NextResponse(JSON.stringify({ 
      posts: [], 
      projects: [], 
      services: [],
      totalResults: 0,
      error: "Search failed" 
    }), { 
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}

// Split out DB queries into separate functions for clarity
async function fetchPosts(searchTerms: string[], query: string, isAdmin: boolean, limit: number) {
  try {
    return await db.post.findMany({
      where: {
        OR: [
          // Multi-term search
          ...searchTerms.map(term => ({
            title: { contains: term, mode: 'insensitive' as const }
          })),
          ...searchTerms.map(term => ({
            excerpt: { contains: term, mode: 'insensitive' as const }
          })),
          // Exact matches
          { title: { contains: query, mode: 'insensitive' as const } },
          { excerpt: { contains: query, mode: 'insensitive' as const } },
        ],
        // Only admins can see drafts
        status: isAdmin ? undefined : "published",
        publishedAt: isAdmin ? undefined : { not: null },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        author: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: { publishedAt: "desc" },
      take: limit
    });
  } catch (error) {
    console.error("[SEARCH API] Post search error:", error);
    return [];
  }
}

async function fetchProjects(searchTerms: string[], query: string, limit: number) {
  try {
    // Change from const to let since we'll modify this array later
    let projects = await db.project.findMany({
      where: {
        OR: [
          // Multi-term search for projects
          ...searchTerms.map(term => ({
            title: { contains: term, mode: 'insensitive' as const }
          })),
          ...searchTerms.map(term => ({
            description: { contains: term, mode: 'insensitive' as const }
          })),
          // Exact matches
          { title: { contains: query, mode: 'insensitive' as const } },
          { description: { contains: query, mode: 'insensitive' as const } },
          { slug: { contains: query, mode: 'insensitive' as const } },
          { category: { contains: query, mode: 'insensitive' as const } },
          // Complex tag search is handled separately
        ],
        status: { in: ["active", "completed"] },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        category: true,
      },
      orderBy: { updatedAt: "desc" },
      take: limit
    })
    
    // Additional tag search with string matching
    // This handles the case where a tag might contain the search term
    const tagProjects = await db.project.findMany({
      where: {
        tags: { hasSome: searchTerms },
        status: { in: ["active", "completed"] },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        category: true,
      }
    });
    
    // Merge projects and remove duplicates
    const projectIds = new Set(projects.map(p => p.id));
    for (const project of tagProjects) {
      if (!projectIds.has(project.id)) {
        projects.push(project);
        projectIds.add(project.id);
      }
    }
    
    // Now this reassignment is valid since projects is declared with let
    projects = projects.slice(0, limit);
    
    return projects;
  } catch (error) {
    console.error("[SEARCH API] Project search error:", error);
    return [];
  }
}

async function fetchServices(searchTerms: string[], query: string, limit: number) {
  try {
    // First pass: regular search
    let services = await db.service.findMany({
      where: {
        OR: [
          // Multi-term search for services
          ...searchTerms.map(term => ({
            title: { contains: term, mode: 'insensitive' as const }
          })),
          ...searchTerms.map(term => ({
            description: { contains: term, mode: 'insensitive' as const }
          })),
          // Exact matches
          { title: { contains: query, mode: 'insensitive' as const } },
          { description: { contains: query, mode: 'insensitive' as const } },
          { slug: { contains: query, mode: 'insensitive' as const } },
        ],
        published: true
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        content: true, // Include content for better matches
      },
      take: limit
    })
    
    // Deep content search for highly relevant matches
    // This handles the case where content might contain the search term
    const contentSearchServices = await db.service.findMany({
      where: {
        content: { contains: query, mode: 'insensitive' as const },
        published: true,
        // Exclude already found services
        id: { notIn: services.map(s => s.id) }
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        content: true,
      },
      take: limit - services.length
    });
    
    services = [...services, ...contentSearchServices];
    return services;
  } catch (error) {
    console.error("[SEARCH API] Service search error:", error);
    return [];
  }
}
