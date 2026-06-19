import { GuestPageLayout } from "@/components/auth/guest-page-layout";

export function MissingSupabaseConfigPage() {
  return (
    <GuestPageLayout>
      <div className="w-full max-w-md text-sm text-card-foreground">
        <h2 className="text-lg font-semibold">Supabase není nastavený</h2>
        <p className="mt-2 text-muted-foreground">
          Přidejte VITE_SUPABASE_URL a&nbsp;VITE_SUPABASE_ANON_KEY <br />
          do lokálního souboru .env.
        </p>
      </div>
    </GuestPageLayout>
  );
}
