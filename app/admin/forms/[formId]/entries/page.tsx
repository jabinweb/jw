import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { DataTable } from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

export default async function FormEntriesPage({ 
  params 
}: { 
  params: { formId: string } 
}) {
  const [form, entries] = await Promise.all([
    db.form.findUnique({ where: { id: params.formId } }),
    db.formEntry.findMany({
      where: { formId: params.formId },
      orderBy: { createdAt: 'desc' }
    })
  ])

  if (!form) return null

  const columns = [
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }: { row: { getValue: (key: string) => Date } }) => formatDate(row.getValue("createdAt").toString())
    },
    ...(form.fields && typeof form.fields === 'object' ? Object.keys(form.fields).map(field => {
      const fieldData = (form.fields as Record<string, { label: string }>)[field];
      return {
        accessorKey: `data.${field}`,
        header: fieldData?.label || field
      };
    }) : []),
    {
      accessorKey: "status",
      header: "Status"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/forms">
              <ArrowLeft className="h-4 w-4 mr-2" />Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{form.title} Entries</h1>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={entries}
        searchKey="data"
      />
    </div>
  )
}
