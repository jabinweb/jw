import React from 'react'
import { Container } from '@/components/ui/container'
import { Star, Users, Zap, Target, Heart, Clock } from 'lucide-react'

const values = [
  {
    icon: Star,
    title: 'Excellence',
    description: 'We strive for excellence in everything we do, from code quality to client communication.'
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We believe great things happen when talented people work together toward a common goal.'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We embrace new technologies and approaches to solve complex problems effectively.'
  },
  {
    icon: Target,
    title: 'Results-Driven',
    description: 'We focus on delivering tangible results that drive success for our clients.'
  },
  {
    icon: Heart,
    title: 'Passion',
    description: "We're passionate about our work and dedicated to making a positive impact."
  },
  {
    icon: Clock,
    title: 'Growth',
    description: 'We invest in continuous learning and professional development for our team.'
  }
]

export function CompanyValues() {
  return (
    <section className="bg-muted py-16">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These core values guide everything we do at Jabin Web
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                </div>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
