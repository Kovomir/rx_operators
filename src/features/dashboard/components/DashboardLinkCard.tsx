import { ArrowRightIcon, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type DashboardLinkCardProps = {
  description: string;
  icon: LucideIcon;
  title: string;
  onOpen: () => void;
};

export function DashboardLinkCard({
  description,
  icon: Icon,
  title,
  onOpen,
}: DashboardLinkCardProps) {
  return (
    <article className="grid min-w-0 gap-4 rounded-lg border bg-background p-5 shadow-sm">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <Button type="button" variant="outline" className="w-fit" onClick={onOpen}>
        Otevřít
        <ArrowRightIcon />
      </Button>
    </article>
  );
}
