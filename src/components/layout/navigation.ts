import {GraduationCapIcon, LayoutDashboardIcon, LibraryIcon, type LucideIcon, PlayIcon, SaveIcon,} from "lucide-react"

export type AppPage = "dashboard" | "playground" | "challenges" | "operators" | "saved";

export type AppNavItem = {
  id: AppPage
  label: string
  icon: LucideIcon
}

export const PRIMARY_NAV_ITEMS: AppNavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { id: "playground", label: "Playground", icon: PlayIcon },
  { id: "challenges", label: "Výukové úlohy", icon: GraduationCapIcon },
  { id: "operators", label: "Operátory", icon: LibraryIcon },
  { id: "saved", label: "Uložené projekty", icon: SaveIcon },
]
