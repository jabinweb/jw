"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" 
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FormField } from "@/components/forms/form-field"
import { useToast } from "@/hooks/use-toast"

interface FormRendererProps {
  form: {
    id: string
    name: string
    title: string
    description?: string
    fields: any[]
    status: string
  }
}

export function FormRenderer({ form }: FormRendererProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Dynamically build the schema based on form fields
  const buildSchema = () => {
    const schemaObj: Record<string, any> = {}
    
    form.fields.forEach(field => {
      // Start with the base validator
      let validator = z.string()
      
      // Apply email validation if needed
      if (field.type === 'email') {
        validator = validator.email(`Please enter a valid email address`)
      }
      
      // Apply phone validation if needed
      if (field.type === 'tel') {
        validator = validator.min(7, `Please enter a valid phone number`)
      }
      
      // Apply required/optional last to avoid the type error
      if (field.required) {
        validator = validator.min(1, `${field.label} is required`)
        schemaObj[field.name] = validator
      } else {
        schemaObj[field.name] = validator.optional()
      }
    })
    
    return z.object(schemaObj)
  }

  const schema = buildSchema()
  const methods = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: form.fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.defaultValue || ''
    }), {})
  })

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: form.id,
          data,
          metadata: {
            userAgent: navigator.userAgent,
            submittedAt: new Date().toISOString()
          }
        })
      })
      
      if (!response.ok) {
        throw new Error('Form submission failed')
      }
      
      setIsSubmitted(true)
      toast({
        title: "Form submitted successfully",
        description: "Thank you for your submission!"
      })
      
      // Reset form
      methods.reset()
    } catch (error) {
      console.error('Form submission error:', error)
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was a problem submitting your form."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Thank You!</CardTitle>
          <CardDescription>Your submission has been received.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We appreciate your submission and will get back to you soon.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setIsSubmitted(false)}>Submit Another Response</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{form.title}</CardTitle>
            {form.description && <CardDescription>{form.description}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-6">
            {form.fields.map((field) => (
              <FormField 
                key={field.name} 
                field={field} 
              />
            ))}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}
