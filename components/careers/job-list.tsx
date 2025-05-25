import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface JobProps {
  jobs: {
    id: string
    title: string
    type: string
    location: string
    compensation: string
    description: string
  }[]
}

export function JobList({ jobs }: JobProps) {
  return (
    <section className="py-8">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Open Positions</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join our dynamic team and help us create exceptional digital experiences
        </p>
      </div>
      
      <div className="space-y-6">
        {jobs.map(job => (
          <div 
            key={job.id}
            className="border rounded-lg p-6 bg-card transition-all hover:shadow-md"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {job.type}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                    {job.location}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                    {job.compensation}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-muted-foreground">
                  {job.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button asChild>
                  <Link href={`/careers/${job.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {jobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            There are currently no open positions. Please check back later.
          </p>
        </div>
      )}
    </section>
  )
}
