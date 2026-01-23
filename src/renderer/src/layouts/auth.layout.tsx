import { Outlet } from 'react-router'
import { JSX } from 'react'
import TitleBar from '@/components/titlebar'

const AuthLayout = (): JSX.Element => {
  return (
    <div className="flex min-h-svh flex-col">
      <TitleBar />
      <main className="max-w-5xl mx-auto flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
