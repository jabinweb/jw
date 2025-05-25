"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Save } from "lucide-react"
import { FormField as FormFieldComponent } from "@/components/admin/forms/form-field"
import { type FormField } from "@/types/forms"
import { generateFieldName } from "@/lib/utils"

interface FormBuilderProps {
  defaultValues?: {
    name: string
    title: string
    description?: string
    fields: FormField[]
  }
  onSubmit: (data: any) => Promise<void>
}

export function FormBuilder({ defaultValues, onSubmit }: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(defaultValues?.fields || [])
  const [formData, setFormData] = useState({
    name: defaultValues?.name || '',
    title: defaultValues?.title || '',
    description: defaultValues?.description || ''
  })

  const addField = (type: FormField['type']) => {
    setFields([...fields, {
      id: crypto.randomUUID(),
      type,
      name: generateFieldName(`field_${type}_${Date.now()}`),
      label: `New ${type} field`,
      required: false
    }])
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ))
  }

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onSubmit({
        ...formData,
        fields,
        status: 'active'
      })
      toast({ title: "Success", description: "Form saved successfully" })
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to save form",
        variant: "destructive"
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Form Name</label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="contact-form"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Display Title</label>
              <Input
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contact Form"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Form description..."
            />
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Form Fields</h2>
          <div className="flex gap-2">
            <Select onValueChange={addField}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Add field..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Field</SelectItem>
                <SelectItem value="email">Email Field</SelectItem>
                <SelectItem value="textarea">Text Area</SelectItem>
                <SelectItem value="select">Select Field</SelectItem>
                <SelectItem value="phone">Phone Field</SelectItem>
                <SelectItem value="number">Number Field</SelectItem>
                <SelectItem value="date">Date Field</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="radio">Radio Group</SelectItem>
                <SelectItem value="file">File Upload</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {fields.map((field: FormField) => (
            <FormFieldComponent
              key={field.id}
              field={field}
              onUpdate={(updates: Partial<FormField>) => updateField(field.id, updates)}
              onRemove={() => removeField(field.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          Save Form
        </Button>
      </div>
    </form>
  )
}
