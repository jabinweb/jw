"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Post } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Trash } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { deletePost } from "@/lib/api/posts"
import { DataTableColumnHeader } from "@/components/admin/data-table/data-table-column-header"
import { RowActions } from "@/components/admin/data-table/row-actions"
import Link from "next/link"

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <Link 
        href={`/admin/posts/${row.original.id}`}
        className="hover:underline"
      >
        {row.getValue("title")}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("status") === "published" ? "default" : "secondary"}>
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => format(row.getValue("createdAt"), "MMM dd, yyyy"),
  },
  {
    accessorKey: "publishedAt",
    header: "Published",
    cell: ({ row }) => {
      const date = row.getValue("publishedAt")
      return date ? format(new Date(date as string), "MMM dd, yyyy") : "-"
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <RowActions 
        row={row.original}
        editPath="/admin/posts"
        actions={[
          {
            icon: Trash,
            label: "Delete",
            onClick: async (post: Post) => {
              try {
                await deletePost(post.id)
                toast({
                  title: "Success",
                  description: "Post deleted successfully"
                })
              } catch (error) {
                toast({
                  title: "Error",
                  description: "Failed to delete post",
                  variant: "destructive"
                })
              }
            },
            show: (post: Post) => post.status !== "published"
          }
        ]}
      />
    )
  }
]
