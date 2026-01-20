import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'
import { JSX } from 'react'

interface SpinnerProps {
  className?: string
  size: number
  isPageLoader: boolean
}

export default function Spinner({ isPageLoader, size, className }: SpinnerProps): JSX.Element {
  return (
    <Loader
      className={cn(
        `animate-spin text-indigo-500 ${
          isPageLoader && 'fixed top-[50vh] left-[47vw]'
        }  ${className}`
      )}
      size={size}
    />
  )
}
