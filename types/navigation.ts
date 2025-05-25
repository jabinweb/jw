export type IconName = 
  | "dashboard"
  | "posts"
  | "services"
  | "users"
  | "settings"
  | "messages"
  | "support"
  | "help"
  | "globe"
  | "file-text"
  | "mail"
  | "forms" 
  | "image"

export interface NavItem {
  title: string;
  url: string;
  iconName: IconName;
  isActive?: boolean;
  items?: { title: string; url: string; }[];
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
  navMain: NavItem[]
  navSecondary: NavItem[]
}
