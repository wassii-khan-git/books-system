import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { Book, Compass, Maximize2, Minimize2, Minus, Moon, Sun, X } from 'lucide-react'
import { JSX, useEffect, useState } from 'react'

export default function TitleBar(): JSX.Element {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [isFullScreen, setIsFullScreen] = useState(false)
  const currentTheme = resolvedTheme ?? theme ?? 'light'
  const isDark = currentTheme === 'dark'

  useEffect(() => {
    let cleanup: (() => void) | undefined

    window.api?.isFullScreen?.().then((state) => setIsFullScreen(state))
    cleanup = window.api?.onFullScreenChange?.((state) => setIsFullScreen(state))

    return () => cleanup?.()
  }, [])

  const handleToggleTheme = (): void => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const handleMinimize = (): void => {
    window.api?.minimizeWindow?.()
  }

  const handleToggleFullScreen = async (): Promise<void> => {
    const nextState = await window.api?.toggleFullScreen?.()
    if (typeof nextState === 'boolean') {
      setIsFullScreen(nextState)
    }
  }

  const handleClose = (): void => {
    window.api?.closeWindow?.()
  }

  return (
    <header className="flex h-12 items-center justify-between border-b bg-background/80 px-3 backdrop-blur-xl [-webkit-app-region:drag]">
      <div className="flex items-center gap-3 text-sm font-semibold">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary shadow-sm">
          <Book className="h-4 w-4" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">Books System</span>
          <span className="text-[11px] text-muted-foreground">Library Workspace</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 [-webkit-app-region:no-drag]">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleTheme}
          className="h-8 w-8 rounded-md text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <div className="mx-1 h-5 w-px bg-border/70" />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMinimize}
          className="h-8 w-8 rounded-md text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          aria-label="Minimize window"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleFullScreen}
          className="h-8 w-8 rounded-md text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          aria-label={isFullScreen ? 'Exit full screen' : 'Enter full screen'}
        >
          {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="h-8 w-8 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label="Close window"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
