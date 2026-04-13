import { useState } from "react"

import { AuthForm } from "@/components/auth/auth-form"
import { useAuthSession } from "@/hooks/use-auth-session"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { AppHeader } from "./app-header"
import { AppSidebar } from "./app-sidebar"
import { type AppPage } from "./navigation"

export function AppShell() {
  const [page, setPage] = useState<AppPage>("dashboard")
  const {
    isSupabaseConfigured,
    isAuthLoading,
    isAuthenticated,
    userEmail,
    signOut,
  } = useAuthSession()

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar
        page={page}
        onPageChange={setPage}
        userEmail={userEmail}
        isAuthenticated={isAuthenticated}
        onSignOut={signOut}
      />
      <SidebarInset className="bg-linear-to-b from-muted/40 via-background to-background">
        <AppHeader title="Workspace Dashboard" />
        <section className="flex flex-1 items-center justify-center p-4 md:p-6">
          {!isSupabaseConfigured && (
            <div className="w-full max-w-md rounded-xl border bg-card p-6 text-sm text-card-foreground shadow-sm">
              <h2 className="text-lg font-semibold">Supabase Not Configured</h2>
              <p className="mt-2 text-muted-foreground">
                Add <code>VITE_SUPABASE_URL</code> and{" "}
                <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code>{" "}
                file.
              </p>
            </div>
          )}
          {isSupabaseConfigured && isAuthLoading && (
            <div className="text-sm text-muted-foreground">Loading session...</div>
          )}
          {isSupabaseConfigured && !isAuthLoading && !isAuthenticated && (
            <AuthForm />
          )}
        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}
