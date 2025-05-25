"use client"

interface BlogPostContentProps {
  content: string | any;
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  // Ensure content is a string before passing to dangerouslySetInnerHTML
  const htmlContent = typeof content === 'string' 
    ? content 
    : (typeof content === 'object' ? JSON.stringify(content) : String(content));
  
  return (
    <div 
      className="prose prose-lg max-w-none dark:prose-invert 
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:mt-8 prose-headings:mb-4
        prose-p:my-6 prose-p:leading-relaxed 
        prose-a:text-primary hover:prose-a:text-primary/80 
        prose-img:rounded-lg prose-img:mx-auto prose-img:shadow-md" 
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
