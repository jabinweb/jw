"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { columns } from "./columns"
import { useToast } from "@/hooks/use-toast"
import { TableSkeleton } from "@/components/admin/table-skeleton"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true)
        const response = await fetch('/api/users')
        
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchUsers()
  }, [toast])

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Users</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      {loading ? (
        <TableSkeleton columns={5} rows={5} />
      ) : (
        <DataTable columns={columns} data={users} />
      )}
    </div>
  )
}
