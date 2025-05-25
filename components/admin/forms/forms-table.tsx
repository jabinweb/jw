"use client"

import { CrudTable } from "@/components/admin/data-table/crud-table"
import { FormActions } from "@/app/admin/forms/form-actions"
import { formatDate } from "@/lib/utils"

interface FormsTableProps {
  forms: any[]
  title?: string
}

export function FormsTable({ forms, title = "Forms" }: FormsTableProps) {
  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Title", accessorKey: "title" },
    { header: "Status", accessorKey: "status" },
    { 
      header: "Entries", 
      accessorKey: "entries",
      cell: ({ row }: any) => row.original._count.entries
    },
    { 
      header: "Created", 
      accessorKey: "createdAt",
      cell: ({ row }: any) => formatDate(row.getValue("createdAt"))
    },
    {
      id: "actions",
      cell: ({ row }: any) => <FormActions form={row.original} />
    }
  ]

  return (
    <CrudTable
      data={forms}
      columns={columns}
      searchKey="title"
      title={title}
    />
  )
}
