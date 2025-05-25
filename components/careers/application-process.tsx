import React from 'react'
import { Check } from 'lucide-react'

const steps = [
  {
    title: 'Submit Application',
    description: 'Fill out our application form with your details, resume, and portfolio (if applicable).'
  },
  {
    title: 'Initial Review',
    description: 'Our team will review your application and assess if your skills and experience match our needs.'
  },
  {
    title: 'Skill Assessment',
    description: 'Depending on the role, we may ask you to complete a small test project or assessment.'
  },
  {
    title: 'Interview',
    description: 'Meet with our team to discuss your experience, skills, and how you can contribute to our projects.'
  },
  {
    title: 'Final Decision',
    description: 'We\'ll make a decision and extend an offer to successful candidates.'
  }
]

export function ApplicationProcess() {
  return (
    <section className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Application Process</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Here&apos;s what to expect when applying to join our team
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4 mb-6">
            <div className="flex-shrink-0 mt-1">
              <div className="bg-primary/10 rounded-full p-1">
                <Check className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
