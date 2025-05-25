"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

const seoSettingsSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  googleSiteVerification: z.string().optional(),
  robotsTxt: z.string().optional(),
})

type SeoSettingsValues = z.infer<typeof seoSettingsSchema>

export function SeoSettingsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const form = useForm<SeoSettingsValues>({
    resolver: zodResolver(seoSettingsSchema),
    defaultValues: {
      metaTitle: "",
      metaDescription: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      googleAnalyticsId: "",
      googleSiteVerification: "",
      robotsTxt: "",
    }
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/settings/seo")
        if (res.ok) {
          const data = await res.json()
          form.reset(data)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load SEO settings",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadSettings()
  }, [form, toast])

  async function onSubmit(data: SeoSettingsValues) {
    try {
      setIsLoading(true)
      const res = await fetch("/api/settings/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      
      if (!res.ok) throw new Error("Failed to save settings")
      
      toast({
        title: "Success",
        description: "SEO settings saved successfully"
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
        <h2 className="text-xl font-semibold mb-4">Meta Tags</h2>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Title</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description</FormLabel>
                <FormControl>
                  <Textarea 
                    className="resize-none" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h2 className="text-xl font-semibold mb-4">Open Graph</h2>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="ogTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OG Title</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ogDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OG Description</FormLabel>
                <FormControl>
                  <Textarea 
                    className="resize-none" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ogImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OG Image URL</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h2 className="text-xl font-semibold mb-4">Tracking & Verification</h2>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="googleAnalyticsId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google Analytics ID</FormLabel>
                <FormControl>
                  <Input placeholder="G-XXXXXXXXXX" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="googleSiteVerification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google Site Verification</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="robotsTxt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Robots.txt Content</FormLabel>
                <FormControl>
                  <Textarea 
                    className="resize-none h-32 font-mono" 
                    {...field} 
                    value={field.value || ''}
                    placeholder="User-agent: *\nAllow: /\nDisallow: /admin/"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save SEO Settings"
          )}
        </Button>
      </form>
    </Form>
  )
}
