import React from 'react'
import { Metadata } from 'next'
import { Container } from '@/components/ui/container'
import { JobList } from '@/components/careers/job-list'
import { CareersBanner } from '@/components/careers/careers-banner'
import { CompanyValues } from '@/components/careers/company-values'
import { ApplicationProcess } from '@/components/careers/application-process'

export const metadata: Metadata = {
  title: 'Careers | Jabin Web',
  description: 'Join our team of talented professionals and help us build amazing digital experiences',
}

const jobOpenings = [
  {
    id: 'web-dev-intern',
    title: 'Web Developer Intern',
    type: 'Internship',
    location: 'Remote',
    compensation: 'Unpaid',
    duration: '3-6 months',
    description: 'We are looking for enthusiastic web development interns to join our team. This is an excellent opportunity to gain hands-on experience in a real-world environment, working with modern technologies and industry best practices.',
    responsibilities: [
      'Assist in developing websites and web applications',
      'Write clean, maintainable, and efficient code',
      'Collaborate with senior developers on various projects',
      'Participate in code reviews to learn and improve',
      'Test and debug website functionality across browsers',
      'Help maintain and optimize existing websites'
    ],
    requirements: [
      'Currently pursuing or recently completed a degree in Computer Science, Web Development, or related field',
      'Basic knowledge of HTML, CSS, and JavaScript',
      'Familiarity with responsive design principles',
      'Understanding of version control systems (Git)',
      'Strong desire to learn and grow professionally',
      'Good communication skills and ability to work in a team'
    ],
    benefits: [
      'Valuable real-world experience in web development',
      'Mentorship from experienced professionals',
      'Portfolio-building project work',
      'Flexible remote work schedule',
      'Certificate of completion',
      'Possibility of future employment opportunities'
    ],
    applicationProcess: 'To apply, send your resume, portfolio (if available), and a brief cover letter explaining why you want to join our team.'
  },
  {
    id: 'marketing-expert',
    title: 'Digital Marketing Expert',
    type: 'Commission-based',
    location: 'Remote / Hybrid',
    compensation: 'Commission: 15-25% of client sales',
    duration: 'Ongoing',
    description: 'We are seeking a results-driven Digital Marketing Expert to help grow our client base and revenue. This commission-based role offers unlimited earning potential, with compensation directly tied to your performance and the sales you generate.',
    responsibilities: [
      'Identify and pursue new business opportunities',
      'Develop and implement effective marketing strategies',
      'Create compelling marketing content and proposals',
      'Manage client relationships and ensure satisfaction',
      'Collaborate with our design and development teams',
      'Track campaign performance and optimize strategies',
      'Meet or exceed sales targets'
    ],
    requirements: [
      'Proven experience in digital marketing or sales (2+ years preferred)',
      'Strong understanding of web design/development services',
      'Excellent communication and negotiation skills',
      'Self-motivated with an entrepreneurial mindset',
      'Ability to work independently and meet targets',
      'Strong network or ability to build client relationships',
      'Knowledge of SEO, PPC, social media marketing, and content marketing'
    ],
    benefits: [
      'Unlimited earning potential based on performance',
      'Flexible work schedule and location',
      'Support from experienced design and development teams',
      'Access to premium marketing tools and resources',
      'Regular training and professional development',
      'Opportunity to work with diverse clients across industries'
    ],
    applicationProcess: 'To apply, submit your resume, a brief marketing portfolio, and a cover letter detailing your sales approach and previous successes.'
  }
]

export default function CareersPage() {
  return (
    <main>
      <CareersBanner />
      <Container className="py-16">
        <JobList jobs={jobOpenings} />
      </Container>
      <CompanyValues />
      <Container className="py-16">
        <ApplicationProcess />
      </Container>
    </main>
  )
}
