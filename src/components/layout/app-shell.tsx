import { useState } from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { AppHeader } from "./app-header"
import { AppSidebar } from "./app-sidebar"
import { type AppPage } from "./navigation"

export function AppShell() {
  const [page, setPage] = useState<AppPage>("dashboard")

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar page={page} onPageChange={setPage} />
      <SidebarInset className="bg-gradient-to-b from-muted/40 via-background to-background">
        <AppHeader title="Workspace Dashboard" />
        <section className="flex flex-1" />
      </SidebarInset>
    </SidebarProvider>
  )
}
