"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Check, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserActions } from "./user-actions"

export type User = {
  id: string
  name: string
  email: string
  image?: string
  role: "admin" | "user"
  isActive: boolean
  lastLogin?: string
  createdAt: string
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      const email = row.original.email // Access email from row.original instead of getValue
      const image = row.original.image

      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={image} />
            <AvatarFallback>{name?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{name || "Unnamed User"}</div>
            <div className="text-sm text-muted-foreground">{email}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean
      return (
        <div className="flex items-center gap-2">
          {isActive ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <X className="h-4 w-4 text-red-500" />
          )}
          <span>{isActive ? "Active" : "Inactive"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ row }) => {
      const date = row.getValue("lastLogin")
      return date ? new Date(date as string).toLocaleDateString() : "Never"
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      return <UserActions user={user} />
    }
  }
]
