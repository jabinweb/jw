import { LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items?: SubNavItem[]
}

export interface SubNavItem {
  title: string
  url: string
}

export interface MainNavItem extends NavItem {
  isActive?: boolean
  items?: SubNavItem[]
}

export interface SecondaryNavItem extends NavItem {}

export interface SidebarData {
  user: {
    name: string
    email: string
    avatar: string
  }
  navMain: MainNavItem[]
  navSecondary: SecondaryNavItem[]
}
