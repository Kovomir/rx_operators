import { useState } from "react";
import { ActivityIcon } from "lucide-react";

import { AuthForm } from "@/components/auth/auth-form";
import { useAuthSession } from "@/hooks/use-auth-session";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PlaygroundPage } from "@/features/playground/playground-page";

import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { PRIMARY_NAV_ITEMS, type AppPage } from "./navigation";

export function AppShell() {
  const [page, setPage] = useState<AppPage>("dashboard");
  const {
    isSupabaseConfigured,
    isAuthLoading,
    isAuthenticated,
    userEmail,
    signOut,
  } = useAuthSession();

  if (!isSupabaseConfigured) {
    return <GuestShell variant="missing-config" />;
  }

  if (isAuthLoading) {
    return <GuestShell variant="loading" />;
  }

  if (!isAuthenticated) {
    return <GuestShell variant="sign-in" />;
  }

  const currentPageTitle =
    PRIMARY_NAV_ITEMS.find((item) => item.id === page)?.label ?? "Rx Operators";

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar
        page={page}
        onPageChange={setPage}
        userEmail={userEmail}
        isAuthenticated={isAuthenticated}
        onSignOut={signOut}
      />
      <SidebarInset className="min-w-0 bg-linear-to-b from-muted/40 via-background to-background">
        <AppHeader title={currentPageTitle} />
        <AppContent page={page} />
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppContent({page}: { page: AppPage }) {
  switch (page) {
    case "playground":
      return (
        <PlaygroundPage/>
      );
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

type GuestShellProps = {
  variant: "sign-in" | "loading" | "missing-config";
};

function GuestShell({ variant }: GuestShellProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-muted/30">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid min-w-0 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-foreground/5 md:min-h-[33rem] md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:min-h-[35rem]">
          <BrandPanel />

          <div className="flex min-h-[28rem] min-w-0 items-center justify-center border-t bg-card p-8 text-card-foreground md:min-h-full md:border-t-0 md:border-l lg:p-10">
            {variant === "sign-in" && <AuthForm />}

            {variant === "loading" && (
              <div className="flex w-full max-w-md items-center justify-center text-sm text-muted-foreground">
                <ActivityIcon className="mr-2 size-4 animate-spin" />
                Načítám relaci...
              </div>
            )}

            {variant === "missing-config" && (
              <div className="w-full max-w-md text-sm text-card-foreground">
                <h2 className="text-lg font-semibold">
                  Supabase není nastavený
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Přidejte VITE_SUPABASE_URL a&nbsp;VITE_SUPABASE_ANON_KEY{" "}
                  <br />
                  do lokálního souboru .env.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function BrandPanel() {
  return (
    <div className="relative min-w-0 overflow-hidden bg-linear-to-br from-violet-500 via-indigo-500 to-sky-500 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,transparent_38%,rgba(255,255,255,0.12)_100%)]" />
      <div className="relative flex min-h-[22rem] flex-col justify-between gap-10 p-8 md:min-h-full lg:p-10 xl:p-12">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-white/95 text-foreground shadow-sm">
            <img
              src="/rx-icon.png"
              alt=""
              aria-hidden="true"
              className="size-full object-contain"
            />
          </div>
          <div>
            <div className="text-lg font-semibold">Rx Operators</div>
            <div className="text-sm text-white/80">Interaktivní playground</div>
          </div>
        </div>

        <div className="max-w-[32rem] space-y-4">
          <h1 className="max-w-full text-2xl font-semibold leading-tight tracking-normal sm:text-4xl lg:text-5xl">
            <span className="block">Interaktivní samostudium</span>
            <span className="block">operátorů Reactive</span>
            <span className="block">Extensions</span>
          </h1>
          <p className="max-w-[30rem] text-base leading-relaxed text-white/90 md:text-lg">
            Zjistěte, jak jednotlivé operátory fungují pomocí interaktivních
            vizualizací a procvičte si jejich použití ve cvičných úlohách.
          </p>
        </div>
      </div>
    </div>
  );
}
