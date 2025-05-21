"use client"

import { DataTable } from "@/components/admin/data-table"
import { columns } from "./columns"

export default function MessagesPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Messages</h2>
      </div>
      
      <DataTable columns={columns} data={[]} />
    </div>
  )
}
