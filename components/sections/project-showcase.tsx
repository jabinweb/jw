"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { ArrowRight, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const projects = [
  {
    title: "North India Baptist Seminary",
    category: "Education Website",
    url: "https://nibsindia.com",
    fallbackImage: "/projects/nibs-fallback.jpg",
    description: "Modern seminary website with course management and student portal",
    link: "/portfolio/nibs"
  },
  {
    title: "Holy Blessing Trust",
    category: "Non-Profit Organization",
    url: "https://holyblessingtrust.org",
    fallbackImage: "/projects/hbt-fallback.jpg",
    description: "Trust website with donation system and event management",
    link: "/portfolio/hbt"
  },
  {
    title: "Spurring Ventures India",
    category: "Business Website",
    url: "https://spurringventures.com",
    fallbackImage: "/projects/spurring-fallback.jpg",
    description: "Corporate website with modern design and animations",
    link: "/portfolio/spurring"
  },
  {
    title: "ScioSprints",
    category: "Web Application",
    url: "https://sprints.sciolabs.in/",
    fallbackImage: "/projects/sciosprints-fallback.jpg",
    description: "Project management tool with agile methodology",
    link: "/portfolio/sciosprints"
  },
  {
    title: "Scio Labs",
    category: "Corporate Website",
    url: "http://sciolabs.in",
    fallbackImage: "/projects/sciolabs-fallback.jpg",
    description: "Research and development company website",
    link: "/portfolio/sciolabs"
  },
  {
    title: "Scio Guidance",
    category: "Education Platform",
    url: "https://guidance.sciolabs.in",
    fallbackImage: "/projects/guidance-fallback.jpg",
    description: "Online learning platform with career guidance",
    link: "/portfolio/guidance"
  }
]

type Project = {
  title: string
  category: string
  url: string
  fallbackImage: string
  description: string
  link: string
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={project.url} target="_blank" className="group block">
        <div className="relative h-50 aspect-video mb-4 overflow-hidden bg-muted">
          {!imageError ? (
            <Image
              src={`https://jabin-screenshot-api.vercel.app/screenshot?url=${encodeURIComponent(project.url)}`}
              alt={`${project.title} Screenshot`}
              fill
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              {project.fallbackImage ? (
                <Image
                  src={project.fallbackImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Preview not available</p>
                </div>
              )}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground mb-2">{project.category}</p>
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
      </Link>
    </motion.div>
  )
}

export function ProjectShowcase() {
  return (
    <section className="py-24 bg-muted/30">
      <Container>
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            Our Work
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold mb-4"
          >
            Featured Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Explore our recent work and see how we help businesses succeed
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild>
            <Link href="/portfolio">
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}
