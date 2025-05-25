"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  resumeUrl: z.string().url("Please provide a link to your resume"),
  coverLetter: z.string().min(50, "Cover letter is required (min 50 characters)"),
  portfolioUrl: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface ApplicationFormProps {
  jobTitle: string
  jobId: string
}

export function ApplicationForm({ jobTitle, jobId }: ApplicationFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      // In a real app, you would submit to an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      toast({
        title: "Application Submitted",
        description: "Thank you for your interest. We'll review your application and get back to you soon.",
      })
      
      reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" name="jobTitle" value={jobTitle} />
      <input type="hidden" name="jobId" value={jobId} />
      
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          {...register("name")}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          {...register("phone")}
          className={errors.phone ? "border-destructive" : ""}
        />
        {errors.phone && (
          <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="resumeUrl">
          Resume Link (Google Drive, Dropbox, etc.)
        </Label>
        <Input
          id="resumeUrl"
          {...register("resumeUrl")}
          placeholder="https://drive.google.com/..."
          className={errors.resumeUrl ? "border-destructive" : ""}
        />
        {errors.resumeUrl && (
          <p className="text-sm text-destructive mt-1">{errors.resumeUrl.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="portfolioUrl">Portfolio/Github Link (Optional)</Label>
        <Input
          id="portfolioUrl"
          {...register("portfolioUrl")}
        />
      </div>
      
      <div>
        <Label htmlFor="coverLetter">Cover Letter</Label>
        <Textarea
          id="coverLetter"
          {...register("coverLetter")}
          rows={5}
          className={errors.coverLetter ? "border-destructive" : ""}
        />
        {errors.coverLetter && (
          <p className="text-sm text-destructive mt-1">{errors.coverLetter.message}</p>
        )}
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  )
}
