import type { ReactNode } from "react";

type GuestPageLayoutProps = {
  children: ReactNode;
};

export function GuestPageLayout({ children }: GuestPageLayoutProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-muted/30">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid min-w-0 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-foreground/5 md:min-h-132 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:min-h-140">
          <BrandPanel />

          <div className="flex min-h-112 min-w-0 items-center justify-center border-t bg-card p-8 text-card-foreground md:min-h-full md:border-t-0 md:border-l lg:p-10">
            {children}
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
      <div className="relative flex min-h-88 flex-col justify-between gap-10 p-8 md:min-h-full lg:p-10 xl:p-12">
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

        <div className="max-w-lg space-y-4">
          <h1 className="max-w-full text-2xl font-semibold leading-tight tracking-normal sm:text-4xl lg:text-5xl">
            <span className="block">Interaktivní samostudium</span>
            <span className="block">operátorů Reactive</span>
            <span className="block">Extensions</span>
          </h1>
          <p className="max-w-120 text-base leading-relaxed text-white/90 md:text-lg">
            Zjistěte, jak jednotlivé operátory fungují pomocí interaktivních
            vizualizací a procvičte si jejich použití ve cvičných úlohách.
          </p>
        </div>
      </div>
    </div>
  );
}
