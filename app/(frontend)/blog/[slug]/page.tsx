import { Container } from "@/components/ui/container"
import { getPublishedPost, getAdjacentPosts } from "@/lib/api/public/posts"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, User, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardFooter } from "@/components/ui/card"
import { BlogPostImage } from "@/components/blog/blog-post-image"
import { BlogPostContent } from "@/components/blog/blog-post-content"
import { BlogPostNavigation } from "@/components/blog/blog-post-navigation"
import { AdminEditButton } from "@/components/blog/admin-edit-button"
import Image from "next/image"

// Add a helper function to safely extract tags
function getTagsFromMetadata(metadata: any): string[] {
  if (!metadata) return [];
  
  // Handle the case when metadata is a string (from JSON stringify/parse)
  const meta = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
  
  if (!meta.tags) return [];
  
  if (typeof meta.tags === 'string') {
    return [meta.tags];
  }
  
  if (Array.isArray(meta.tags)) {
    return meta.tags.filter((tag: any): tag is string => typeof tag === 'string');
  }
  
  return [];
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPublishedPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  // Enhanced SEO metadata
  return {
    title: `${post.title} | Blog | Jabin Web`,
    description: post.excerpt || `Read about ${post.title} on our blog.`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read about ${post.title} on our blog.`,
      type: 'article',
      publishedTime: post.publishedAt?.toString(),
      authors: [post.author.name || 'Jabin Web'],
      images: post.featuredImage ? [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || `Read about ${post.title} on our blog.`,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({
  params
}: {
  params: { slug: string }
}) {
  const post = await getPublishedPost(params.slug)
  
  if (!post) {
    notFound()
  }
  
  // Get adjacent posts for pagination
  const { previousPost, nextPost } = await getAdjacentPosts(params.slug)

  // Extract tags from metadata using our safe helper function
  const tags = getTagsFromMetadata(post.metadata);

  return (
    <Container className="py-16 md:py-24">
      <article className="max-w-3xl mx-auto">
        {/* Header with title and metadata */}
        <header className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl md:text-4xl font-bold !leading-[1.2em] tracking-tighter">
              {post.title}
            </h1>
            
            {/* Admin edit button - only visible to authenticated admin users */}
            <AdminEditButton postId={post.id} />
          </div>
          
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-4 border-b">
            {/* Author */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author.name || "Anonymous"}</span>
            </div>
            
            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.publishedAt!.toString()}>
                {format(new Date(post.publishedAt!), "MMMM d, yyyy")}
              </time>
            </div>

            {/* Display tags if available */}
            {tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4" />
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Featured image positioned after metadata */}
        {post.featuredImage && (
          <div className="relative w-full aspect-video mb-10 rounded-lg overflow-hidden">
            <BlogPostImage 
              src={post.featuredImage} 
              alt={post.title} 
            />
          </div>
        )}
        
        {/* Render the content from HTML (using a client component) */}
        <BlogPostContent 
          content={typeof post.content === 'string' 
            ? post.content 
            : String(post.content)
          } 
        />
        
        {/* Author bio section with improved spacing */}
        {post.author.image && (
          <div className="mt-12 py-6 px-6 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden flex-shrink-0">
                <Image 
                  src={post.author.image} 
                  alt={post.author.name || ""} 
                  width={60}
                  height={60}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-lg">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">Author</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Post navigation with clearer separation */}
        <BlogPostNavigation 
          previousPost={previousPost} 
          nextPost={nextPost} 
        />
        
        {/* Related posts section */}
        {(previousPost || nextPost) && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Read More</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {previousPost && (
                <Card className="overflow-hidden">
                  {previousPost.featuredImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={previousPost.featuredImage}
                        alt={previousPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardFooter className="flex flex-col items-start pt-6">
                    <span className="text-xs text-muted-foreground mb-2">Previous Post</span>
                    <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                      {previousPost.title}
                    </h3>
                    <Link 
                      href={`/blog/${previousPost.slug}`}
                      className={buttonVariants({ variant: "link", size: "sm" })}
                    >
                      Read Post
                    </Link>
                  </CardFooter>
                </Card>
              )}
              
              {nextPost && (
                <Card className="overflow-hidden">
                  {nextPost.featuredImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={nextPost.featuredImage}
                        alt={nextPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardFooter className="flex flex-col items-start pt-6">
                    <span className="text-xs text-muted-foreground mb-2">Next Post</span>
                    <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                      {nextPost.title}
                    </h3>
                    <Link 
                      href={`/blog/${nextPost.slug}`}
                      className={buttonVariants({ variant: "link", size: "sm" })}
                    >
                      Read Post
                    </Link>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        )}
      </article>
    </Container>
  );
}
