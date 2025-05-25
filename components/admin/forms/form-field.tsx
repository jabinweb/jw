"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { GripVertical, Trash } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { FormField } from "@/types/forms"

interface FormFieldProps {
  field: FormField
  onUpdate: (updates: Partial<FormField>) => void
  onRemove: () => void
}

export function FormField({ field, onUpdate, onRemove }: FormFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const renderFieldSettings = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Rows</label>
              <Input
                type="number"
                value={field.settings?.rows || 3}
                onChange={e => onUpdate({
                  settings: { ...field.settings, rows: parseInt(e.target.value) }
                })}
              />
            </div>
          </div>
        )

      case 'select':
      case 'radio':
      case 'multiselect':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Options</label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option.label}
                    onChange={e => {
                      const newOptions = [...(field.options || [])]
                      newOptions[index] = { 
                        ...newOptions[index],
                        label: e.target.value,
                        value: e.target.value.toLowerCase()
                      }
                      onUpdate({ options: newOptions })
                    }}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button 
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newOptions = field.options?.filter((_, i) => i !== index)
                      onUpdate({ options: newOptions })
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOptions = [...(field.options || [])]
                  newOptions.push({ label: '', value: '' })
                  onUpdate({ options: newOptions })
                }}
              >
                Add Option
              </Button>
            </div>
          </div>
        )

      case 'number':
      case 'range':
        return (
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Min</label>
              <Input
                type="number"
                value={field.settings?.min}
                onChange={e => onUpdate({
                  settings: { ...field.settings, min: parseInt(e.target.value) }
                })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Max</label>
              <Input
                type="number"
                value={field.settings?.max}
                onChange={e => onUpdate({
                  settings: { ...field.settings, max: parseInt(e.target.value) }
                })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Step</label>
              <Input
                type="number"
                value={field.settings?.step || 1}
                onChange={e => onUpdate({
                  settings: { ...field.settings, step: parseInt(e.target.value) }
                })}
              />
            </div>
          </div>
        )
    }
  }

  return (
    <Card ref={setNodeRef} style={style} className="p-4">
      <div className="flex items-start gap-4">
        <button 
          type="button"
          className="mt-3 cursor-move touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
        
        <div className="flex-1 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Label</label>
              <Input
                value={field.label}
                onChange={e => onUpdate({ label: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Placeholder</label>
              <Input
                value={field.placeholder}
                onChange={e => onUpdate({ placeholder: e.target.value })}
              />
            </div>
          </div>

          {field.type === 'select' && (
            <div>
              <label className="text-sm font-medium">Options</label>
              <Textarea
                value={field.options?.map(opt => opt.label).join('\n')}
                onChange={e => onUpdate({ 
                  options: e.target.value.split('\n')
                    .filter(Boolean)
                    .map(label => ({ label, value: label.toLowerCase() }))
                })}
                placeholder="One option per line"
              />
            </div>
          )}

          {renderFieldSettings()}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={field.required}
                onCheckedChange={checked => onUpdate({ required: checked })}
              />
              <label className="text-sm">Required</label>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-destructive"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
