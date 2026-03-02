import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

type AppHeaderProps = {
  title: string
}

export function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mx-1 h-4" />

      <div className="flex min-w-0 flex-1 items-center">
        <h1 className="truncate text-sm font-semibold md:text-base">{title}</h1>
      </div>
    </header>
  )
}
