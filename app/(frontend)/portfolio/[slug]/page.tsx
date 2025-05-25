import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Container } from "@/components/ui/container"
import { formatDate } from "@/lib/utils"
import { ProjectImage, ProjectGalleryImage } from "@/components/portfolio/project-image"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await db.project.findUnique({
    where: { slug: params.slug }
  });

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Portfolio | Jabin Web`,
    description: project.description,
    openGraph: {
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await db.project.findUnique({
    where: { slug: params.slug },
    include: {
      client: {
        select: {
          name: true,
          email: true,
          image: true
        }
      }
    }
  });

  if (!project) {
    notFound();
  }

  return (
    <Container className="py-16">
      <div className="mb-6">
        <Link 
          href="/portfolio" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Portfolio
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{project.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{project.description}</p>

          <div className="relative w-full aspect-video mb-8 rounded-xl overflow-hidden bg-muted/40">
            <ProjectImage 
              src={project.coverImage} 
              websiteUrl={project.metadata && typeof project.metadata === 'object' && 'clientWebsite' in project.metadata ? String(project.metadata.clientWebsite) : undefined} 
              alt={project.title} 
            />
          </div>

          {project.content && typeof project.content === 'object' && 'sections' in project.content && Array.isArray(project.content.sections) && project.content.sections.map((section: any, index: number) => (
            <div key={index} className="mb-8">
              {section.type === 'text' && (
                <div className="prose prose-lg max-w-none">{section.content}</div>
              )}
              {section.type === 'challenges' && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Challenges</h3>
                  <div className="prose prose-lg max-w-none">{section.content}</div>
                </div>
              )}
              {section.type === 'solutions' && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Our Solution</h3>
                  <div className="prose prose-lg max-w-none">{section.content}</div>
                </div>
              )}
            </div>
          ))}

          {project.images && project.images.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.images.map((image, i) => (
                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-muted/40">
                    <ProjectGalleryImage
                      src={image}
                      alt={`${project.title} screenshot ${i+1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-muted rounded-lg p-6 sticky top-24">
            <h3 className="text-lg font-medium mb-4">Project Details</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Client</div>
                <div className="font-medium">{project.metadata && typeof project.metadata === 'object' && 'clientName' in project.metadata ? String(project.metadata.clientName) : project.client.name}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Category</div>
                <div className="font-medium">{project.category}</div>
              </div>
              
              {project.metadata && typeof project.metadata === 'object' && 'technology' in project.metadata && (
                <div>
                  <div className="text-sm text-muted-foreground">Technology</div>
                  <div className="font-medium">{String(project.metadata.technology)}</div>
                </div>
              )}
              
              {project.tags && project.tags.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground">Tags</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {(project.startDate || project.endDate) && (
                <div>
                  <div className="text-sm text-muted-foreground">Timeline</div>
                  <div className="font-medium">
                    {project.startDate && formatDate(project.startDate.toString())}
                    {project.endDate && ` - ${formatDate(project.endDate.toString())}`}
                  </div>
                </div>
              )}
              
              {project.metadata && typeof project.metadata === 'object' && 'projectDuration' in project.metadata && (
                <div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="font-medium">{String(project.metadata.projectDuration)}</div>
                </div>
              )}
              
              {project.metadata && typeof project.metadata === 'object' && 'testimonial' in project.metadata && (
                <div className="mt-6 p-4 bg-primary/5 rounded border border-primary/10 italic">
                  &ldquo;{String(project.metadata.testimonial)}&rdquo;
                </div>
              )}
              
              {project.metadata && typeof project.metadata === 'object' && 'clientWebsite' in project.metadata && project.metadata.clientWebsite && (
                <div className="mt-6">
                  <Button asChild className="w-full">
                    <a 
                      href={String(project.metadata.clientWebsite)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center"
                    >
                      Visit Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
