"use client"

import { formatDate } from "@/lib/utils"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { MoreHorizontal, Eye, Trash } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

// Define the type for the entries we receive
interface FormEntry {
  id: string
  formId: string
  data: Record<string, any> // Ensure data is a non-null object
  status: string
  createdAt: Date
  updatedAt: Date
  form: {
    fields: any
  }
  user?: {
    name: string | null
    email: string | null
  } | null
}

interface ResponsesTableProps {
  entries: FormEntry[]
  formId: string
}

export function ResponsesTable({ entries, formId }: ResponsesTableProps) {
  const [selectedEntry, setSelectedEntry] = useState<FormEntry | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  // Filter entries to only show ones for this form
  const formEntries = entries.filter(entry => entry.formId === formId)

  // Sort entries by date (newest first)
  const sortedEntries = [...formEntries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this entry? This cannot be undone.")) {
      try {
        const res = await fetch(`/api/forms/entries/${id}`, {
          method: 'DELETE'
        })
        
        if (!res.ok) throw new Error("Failed to delete entry")
        
        toast({
          title: "Entry deleted",
          description: "The form entry has been deleted"
        })
        
        // Refresh the page to update the list
        window.location.reload()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete entry",
          variant: "destructive"
        })
      }
    }
  }

  if (formEntries.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No responses for this form yet.
      </div>
    )
  }

  // Get field definitions from the first entry's form (they're all the same form)
  const formFields = sortedEntries[0]?.form?.fields || []

  // Determine which fields to show in the table (limit to first few)
  const displayFields = Array.isArray(formFields) 
    ? formFields.slice(0, 3) 
    : Object.values(formFields).slice(0, 3)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Date</TableHead>
            
            {/* Dynamic field columns based on form structure */}
            {displayFields.map((field: any, i: number) => (
              <TableHead key={i}>{field.label || `Field ${i+1}`}</TableHead>
            ))}
            
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">
                {formatDate(new Date(entry.createdAt).toString())}
              </TableCell>
              
              {/* Dynamic field data */}
              {displayFields.map((field: any, i: number) => {
                const fieldKey = field.name || `field_${i}`
                const value = entry.data?.[fieldKey] || '-'
                return (
                  <TableCell key={i} className="truncate max-w-[200px]">
                    {value}
                  </TableCell>
                )
              })}
              
              <TableCell>
                <Badge variant={entry.status === 'new' ? 'default' : 'secondary'}>
                  {entry.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedEntry(entry)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Submission Details</DialogTitle>
          </DialogHeader>
          
          {selectedEntry && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Submission Date</p>
                  <p>{new Date(selectedEntry.createdAt).toLocaleString()}</p>
                </div>
                
                {selectedEntry.user && (
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted By</p>
                    <p>{selectedEntry.user.name || selectedEntry.user.email || 'Unknown'}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Form Data</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">Field</TableHead>
                        <TableHead>Response</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(selectedEntry.data || {}).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium">
                            {formFields.find((f: any) => f.name === key)?.label || key}
                          </TableCell>
                          <TableCell>
                            {typeof value === 'object' 
                              ? JSON.stringify(value) 
                              : String(value)
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
