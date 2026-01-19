import { Outlet } from 'react-router'
import { JSX } from 'react'

const AuthLayout = (): JSX.Element => {
  return (
    <main>
      <Outlet />
    </main>
  )
}

export default AuthLayout
