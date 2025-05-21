import { Container } from "@/components/ui/container"
import { getPublishedPosts } from "@/lib/api/public/posts"
import Link from "next/link"
import Image from "next/image"

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <Container className="py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-6">Our Blog</h1>
        <p className="text-lg text-muted-foreground">
          Insights and updates from our team
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
              {post.featuredImage && (
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              )}
            </div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-primary">
              {post.title}
            </h2>
            <p className="text-muted-foreground mb-4">{post.excerpt}</p>
            <div className="text-sm text-muted-foreground">
              {new Date(post.publishedAt!).toLocaleDateString()} • {post.author.name}
            </div>
          </Link>
        ))}
      </div>
    </Container>
  )
}
