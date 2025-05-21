import '../globals.css'
import { Inter } from 'next/font/google';
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  Globe,
  Mail,
  HeadphonesIcon,
  HelpCircle
} from "lucide-react"
import type { SidebarData } from "@/types/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
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
        icon: LayoutDashboard,
        isActive: true,
        items: [
          { title: "Overview", url: "/admin" },
          { title: "Analytics", url: "/admin/analytics" },
        ],
      },
      {
        title: "Services",
        url: "/admin/services",
        icon: Globe,
        items: [
          { title: "All Services", url: "/admin/services" },
          { title: "Add New", url: "/admin/services/new" },
        ],
      },
      {
        title: "Blog Posts",
        url: "/admin/posts",
        icon: FileText,
        items: [
          { title: "All Posts", url: "/admin/posts" },
          { title: "Add New", url: "/admin/posts/new" },
        ],
      },
      {
        title: "Messages",
        url: "/admin/messages",
        icon: Mail,
      },
      {
        title: "Users",
        url: "/admin/users",
        icon: Users,
      },
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
        items: [
          { title: "General", url: "/admin/settings" },
          { title: "Appearance", url: "/admin/settings/appearance" },
          { title: "SEO", url: "/admin/settings/seo" },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "/admin/support",
        icon: HeadphonesIcon,
      },
      {
        title: "Help",
        url: "/admin/help",
        icon: HelpCircle,
      },
    ],
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


