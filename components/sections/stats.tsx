"use client"

import { motion } from "framer-motion"
import { Container } from "@/components/ui/container"
import { Users, Award, Globe2, Star } from "lucide-react"

const stats = [
  {
    icon: <Users className="h-6 w-6" />,
    value: "150+",
    label: "Happy Clients",
    description: "Trusted by businesses worldwide"
  },
  {
    icon: <Award className="h-6 w-6" />,
    value: "200+",
    label: "Projects Completed",
    description: "Delivering excellence since 2020"
  },
  {
    icon: <Globe2 className="h-6 w-6" />,
    value: "15+",
    label: "Countries Served",
    description: "Global reach, local expertise"
  },
  {
    icon: <Star className="h-6 w-6" />,
    value: "98%",
    label: "Client Satisfaction",
    description: "Based on client feedback"
  }
]

export function Stats() {
  return (
    <section className="py-16 border-y bg-muted/30">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center space-y-2"
            >
              <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="font-medium">{stat.label}</p>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
