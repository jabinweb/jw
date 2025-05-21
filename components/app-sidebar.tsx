"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { SidebarData } from "@/types/navigation";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data: SidebarData;
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin", // Link to dashboard
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Home",
          url: "/admin", // Link to dashboard home
        },
        {
          title: "Analytics",
          url: "/admin/analytics", // Link to analytics page
        },
      ],
    },
    {
      title: "Posts",
      url: "/admin/posts", // Link to posts section
      icon: BookOpen,
      items: [
        {
          title: "All Posts",
          url: "/admin/posts", // Link to all posts
        },
        {
          title: "Add New",
          url: "/admin/posts/add", // Link to add new post
        },
        {
          title: "Categories",
          url: "/admin/posts/categories", // Link to categories page
        },
        {
          title: "Tags",
          url: "/admin/posts/tags", // Link to tags page
        },
      ],
    },
    {
      title: "Media",
      url: "/admin/media", // Link to media section
      icon: Bot,
      items: [
        {
          title: "Library",
          url: "/admin/media/library", // Link to media library
        },
        {
          title: "Add New",
          url: "/admin/media/add", // Link to add new media
        },
      ],
    },
    {
      title: "Pages",
      url: "/admin/pages", // Link to pages section
      icon: Frame,
      items: [
        {
          title: "All Pages",
          url: "/admin/pages", // Link to all pages
        },
        {
          title: "Add New",
          url: "/admin/pages/add", // Link to add new page
        },
      ],
    },
    {
      title: "Settings",
      url: "/admin/settings", // Link to settings section
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/admin/settings/general", // Link to general settings
        },
        {
          title: "Writing",
          url: "/admin/settings/writing", // Link to writing settings
        },
        {
          title: "Reading",
          url: "/admin/settings/reading", // Link to reading settings
        },
        {
          title: "Media",
          url: "/admin/settings/media", // Link to media settings
        },
        {
          title: "Permalinks",
          url: "/admin/settings/permalinks", // Link to permalinks settings
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/admin/support", // Link to support page
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/admin/feedback", // Link to feedback page
      icon: Send,
    },
  ],
};

export function AppSidebar({ data, ...props }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
