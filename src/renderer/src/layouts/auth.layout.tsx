import { Outlet } from 'react-router'
import { JSX } from 'react'

const AuthLayout = (): JSX.Element => {
  return (
    <main className="max-w-5xl mx-auto flex flex-col items-center justify-center gap-4 p-4 h-screen">
      <Outlet />
    </main>
  )
}

export default AuthLayout
