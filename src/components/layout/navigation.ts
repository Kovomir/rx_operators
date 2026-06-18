import {
  GraduationCapIcon,
  LayoutDashboardIcon,
  LibraryIcon,
  type LucideIcon,
  PlayIcon,
  SaveIcon,
} from "lucide-react";

export type AppPage = "dashboard" | "playground" | "challenges" | "operators" | "saved";

export type AppNavItem = {
  id: AppPage;
  label: string;
  icon: LucideIcon;
  path: string;
};

export const PRIMARY_NAV_ITEMS: AppNavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboardIcon, path: "/dashboard" },
  { id: "playground", label: "Playground", icon: PlayIcon, path: "/playground" },
  { id: "challenges", label: "Výukové úlohy", icon: GraduationCapIcon, path: "/challenges" },
  { id: "operators", label: "Operátory", icon: LibraryIcon, path: "/operators" },
  { id: "saved", label: "Uložené projekty", icon: SaveIcon, path: "/saved" },
];

export const DEFAULT_APP_PATH = "/dashboard";

export function getPageByPath(pathname: string) {
  return PRIMARY_NAV_ITEMS.find((item) => item.path === pathname)?.id ?? "dashboard";
}
