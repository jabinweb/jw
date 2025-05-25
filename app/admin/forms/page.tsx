import { FormsTable } from "@/components/admin/forms/forms-table"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import Link from "next/link"

export default async function FormsPage() {
  const forms = await db.form.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { entries: true }
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Forms</h1>
        <Button asChild>
          <Link href="/admin/forms/new">Create Form</Link>
        </Button>
      </div>
      <FormsTable 
        forms={forms} 
        title="Form Management"
      />
    </div>
  )
}
