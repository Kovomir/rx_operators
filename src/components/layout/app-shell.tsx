import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { ForgotPasswordPage } from "@/components/auth/forgot-password-page";
import { MissingSupabaseConfigPage } from "@/components/auth/missing-supabase-config-page";
import { PasswordResetPage } from "@/components/auth/password-reset-page";
import { SignInPage } from "@/components/auth/sign-in-page";
import { useAuthSession } from "@/hooks/use-auth-session";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaygroundPage } from "@/features/playground/playground-page";

import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import {
  DEFAULT_APP_PATH,
  getPageByPath,
  PRIMARY_NAV_ITEMS,
  type AppPage,
} from "./navigation";

export function AppShell() {
  const location = useLocation();
  const {
    isSupabaseConfigured,
    isAuthLoading,
    isAuthenticated,
    userEmail,
    signOut,
  } = useAuthSession();

  if (!isSupabaseConfigured) {
    return <MissingSupabaseConfigPage />;
  }

  if (isAuthLoading) {
    return <AppShellSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (location.pathname === "/reset-password") {
    return <PasswordResetPage />;
  }

  if (location.pathname === "/login") {
    return <Navigate to={DEFAULT_APP_PATH} replace />;
  }

  const page = getPageByPath(location.pathname);
  const currentPageTitle =
    PRIMARY_NAV_ITEMS.find((item) => item.id === page)?.label ?? "Rx Operators";

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar
        page={page}
        userEmail={userEmail}
        isAuthenticated={isAuthenticated}
        onSignOut={signOut}
      />
      <SidebarInset className="min-w-0 bg-linear-to-b from-muted/40 via-background to-background">
        <AppHeader title={currentPageTitle} />
        <Routes>
          <Route path="/" element={<Navigate to={DEFAULT_APP_PATH} replace />} />
          <Route path="/dashboard" element={<AppContent page="dashboard" />} />
          <Route path="/playground" element={<AppContent page="playground" />} />
          <Route path="/challenges" element={<AppContent page="challenges" />} />
          <Route path="/operators" element={<AppContent page="operators" />} />
          <Route path="/saved" element={<AppContent page="saved" />} />
          <Route path="*" element={<Navigate to={DEFAULT_APP_PATH} replace />} />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppContent({ page }: { page: AppPage }) {
  switch (page) {
    case "playground":
      return <PlaygroundPage />;
    case "dashboard":
    case "challenges":
    case "operators":
    case "saved":
      return (
        <section className="flex flex-1 items-center justify-center p-4 md:p-6">
          <div className="text-sm text-muted-foreground">
            Neimplementováno, zvolte jiný modul.
          </div>
        </section>
      );
  }
}

function AppShellSkeleton() {
  return (
    <main
      className="flex min-h-screen bg-linear-to-b from-muted/40 via-background to-background"
      aria-label="Načítání aplikace"
    >
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar p-3 text-sidebar-foreground md:flex md:flex-col">
        <div className="flex h-12 items-center gap-3 px-2">
          <Skeleton className="size-9 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-11/12" />
          <Skeleton className="h-9 w-10/12" />
        </div>

        <div className="mt-auto flex items-center gap-3 rounded-md border bg-background/70 p-2">
          <Skeleton className="size-8 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <Skeleton className="size-8 rounded-md md:hidden" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="ml-auto h-8 w-24 rounded-lg" />
        </header>

        <div className="min-w-0 flex-1 space-y-4 p-4 md:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <Skeleton className="h-72 rounded-lg" />
            <Skeleton className="h-72 rounded-lg" />
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </section>
    </main>
  );
}

