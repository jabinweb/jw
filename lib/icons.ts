import { 
  LayoutDashboard, FileText, Settings, Users, 
  Globe, Mail, HeadphonesIcon, HelpCircle,
  ImageIcon, // Added ImageIcon for the missing 'image' type
  type LucideIcon 
} from "lucide-react"
import type { IconName } from "@/types/navigation"

export const iconMap: Record<IconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  posts: FileText,
  "file-text": FileText,
  services: Globe,
  globe: Globe,
  users: Users,
  settings: Settings,
  messages: Mail,
  mail: Mail,
  support: HeadphonesIcon,
  help: HelpCircle,
  forms: FileText,
  image: ImageIcon, // Added the missing icon
}
