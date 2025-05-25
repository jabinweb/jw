import { z } from "zod"

export type FormFieldType = 
  | 'text'
  | 'email'
  | 'textarea'
  | 'select'
  | 'phone'
  | 'number'
  | 'date'
  | 'time'
  | 'url'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'multiselect'
  | 'password'
  | 'color'
  | 'range'

export interface FormFieldValidation {
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  accept?: string // for file inputs
  multiple?: boolean // for file/multiselect
  customMessage?: string
}

export interface FormField {
  id: string
  type: FormFieldType
  label: string
  name: string
  placeholder?: string
  helpText?: string
  defaultValue?: string | number | boolean
  required?: boolean
  validation?: FormFieldValidation
  options?: Array<{
    label: string
    value: string
  }>
  settings?: {
    rows?: number // for textarea
    cols?: number // for textarea
    min?: number // for number/range
    max?: number // for number/range
    step?: number // for number/range
    multiple?: boolean // for select/file
    accept?: string // for file upload
    autoComplete?: string
    className?: string
  }
}

export const formFieldSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'email', 'textarea', 'select', 'phone']),
  label: z.string().min(1, "Label is required"),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    message: z.string().optional()
  }).optional()
})

export const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  fields: z.array(formFieldSchema),
  status: z.enum(['active', 'disabled']).default('active')
})

export type Form = z.infer<typeof formSchema>
