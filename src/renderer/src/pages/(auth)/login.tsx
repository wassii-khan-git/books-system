import React, { JSX } from 'react'
import { LoginForm } from '@/components/login-form'

const LoginPage = (): JSX.Element => {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
    </div>
  )
}

export default LoginPage
