"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "next-themes"
import Image from "next/image"
import { Container } from "@/components/ui/container"
import { motion } from "framer-motion"

export function Technologies() {
  const { theme } = useTheme()

  const technologies = [
    {
      name: "Next.js",
      image: "https://cdn.worldvectorlogo.com/logos/next-js.svg",
      invertInDark: true,
    },
    {
      name: "React",
      image: "https://cdn.worldvectorlogo.com/logos/react-2.svg",
      invertInDark: false,
    },
    {
      name: "TypeScript",
      image: "https://cdn.worldvectorlogo.com/logos/typescript.svg",
      invertInDark: false,
    },
    {
      name: "Node.js",
      image: "https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg",
      invertInDark: false,
    },
    {
      name: "WordPress",
      image: "https://cdn.worldvectorlogo.com/logos/wordpress-icon-1.svg",
      invertInDark: false,
    },
    {
      name: "Tailwind CSS",
      image: "https://cdn.worldvectorlogo.com/logos/tailwindcss.svg",
      invertInDark: false,
    }
  ]

  return (
    <section className="bg-muted/50 py-20">
      <Container>
         {/* Section Header */}
         <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            Our Tech Stack
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold mb-4"
          >
            Built with Modern Technologies
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            We use industry-leading technologies to create fast, secure, and scalable web solutions
          </motion.p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {technologies.map((tech, index) => (
            <Card 
              key={index} 
              className="bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors"
            >
              <CardContent className="p-6 flex items-center justify-center h-32">
                <div className="relative h-12 w-full">
                  <Image
                    src={tech.image}
                    alt={tech.name}
                    fill
                    className={`object-contain transition-all ${
                      tech.invertInDark ? 'dark:invert' : ''
                    } hover:scale-110 duration-300`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}