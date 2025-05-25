"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Globe,
  ShoppingBag,
  Palette,
  Search,
  Code,
  Settings,
} from "lucide-react"

const formSchema = z.object({
  serviceType: z.string().min(1, "Please select a service"),
  budget: z.string().min(1, "Please select a budget range"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  companyName: z.string().min(2, "Organization name is required"),
})

const services = [
  { id: "website", name: "Website Design", icon: Globe },
  { id: "ecommerce", name: "eCommerce", icon: ShoppingBag },
  { id: "branding", name: "Branding & Design", icon: Palette },
  { id: "seo", name: "SEO & Marketing", icon: Search },
  { id: "development", name: "Custom Development", icon: Code },
  { id: "maintenance", name: "Website Maintenance", icon: Settings },
]

const budgetRanges = [
  "Under $2,500",
  "$2,500 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+"
]

interface MultiStepFormProps {
  onComplete?: () => void
}

export function MultiStepForm({ onComplete }: MultiStepFormProps) {
  const [step, setStep] = useState(1)
  const { toast } = useToast()
  const router = useRouter()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: "",
      budget: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      companyName: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formName: 'get-started-form',
          data: {
            ...data,
            submittedAt: new Date().toISOString()
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to submit form')
      }

      toast({
        title: "Success!",
        description: "Thank you for your interest. We'll be in touch soon!",
      })

      if (onComplete) {
        setTimeout(onComplete, 2000)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold mb-6">What type of service are you looking for?</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {services.map((service) => {
                    const Icon = service.icon
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => {
                          form.setValue("serviceType", service.id)
                          nextStep()
                        }}
                        className={`p-6 rounded-lg border-2 hover:border-primary transition-colors text-center space-y-2 ${
                          form.watch("serviceType") === service.id ? "border-primary" : "border-muted"
                        }`}
                      >
                        <Icon className="w-8 h-8 mx-auto text-primary" />
                        <span className="block font-medium">{service.name}</span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold mb-6 text-center">
                  What&apos;s your estimated budget?
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 place-items-center max-w-2xl mx-auto">
                  {budgetRanges.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => {
                        form.setValue("budget", range)
                        nextStep()
                      }}
                      className={`w-full p-6 rounded-lg border-2 hover:border-primary transition-colors text-center ${
                        form.watch("budget") === range ? "border-primary bg-primary/5" : "border-muted"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold mb-6">Where can we reach you?</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...form.register("firstName")}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...form.register("lastName")}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    {...form.register("companyName")}
                    placeholder="Acme Inc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Company Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="john@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  By clicking Get Started, I acknowledge receipt of the{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    Spurring Privacy Policy
                  </a>
                  .
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={nextStep} className="ml-auto">
                Next
              </Button>
            ) : (
              <Button type="submit" className="ml-auto">
                Get Started
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  )
}