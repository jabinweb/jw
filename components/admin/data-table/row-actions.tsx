"use client"

import { Button } from "@/components/ui/button"
import { Edit, Trash, LucideIcon } from "lucide-react"
import { useRouter } from "next/navigation"

interface Action<TData> {
  icon: LucideIcon
  label: string
  onClick: (row: TData) => void
  show?: (row: TData) => boolean
}

interface RowActionsProps<TData> {
  row: TData
  actions?: Action<TData>[]
  editPath?: string
}

export function RowActions<TData>({ 
  row, 
  actions = [],
  editPath,
}: RowActionsProps<TData>) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-2">
      {editPath && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`${editPath}/${(row as any).id}`)}
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      )}
      {actions.map((action, index) => {
        if (action.show && !action.show(row)) return null
        
        return (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => action.onClick(row)}
          >
            <action.icon className="h-4 w-4" />
            <span className="sr-only">{action.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
