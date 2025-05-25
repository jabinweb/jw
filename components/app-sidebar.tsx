"use client";

import { Command } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import type { SidebarData } from "@/types/navigation";

export function AppSidebar({ data, className }: { data: SidebarData; className?: string }) {
  return (
    <Sidebar className={className}>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
