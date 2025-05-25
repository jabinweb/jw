"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string(),
  siteTagline: z.string().optional(),
  contactEmail: z.string().email("Please enter a valid email"),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  copyright: z.string().optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  defaultCurrency: z.string().default("USD"),
  timezone: z.string().default("UTC"),
  dateFormat: z.string().default("MMMM DD, YYYY"),
  timeFormat: z.string().default("h:mm a")
})

type SiteSettingsValues = z.infer<typeof siteSettingsSchema>

export function SiteSettingsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const form = useForm<SiteSettingsValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: "",
      siteDescription: "",
      siteTagline: "",
      contactEmail: "",
      phoneNumber: "",
      address: "",
      copyright: "",
      logoUrl: "",
      faviconUrl: "",
      defaultCurrency: "USD",
      timezone: "UTC",
      dateFormat: "MMMM DD, YYYY",
      timeFormat: "h:mm a"
    }
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/settings/site")
        if (res.ok) {
          const data = await res.json()
          form.reset(data)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadSettings()
  }, [form, toast])

  async function onSubmit(data: SiteSettingsValues) {
    try {
      setIsLoading(true)
      const res = await fetch("/api/settings/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      
      if (!res.ok) throw new Error("Failed to save settings")
      
      toast({
        title: "Success",
        description: "Settings saved successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Site Identity</h2>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="siteName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Awesome Website" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="siteDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="A brief description of your website" 
                    className="resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="siteTagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tagline</FormLabel>
                <FormControl>
                  <Input placeholder="Your site's slogan or tagline" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="/images/logo.png" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="faviconUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favicon URL</FormLabel>
                  <FormControl>
                    <Input placeholder="/favicon.ico" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Regional Settings</h2>
        
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="defaultCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Currency</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      {...field}
                      value={field.value || 'USD'}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      {...field}
                      value={field.value || 'UTC'}
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="dateFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Format</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      {...field}
                      value={field.value || 'MMMM DD, YYYY'}
                    >
                      <option value="MMMM DD, YYYY">January 01, 2023</option>
                      <option value="MM/DD/YYYY">01/01/2023</option>
                      <option value="DD/MM/YYYY">01/01/2023</option>
                      <option value="YYYY-MM-DD">2023-01-01</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="timeFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Format</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      {...field}
                      value={field.value || 'h:mm a'}
                    >
                      <option value="h:mm a">12:00 pm</option>
                      <option value="HH:mm">14:00</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input placeholder="contact@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="123 Main St, City, Country" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="copyright"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Copyright Text</FormLabel>
              <FormControl>
                <Input placeholder="© 2023 My Company. All rights reserved." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </form>
    </Form>
  )
}
