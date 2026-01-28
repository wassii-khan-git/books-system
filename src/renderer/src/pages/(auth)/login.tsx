import { JSX, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Link, useNavigate } from 'react-router-dom'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { loginSchema, loginSchemaTypes } from './validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import heroImage from '@/assets/hero.jpg'
import { ResponseTypes } from '../../../../main/types'
import { Eye, EyeClosed } from 'lucide-react'
import Spinner from '@/components/shared/spinner'
import { useAuthStore } from '@/store/auth.slice'

export interface UserTypes {
  id: number
  name: string
  email: string
  password?: string
  updatedAt?: Date
  createdAt?: Date
  companies?: []
}

export function LoginPage(): JSX.Element {
  // users
  const form = useForm<loginSchemaTypes>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'developer@gmail.com',
      password: '123456'
    }
  })

  // navigate
  const navigate = useNavigate()
  // show password
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // auth
  const setUser = useAuthStore((state) => state.setUser)

  const formSubmit = async ({ email, password }): Promise<void> => {
    console.log('email---', email)
    console.log('password---', password)

    try {
      // Call sign in on client side
      const response: ResponseTypes = await window.api.signIn({ email, password })
      console.log('response---from login-', response)

      if (response?.success) {
        toast.success('Login Successful')
        form.reset()
        setUser(response?.data)
        // redirect to dashboard
        navigate('/dashboard/home', { replace: true })
      } else {
        toast.error(response?.message || 'Failed to send magic link. Please try again.')
      }
    } catch (error) {
      console.error('Failed to login:', error)
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="w-full">
      <div className={cn('flex flex-col gap-6')}>
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(formSubmit)} className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <h2 className="text-3xl font-semibold ">Login</h2>
                    <p className="text-gray-500 leading-relaxed">
                      Join thousands of users who trust our platform for their daily workflow and
                      productivity.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input className="my-2" placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Link to="/" className="ml-auto text-sm underline-offset-2 hover:underline">
                      Forgot your password?
                    </Link>

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password *</FormLabel>
                          <div className="flex flex-row-reverse justify-between items-center">
                            <FormControl>
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                className="relative my-2"
                                placeholder="Enter your password"
                                {...field}
                              />
                            </FormControl>
                            <span
                              className=" absolute text-gray-500 hover:text-gray-400 pr-4"
                              onClick={() => setShowPassword((prev) => !prev)}
                            >
                              {showPassword ? (
                                <Eye className="h-5 w-5" />
                              ) : (
                                <EyeClosed className="h-5 w-5" />
                              )}
                            </span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary">
                    {form.formState.isSubmitting ? (
                      <Spinner isPageLoader={false} size={14} className="text-white" />
                    ) : (
                      'Login'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
            <div className="relative hidden bg-muted md:block min-h-125">
              <img
                src={heroImage}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
