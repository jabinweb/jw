'use client'

import { Container } from "@/components/ui/container"
import { motion } from "framer-motion"
import Link from "next/link"
import { Globe, ShoppingBag, Palette, Search, Settings, Smartphone } from "lucide-react"

const services = [
  {
    title: "Website Design",
    icon: Globe,
    description: "Custom, responsive websites that engage visitors and drive conversions.",
    slug: "website-design"
  },
  {
    title: "E-commerce Solutions",
    icon: ShoppingBag,
    description: "Powerful online stores with seamless shopping experiences.",
    slug: "ecommerce"
  },
  {
    title: "Branding & Design",
    icon: Palette,
    description: "Build a strong brand identity that sets you apart.",
    slug: "branding"
  },
  {
    title: "SEO & Marketing",
    icon: Search,
    description: "Improve visibility and attract organic traffic.",
    slug: "seo"
  },
  {
    title: "Website Maintenance",
    icon: Settings,
    description: "Keep your website secure, fast, and up-to-date.",
    slug: "maintenance"
  },
  {
    title: "App Development",
    icon: Smartphone,
    description: "Custom mobile and web applications for your business.",
    slug: "app-development"
  }
]

export default function ServicesPage() {
  return (
    <Container className="py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-6">Our Services</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive digital solutions to help your business grow online
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <motion.div
            key={service.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <Link
              href={`/services/${service.slug}`}
              className="block p-8 rounded-2xl border bg-card hover:bg-accent/50 transition-colors"
            >
              <service.icon className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-2xl font-semibold mb-2">{service.title}</h2>
              <p className="text-muted-foreground">{service.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </Container>
  )
}
