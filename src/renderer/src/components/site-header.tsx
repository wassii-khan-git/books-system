import { JSX } from 'react'

export function SiteHeader(): JSX.Element {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b bg-background/70 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(0,163,92,0.15)]" />
        <div className="leading-tight">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Workspace
          </p>
          <h1 className="text-sm font-semibold tracking-tight">Library Overview</h1>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground">Connected</span>
    </header>
  )
}
