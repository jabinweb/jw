import React from 'react'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'
import { ApplicationForm } from '@/components/careers/application-form'
import { jobOpenings } from '@/config/job-openings'

interface JobDetailPageProps {
  params: {
    jobId: string
  }
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const job = jobOpenings.find(job => job.id === params.jobId)
  
  if (!job) {
    return {
      title: 'Job Not Found | Jabin Web',
    }
  }

  return {
    title: `${job.title} | Careers | Jabin Web`,
    description: job.description,
  }
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const job = jobOpenings.find(job => job.id === params.jobId)
  
  if (!job) {
    notFound()
  }

  return (
    <main>
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{job.title}</h1>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {job.type}
                </span>
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium">
                  {job.location}
                </span>
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium">
                  {job.compensation}
                </span>
                {job.duration && (
                  <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium">
                    {job.duration}
                  </span>
                )}
              </div>
              <p className="text-lg mb-8">{job.description}</p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Responsibilities</h2>
                <ul className="list-disc pl-6 space-y-2">
                  {job.responsibilities.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
                <ul className="list-disc pl-6 space-y-2">
                  {job.requirements.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
                <ul className="list-disc pl-6 space-y-2">
                  {job.benefits.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">How to Apply</h2>
                <p className="mb-6">{job.applicationProcess}</p>
              </section>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border bg-card p-6">
              <h3 className="text-xl font-semibold mb-4">Apply for this Position</h3>
              <ApplicationForm jobTitle={job.title} jobId={job.id} />
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}
