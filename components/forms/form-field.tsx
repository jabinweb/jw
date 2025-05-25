"use client"

import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  field: {
    name: string
    label: string
    type: string
    placeholder?: string
    required?: boolean
    options?: { value: string; label: string }[]
    helperText?: string
  }
}

export function FormField({ field }: FormFieldProps) {
  const { register, formState: { errors }, setValue, watch } = useFormContext()
  const value = watch(field.name);
  const errorMessage = errors[field.name]?.message as string | undefined
  
  // Helper function for registration
  const registerField = (name: string) => {
    return {
      ...register(name),
      id: name,
      placeholder: field.placeholder || undefined,
      required: field.required || undefined
    }
  }

  switch (field.type) {
    case "text":
    case "email":
    case "tel":
    case "url":
    case "number":
    case "date":
      return (
        <div className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            type={field.type}
            {...registerField(field.name)}
            className={cn(errors[field.name] && "border-destructive")}
          />
          {field.helperText && (
            <p className="text-sm text-muted-foreground">{field.helperText}</p>
          )}
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
        </div>
      )

    case "textarea":
      return (
        <div className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Textarea
            {...registerField(field.name)}
            className={cn(errors[field.name] && "border-destructive")}
          />
          {field.helperText && (
            <p className="text-sm text-muted-foreground">{field.helperText}</p>
          )}
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
        </div>
      )

    case "select":
      if (!field.options?.length) return null;
      
      return (
        <div className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Select
            value={value || ""}
            onValueChange={(value) => setValue(field.name, value, { 
              shouldValidate: true 
            })}
          >
            <SelectTrigger className={cn(errors[field.name] && "border-destructive")}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.helperText && (
            <p className="text-sm text-muted-foreground">{field.helperText}</p>
          )}
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
        </div>
      )

    case "checkbox":
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={value || false}
              onCheckedChange={(checked) => 
                setValue(field.name, checked, { shouldValidate: true })
              }
            />
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
          </div>
          {field.helperText && (
            <p className="text-sm text-muted-foreground">{field.helperText}</p>
          )}
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
        </div>
      )

    case "radio":
      if (!field.options?.length) return null;

      return (
        <div className="space-y-2">
          <div>
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <RadioGroup
              value={value || ""}
              onValueChange={(value) => setValue(field.name, value, { 
                shouldValidate: true 
              })}
              className="mt-2 space-y-1"
            >
              {field.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
                  <Label htmlFor={`${field.name}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          {field.helperText && (
            <p className="text-sm text-muted-foreground">{field.helperText}</p>
          )}
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
        </div>
      )

    default:
      return null;
  }
}
