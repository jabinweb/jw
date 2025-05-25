import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { StatusSelect } from "@/components/admin/forms/status-select"

export default async function EntryPage({ 
  params 
}: { 
  params: { formId: string; entryId: string } 
}) {
  const entry = await db.formEntry.findUnique({
    where: { 
      id: params.entryId,
      formId: params.formId
    },
    include: {
      form: true,
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  if (!entry) {
    notFound()
  }

  const data = entry.data as Record<string, any>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/forms/${params.formId}/entries`}>
              <ArrowLeft className="h-4 w-4 mr-2" />Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{entry.form.title} Entry</h1>
        </div>
        <div className="flex items-center gap-2">
          <StatusSelect 
            formId={params.formId}
            entryId={params.entryId}
            initialStatus={entry.status}
          />
          {data.email && (
            <Button variant="outline" asChild>
              <a href={`mailto:${data.email}`}>
                <Mail className="h-4 w-4 mr-2" />
                Reply
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Form Data</h2>
          <dl className="space-y-4">
            {Object.entries(data).map(([key, value]) => (
              <div key={key}>
                <dt className="text-sm font-medium text-muted-foreground">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                </dt>
                <dd className="mt-1 text-sm">
                  {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                </dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Submission Details</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Submitted On
              </dt>
              <dd className="mt-1 text-sm">
                {formatDate(entry.createdAt.toString())}
              </dd>
            </div>
            {entry.metadata && (
              <>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    IP Address
                  </dt>
                  <dd className="mt-1 text-sm">
                    {(entry.metadata as any).ipAddress}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    User Agent
                  </dt>
                  <dd className="mt-1 text-sm">
                    {(entry.metadata as any).userAgent}
                  </dd>
                </div>
              </>
            )}
          </dl>
        </Card>
      </div>
    </div>
  )
}
