// pages/admin/settings/index.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { SiteSettingsForm } from "@/components/admin/settings/site-settings-form"
import { SeoSettingsForm } from "@/components/admin/settings/seo-settings-form"
import { SocialSettingsForm } from "@/components/admin/settings/social-settings-form"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your site settings and configuration
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="p-6">
            <SiteSettingsForm />
          </Card>
        </TabsContent>
        
        <TabsContent value="seo">
          <Card className="p-6">
            <SeoSettingsForm />
          </Card>
        </TabsContent>
        
        <TabsContent value="social">
          <Card className="p-6">
            <SocialSettingsForm />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
