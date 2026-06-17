import {useState} from "react";
import {ActivityIcon} from "lucide-react";

import {AuthForm} from "@/components/auth/auth-form";
import {useAuthSession} from "@/hooks/use-auth-session";

import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {PlaygroundPage} from "@/features/playground/playground-page";

import {AppHeader} from "./app-header";
import {AppSidebar} from "./app-sidebar";
import {PRIMARY_NAV_ITEMS, type AppPage} from "./navigation";

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
    return <GuestShell variant="missing-config"/>;
  }

  if (isAuthLoading) {
    return <GuestShell variant="loading"/>;
  }

  if (!isAuthenticated) {
    return <GuestShell variant="sign-in"/>;
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
        <AppHeader title={currentPageTitle}/>
        <AppContent page={page}/>
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppContent({page}: { page: AppPage }) {
  if (page === "playground") {
    return <PlaygroundPage/>;
  }

  return (
    <section className="flex flex-1 items-center justify-center p-4 md:p-6">
      <div className="text-sm text-muted-foreground">
        Vyberte modul z navigace.
      </div>
    </section>
  );
}

type GuestShellProps = {
  variant: "sign-in" | "loading" | "missing-config"
}

function GuestShell({variant}: GuestShellProps) {
  return (
    <main className="min-h-screen bg-linear-to-b from-muted/50 via-background to-background">
      <section
        className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-[minmax(0,1fr)_minmax(22rem,26rem)] md:px-8">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-3xl font-semibold tracking-normal text-foreground md:text-5xl">
            Interaktivní samostudium operátorů Reactive&nbsp;Extensions
          </h1>
          <p className="text-base leading-7 text-muted-foreground md:text-lg">
            Zjistěte, jak jednotlivé operátory fungují pomocí interaktivních vizualizací a&nbsp;procvičte si jejich použití
            ve cvičných úlohách.
          </p>
        </div>

        {variant === "sign-in" && <AuthForm/>}

        {variant === "loading" && (
          <div
            className="flex min-h-64 w-full items-center justify-center rounded-xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
            <ActivityIcon className="mr-2 size-4 animate-spin"/>
            Načítám relaci...
          </div>
        )}

        {variant === "missing-config" && (
          <div className="w-full rounded-xl border bg-card p-6 text-sm text-card-foreground shadow-sm">
            <h2 className="text-lg font-semibold">Supabase není nastavený</h2>
            <p className="mt-2 text-muted-foreground">
              Přidejte VITE_SUPABASE_URL a&nbsp;VITE_SUPABASE_ANON_KEY <br/>do lokálního souboru .env.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
