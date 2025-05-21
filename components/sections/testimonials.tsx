"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import Image from "next/image"
import { Container } from "@/components/ui/container"

const testimonials = [
  {
    name: "Henry John",
    role: "Professor",
    company: "North India Baptist Seminary",
    image: "https://cdn-icons-png.flaticon.com/512/3048/3048122.png",
    quote: "Jabin Web transformed our seminary's online presence with a modern website that perfectly reflects our values. The course management system has made it easier for our faculty and students to interact.",
    rating: 5,
    date: "2024-02-15"
  },
  {
    name: "Davis Abraham",
    role: "CEO",
    company: "Scio Labs",
    image: "https://cdn-icons-png.flaticon.com/512/3048/3048116.png",
    quote: "Working with Jabin Web was a fantastic experience. They understood our vision and delivered a website that showcases our research and innovations perfectly. Their attention to detail and technical expertise is outstanding.",
    rating: 5,
    date: "2024-01-20"
  },
  {
    name: "Deepak Kumar",
    role: "Manager",
    company: "Holy Blessing Trust",
    image: "https://cdn.worldvectorlogo.com/logos/higornevesme.svg",
    quote: "The website Jabin Web created for our trust has significantly improved our outreach and donation process. Their understanding of non-profit needs and responsive support has been invaluable.",
    rating: 5,
    date: "2024-03-01"
  }
]

export function Testimonials() {
  // Schema as a static string to avoid hydration issues
  const schemaMarkup = {
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Spurring Ventures",
      "review": testimonials.map(t => ({
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": t.rating,
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": t.name
        },
        "reviewBody": t.quote,
        "datePublished": t.date
      }))
    })
  }

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-background via-background/50 to-background">
      {/* Schema markup with dangerouslySetInnerHTML */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={schemaMarkup}
      />

      {/* Enhanced Background Elements with lower z-index */}
      <div className="absolute inset-0 -z-20 bg-grid-pattern opacity-[0.2]" />
      <motion.div 
        className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <Container>
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
              Testimonials
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-4xl font-bold"
          >
            What Our Clients Say
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full backdrop-blur-sm border-primary/10 bg-gradient-to-br from-background/80 to-muted/50">
                <CardContent className="p-8 relative">
                  <Quote className="h-12 w-12 absolute -top-2 -left-2 text-primary opacity-20" />
                  <div className="space-y-6">
                    <p className="text-lg text-muted-foreground relative z-10 italic leading-relaxed">
                    &ldquo;{testimonial.quote}&ldquo;
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-primary/20">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </div>
                        <div className="text-sm bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-medium">
                          {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      </Container>
    </section>
  )
}