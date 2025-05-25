"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FormBuilder } from "@/components/admin/forms/form-builder"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function EditFormPage({ params }: { params: { formId: string } }) {
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const isNew = params.formId === "new"

  useEffect(() => {
    async function loadForm() {
      try {
        const res = await fetch(`/api/forms/${params.formId}`)
        if (!res.ok) throw new Error("Failed to load form")
        const data = await res.json()
        setForm(data)
      } catch (error) {
        toast({ title: "Error", description: "Failed to load form" })
        router.push("/admin/forms")
      } finally {
        setLoading(false)
      }
    }

    if (!isNew) {
      loadForm()
    } else {
      setLoading(false)
    }
  }, [params.formId, router, isNew])

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      const res = await fetch(isNew ? '/api/forms' : `/api/forms/${params.formId}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to save form')
      }
      
      toast({ title: "Success", description: "Form saved successfully" })
      router.push('/admin/forms')
      router.refresh()
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to save form",
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/forms">
              <ArrowLeft className="h-4 w-4 mr-2" />Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">
            {isNew ? "Create Form" : "Edit Form"}
          </h1>
        </div>
      </div>

      <FormBuilder 
        defaultValues={form} 
        onSubmit={onSubmit} 
      />
    </div>
  )
}
