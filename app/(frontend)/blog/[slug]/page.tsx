import { Container } from "@/components/ui/container"
import { getPublishedPost } from "@/lib/api/public/posts"
import { notFound } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { type PostContent, type ParagraphContent, type TextContent } from "@/types/post"

export default async function BlogPostPage({
  params
}: {
  params: { slug: string }
}) {
  const post = await getPublishedPost(params.slug)
  
  if (!post) {
    notFound()
  }

  // Ensure content is always in correct format
  const content = Array.isArray(post.content) && post.content.length > 0
    ? post.content
    : [{ 
        type: "paragraph", 
        content: [{ 
          type: "text", 
          text: String(post.content || '') 
        }] 
      }]

  return (
    <Container className="py-24">
      <article className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {post.author.image && (
              <Image
                src={post.author.image}
                alt={post.author.name || ""}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div>
              <div>{post.author.name}</div>
              <div>{new Date(post.publishedAt!).toLocaleDateString()}</div>
            </div>
          </div>
        </header>
        {post.featuredImage && (
          <div className="relative h-[400px] mb-12">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
        <div className="prose prose-lg max-w-none">
          {(content as PostContent).map((block: ParagraphContent, index: number) => {
            if (block.type === 'paragraph') {
              return (
                <p key={index} className="mb-4">
                  {block.content?.map((node: TextContent, i: number) => (
                    <span key={i} className={cn({
                      'font-bold': node.marks?.some((m: { type: string }) => m.type === 'bold'),
                      'italic': node.marks?.some((m: { type: string }) => m.type === 'italic'),
                      'underline hover:no-underline': node.marks?.some((m: { type: string }) => m.type === 'link'),
                    })}>
                      {node.text}
                    </span>
                  ))}
                </p>
              )
            }
            return null
          })}
        </div>
      </article>
    </Container>
  )
}
