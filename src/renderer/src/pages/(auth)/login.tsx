import React, { JSX } from 'react'
import { LoginForm } from '@/components/login-form'

const LoginPage = (): JSX.Element => {
  return (
    <div className="w-full">
      <LoginForm />
    </div>
  )
}

export default LoginPage
