import React from 'react'
import { Container } from '@/components/ui/container'

export function CareersBanner() {
  return (
    <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 md:py-24">
      <Container>
        <div className="flex flex-col max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
            Join Our Team
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            At Jabin Web, we&apos;re looking for talented individuals who are passionate about creating exceptional digital experiences. 
            Join our team and help us build the future of the web.
          </p>
        </div>
      </Container>
    </section>
  )
}
