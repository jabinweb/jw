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
import { FormField } from "./form-field"
import { PlusCircle, Save } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { generateFieldName, slugify } from "@/lib/utils"
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { type FormField as FormFieldType } from "@/types/forms"

interface FormBuilderProps {
  defaultValues?: {
    name: string
    title: string
    description?: string
    fields: FormFieldType[]
  }
  onSubmit: (data: any) => Promise<void>
}

export function FormBuilder({ defaultValues, onSubmit }: FormBuilderProps) {
  const [fields, setFields] = useState<FormFieldType[]>(defaultValues?.fields || [])
  const [formData, setFormData] = useState({
    name: defaultValues?.name || '',
    title: defaultValues?.title || '',
    description: defaultValues?.description || ''
  })

  const addField = (type: FormFieldType['type']) => {
    setFields([
      ...fields,
      {
        id: crypto.randomUUID(),
        type,
        name: generateFieldName(type),
        label: `New ${type} field`,
        required: false
      }
    ])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.title) {
      toast({
        title: "Error",
        description: "Name and title are required",
        variant: "destructive"
      })
      return
    }

    try {
      await onSubmit({
        ...formData,
        name: slugify(formData.name),
        fields,
        status: 'active'
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save form",
        variant: "destructive"
      })
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex(f => f.id === active.id)
      const newIndex = fields.findIndex(f => f.id === over.id)
      
      const newFields = [...fields]
      const [removed] = newFields.splice(oldIndex, 1)
      newFields.splice(newIndex, 0, removed)
      
      setFields(newFields)
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
            </SelectContent>
          </Select>
        </div>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  field={field}
                  onUpdate={updates => {
                    const newFields = [...fields]
                    newFields[index] = { ...field, ...updates }
                    setFields(newFields)
                  }}
                  onRemove={() => {
                    setFields(fields.filter(f => f.id !== field.id))
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          Save Form
        </Button>
      </div>
    </form>
  )
}
