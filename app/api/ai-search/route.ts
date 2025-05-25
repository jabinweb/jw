import { NextResponse } from "next/server";
import { getAISearchResults } from "@/lib/gemini";
import { db } from "@/lib/db";

// Cache search results for 1 hour
const SEARCH_CACHE = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Create database context for common queries
async function generateSearchContext(query: string) {
  // Get relevant posts based on query
  const posts = await db.post.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } }
      ],
      status: "published"
    },
    take: 3,
    select: {
      title: true,
      excerpt: true,
      slug: true
    }
  });

  // Get relevant services
  const services = await db.service.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ],
      published: true
    },
    take: 2,
    select: {
      title: true,
      description: true,
      slug: true
    }
  });

  // Format the context for the AI
  let context = "";
  
  if (posts.length > 0) {
    context += "RELEVANT BLOG POSTS:\n";
    posts.forEach(post => {
      context += `Title: ${post.title}\n`;
      context += `Excerpt: ${post.excerpt || "No excerpt available"}\n`;
      context += `URL: /blog/${post.slug}\n\n`;
    });
  }
  
  if (services.length > 0) {
    context += "RELEVANT SERVICES:\n";
    services.forEach(service => {
      context += `Title: ${service.title}\n`;
      context += `Description: ${service.description}\n`;
      context += `URL: /services/${service.slug}\n\n`;
    });
  }

  // Add general website information
  context += "WEBSITE INFORMATION:\n";
  context += "Name: Jabin Web\n";
  context += "Focus: Web development, design, SEO, and digital marketing services\n";
  context += "Contact: Available through the contact form at /contact\n";

  return context;
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { query } = body;
    
    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Query must be a string with at least 2 characters" },
        { status: 400 }
      );
    }
    
    const normalizedQuery = query.trim().toLowerCase();
    const cacheKey = `ai-search:${normalizedQuery}`;
    
    // Check cache first
    const now = Date.now();
    if (SEARCH_CACHE.has(cacheKey)) {
      const cachedValue = SEARCH_CACHE.get(cacheKey)!;
      if (now - cachedValue.timestamp < CACHE_TTL) {
        // Return cached result if still valid
        console.log('[AI-SEARCH] Cache hit:', normalizedQuery);
        return NextResponse.json(cachedValue.data);
      } else {
        // Remove expired entry
        SEARCH_CACHE.delete(cacheKey);
      }
    }
    
    // Generate context for the AI
    const context = await generateSearchContext(normalizedQuery);
    
    // Get AI response
    const result = await getAISearchResults(normalizedQuery, context);
    
    // Store in cache
    SEARCH_CACHE.set(cacheKey, { 
      data: result, 
      timestamp: now 
    });
    
    // Clean cache if it gets too big
    if (SEARCH_CACHE.size > 100) {
      const oldestKey = Array.from(SEARCH_CACHE.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
      SEARCH_CACHE.delete(oldestKey);
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("[AI-SEARCH] Error:", error);
    return NextResponse.json(
      { error: "Failed to process AI search" },
      { status: 500 }
    );
  }
}
