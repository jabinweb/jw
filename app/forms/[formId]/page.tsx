import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { FormRenderer } from "@/components/forms/form-renderer"

// Define a helper function to transform the form into the expected shape
function transformForm(form: any) {
  return {
    id: form.id,
    name: form.name,
    title: form.title,
    description: form.description || undefined, // Convert null to undefined
    fields: Array.isArray(form.fields) ? form.fields : 
            typeof form.fields === 'object' ? Object.values(form.fields) : [],
    status: form.status
  };
}

export default async function FormPage({
  params
}: {
  params: { formId: string }
}) {
  const form = await db.form.findUnique({
    where: { id: params.formId }
  })

  if (!form || form.status !== "active") {
    notFound()
  }

  // Transform the form to match FormRenderer expectations
  const formData = transformForm(form);

  return (
    <div className="container max-w-3xl py-16">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{formData.title}</h1>
        {formData.description && (
          <p className="text-muted-foreground mb-8">{formData.description}</p>
        )}
        <FormRenderer form={formData} />
      </div>
    </div>
  )
}
