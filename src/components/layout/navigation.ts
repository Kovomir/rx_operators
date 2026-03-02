import {
  FolderKanbanIcon,
  InboxIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react"

export type AppPage = "dashboard" | "projects" | "inbox" | "settings"

export type AppNavItem = {
  id: AppPage
  label: string
  icon: LucideIcon
  badge?: string
}

export const PRIMARY_NAV_ITEMS: AppNavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { id: "projects", label: "Projects", icon: FolderKanbanIcon, badge: "12" },
  { id: "inbox", label: "Inbox", icon: InboxIcon, badge: "4" },
  { id: "settings", label: "Settings", icon: SettingsIcon },
]
