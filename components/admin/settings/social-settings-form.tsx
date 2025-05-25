"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"

const socialSettingsSchema = z.object({
  facebook: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  twitter: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  instagram: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  linkedin: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  youtube: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  pinterest: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  tiktok: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  showSocialIcons: z.boolean().default(true),
  showShareButtons: z.boolean().default(true)
})

type SocialSettingsValues = z.infer<typeof socialSettingsSchema>

export function SocialSettingsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const form = useForm<SocialSettingsValues>({
    resolver: zodResolver(socialSettingsSchema),
    defaultValues: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      pinterest: "",
      tiktok: "",
      showSocialIcons: true,
      showShareButtons: true
    }
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/settings/social")
        if (res.ok) {
          const data = await res.json()
          form.reset(data)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load social media settings",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadSettings()
  }, [form, toast])

  async function onSubmit(data: SocialSettingsValues) {
    try {
      setIsLoading(true)
      const res = await fetch("/api/settings/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      
      if (!res.ok) throw new Error("Failed to save settings")
      
      toast({
        title: "Success",
        description: "Social media settings saved successfully"
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
        <h2 className="text-xl font-semibold mb-4">Social Media Profiles</h2>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input placeholder="https://facebook.com/yourpage" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter / X</FormLabel>
                <FormControl>
                  <Input placeholder="https://twitter.com/youraccount" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input placeholder="https://instagram.com/youraccount" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/company/yourcompany" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="youtube"
            render={({ field }) => (
              <FormItem>
                <FormLabel>YouTube</FormLabel>
                <FormControl>
                  <Input placeholder="https://youtube.com/c/yourchannel" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pinterest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pinterest</FormLabel>
                <FormControl>
                  <Input placeholder="https://pinterest.com/youraccount" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tiktok"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TikTok</FormLabel>
                <FormControl>
                  <Input placeholder="https://tiktok.com/@youraccount" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h2 className="text-xl font-semibold mb-4">Social Media Display Settings</h2>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="showSocialIcons"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Show Social Media Icons</FormLabel>
                  <FormDescription>
                    Display social media icons in website footer
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showShareButtons"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Show Share Buttons</FormLabel>
                  <FormDescription>
                    Display social share buttons on posts and pages
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
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
            "Save Social Settings"
          )}
        </Button>
      </form>
    </Form>
  )
}
