import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ProjectActions } from "./project-actions"
import Link from "next/link"
import { type Route } from 'next'

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      client: {
        select: {
          name: true,
          email: true,
          image: true
        }
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage client projects and showcase work
          </p>
        </div>
        <Button asChild>
          <Link href={"/admin/projects/new" as Route}>Create Project</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/projects/${project.id}` as Route} className="hover:underline">
                    {project.title}
                  </Link>
                </TableCell>
                <TableCell>{project.client.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={project.status === 'completed' ? 'outline' : 
                            project.status === 'archived' ? 'secondary' : 
                            'default'}
                    className={project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-400' : ''}
                  >
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>{project.featured ? "✓" : "-"}</TableCell>
                <TableCell>{formatDate(project.updatedAt.toString())}</TableCell>
                <TableCell>
                  <ProjectActions project={project} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
