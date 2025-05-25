"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsesTable } from "@/components/admin/forms/responses-table"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Define a proper type for form entries that matches the component expectations
interface FormEntryWithRelations {
  id: string
  formId: string
  data: Record<string, any> // Explicitly typed as Record instead of JsonValue
  status: string
  createdAt: Date
  updatedAt: Date
  form: {
    status: string
    id: string
    createdAt: Date
    updatedAt: Date
    name: string
    title: string
    description: string | null
    fields: any
  }
  user: {
    name: string | null
    email: string | null
  } | null
}

export default function FormResponsesPage() {
  const [forms, setForms] = useState<any[]>([])
  const [entries, setEntries] = useState<FormEntryWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Fetch forms
        const formsRes = await fetch('/api/forms')
        if (!formsRes.ok) throw new Error('Failed to fetch forms')
        const formsData = await formsRes.json()
        
        // Fetch form entries
        const entriesRes = await fetch('/api/forms/entries')
        if (!entriesRes.ok) throw new Error('Failed to fetch entries')
        const entriesData = await entriesRes.json()
        
        // Transform the entries data to ensure data is a proper object
        const transformedEntries = entriesData.map((entry: any) => ({
          ...entry,
          // Convert any null data to empty object
          data: entry.data === null ? {} : entry.data
        }));

        setForms(formsData)
        setEntries(transformedEntries)
        
        // Set active tab to first form if available
        if (formsData.length > 0) {
          setActiveTab(formsData[0].id)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load forms and entries",
          variant: "destructive"
        })
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (forms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Forms Found</CardTitle>
          <CardDescription>Create a form first to collect responses.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Form Responses</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {forms.map((form) => (
            <TabsTrigger key={form.id} value={form.id}>
              {form.title}
              <Badge variant="outline" className="ml-2">
                {entries.filter(e => e.formId === form.id).length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {forms.map(form => (
          <TabsContent key={form.id} value={form.id}>
            <ResponsesTable 
              entries={entries.filter(e => e.formId === form.id)} 
              formId={form.id} 
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
