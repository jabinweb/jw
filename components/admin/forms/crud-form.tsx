"use client"

import { type UseFormReturn, type FieldValues } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

interface CrudFormProps<TFormData extends FieldValues> {
  form: UseFormReturn<TFormData>
  onSubmit: (data: TFormData) => Promise<void>
  children: React.ReactNode
}

export function CrudForm<TFormData extends FieldValues>({ 
  form, 
  onSubmit, 
  children 
}: CrudFormProps<TFormData>) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {children}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  )
}
