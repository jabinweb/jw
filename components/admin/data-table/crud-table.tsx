"use client"

import { useState } from "react"
import { DataTable } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTablePagination } from "./data-table-pagination"
import { Input } from "@/components/ui/input"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface CrudTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  title: string
  onAdd?: () => void
  onEdit?: (data: TData) => void
  onDelete?: (data: TData) => void
  searchKey?: string
  loading?: boolean
}

export function CrudTable<TData extends Record<string, any>>({
  data,
  columns,
  title,
  onAdd,
  searchKey,
  loading = false,
}: CrudTableProps<TData>) {
  const [searchValue, setSearchValue] = useState("")
  
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchValue
    },
    onGlobalFilterChange: setSearchValue,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
        </div>
        <div className="flex items-center space-x-2">
          {searchKey && (
            <Input
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="max-w-sm"
            />
          )}
          <DataTableViewOptions table={table} />
          {onAdd && (
            <Button onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        {loading ? (
          <Table>
            <TableBody>
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <LoadingSpinner />
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <DataTable<TData, any>
            columns={columns}
            data={data}
          />
        )}
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
