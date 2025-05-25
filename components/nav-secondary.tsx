"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar"
import { iconMap } from "@/lib/icons"
import type { IconName } from "@/types/navigation"

interface NavSecondaryProps {
  items: {
    title: string
    url: string
    iconName: IconName
  }[]
  className?: string
}

export function NavSecondary({ items, className }: NavSecondaryProps) {
  const pathname = usePathname()

  return (
    <SidebarGroup className={className}>
      <SidebarGroupLabel>Support</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = iconMap[item.iconName]
          const isActive = pathname === item.url

          return (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                <Link href={item.url}>
                  {Icon && <Icon className="h-4 w-4 mr-2" />}
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
