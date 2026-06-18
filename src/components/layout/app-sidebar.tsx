import { LogOutIcon, UserCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { PRIMARY_NAV_ITEMS, type AppPage } from "./navigation";

type AppSidebarProps = {
  page: AppPage
  onPageChange: (page: AppPage) => void
  userEmail: string | null
  isAuthenticated: boolean
  onSignOut: () => Promise<void>
}

export function AppSidebar({
  page,
  onPageChange,
  userEmail,
  isAuthenticated,
  onSignOut,
}: AppSidebarProps) {
  const displayName = userEmail?.split("@")[0] ?? (isAuthenticated ? "User" : "Guest");

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <button type="button" onClick={() => onPageChange("dashboard")}>
                <div className="flex size-8 items-center justify-center overflow-hidden rounded-lg bg-white text-foreground ring-1 ring-border">
                  <img
                    src="/rx-icon.png"
                    alt=""
                    aria-hidden="true"
                    className="size-full object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Rx Operators</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Interaktivní playground
                  </span>
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PRIMARY_NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={page === item.id}
                    tooltip={item.label}
                  >
                    <button type="button" onClick={() => onPageChange(item.id)}>
                      <item.icon />
                      <span>{item.label}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-foreground">
                  <UserCircleIcon />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {userEmail ?? (isAuthenticated ? "Signed in" : "Not signed in")}
                  </span>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="ml-auto text-muted-foreground hover:text-destructive"
                      aria-label="Odhlásit se"
                      disabled={!isAuthenticated}
                      onClick={() => {
                        void onSignOut();
                      }}
                    >
                      <LogOutIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="center">
                    Odhlásit se
                  </TooltipContent>
                </Tooltip>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
