import React, { JSX } from 'react'
import { LoginForm } from '@/components/login-form'

const SignupPage = (): JSX.Element => {
  return (
    <div>
      <h1>Sign Up</h1>
      <LoginForm />
    </div>
  )
}

export default SignupPage
