import '../globals.css'
import { Inter } from 'next/font/google';
import type { SidebarData } from "@/types/navigation"
import { auth } from "@/auth"
import { AdminLayoutClient } from "./admin-layout-client"

const inter = Inter({ subsets: ['latin'] });

function getSidebarData(user: any): SidebarData {
  return {
    user: {
      name: user?.name || "Admin",
      email: user?.email || "admin@jabinweb.com",
      avatar: user?.image || "/avatars/admin.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/admin",
        iconName: "dashboard",
        isActive: true,
        items: [
          { title: "Overview", url: "/admin" },
          { title: "Analytics", url: "/admin/analytics" },
        ],
      },
      {
        title: "Forms",
        url: "/admin/forms",
        iconName: "forms",
        items: [
          { title: "All Forms", url: "/admin/forms" },
          { title: "Form Responses", url: "/admin/forms/responses" },
          { title: "Create Form", url: "/admin/forms/new" },
        ],
      },
      {
        title: "Media",
        url: "/admin/media",
        iconName: "image",
        items: [
          { title: "Media Library", url: "/admin/media" },
          { title: "Upload Media", url: "/admin/media/upload" },
        ],
      },
      {
        title: "Services",
        url: "/admin/services",
        iconName: "services",
        items: [
          { title: "All Services", url: "/admin/services" },
          { title: "Add New", url: "/admin/services/new" },
        ],
      },
      {
        title: "Blog Posts",
        url: "/admin/posts",
        iconName: "posts",
        items: [
          { title: "All Posts", url: "/admin/posts" },
          { title: "Add New", url: "/admin/posts/new" },
        ],
      },
      {
        title: "Messages",
        url: "/admin/messages",
        iconName: "messages",
      },
      {
        title: "Users",
        url: "/admin/users",
        iconName: "users",
      },
      {
        title: "Settings",
        url: "/admin/settings",
        iconName: "settings",
        items: [
          { title: "General", url: "/admin/settings" },
          { title: "Appearance", url: "/admin/settings/appearance" },
          { title: "SEO", url: "/admin/settings/seo" },
        ],
      },
    ],
    navSecondary: [],
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const sidebarData = getSidebarData(session?.user)

  return <AdminLayoutClient sidebarData={sidebarData} session={session}>{children}</AdminLayoutClient>
}


