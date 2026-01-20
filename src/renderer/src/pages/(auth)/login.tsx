import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { JSX } from 'react'

import heroImage from '@/assets/hero.jpg'
import { Link } from 'react-router-dom'

export function LoginPage(): JSX.Element {
  return (
    <div className="w-full">
      <div className={cn('flex flex-col gap-6')}>
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <h2 className="text-3xl font-semibold ">Login</h2>
                  <p className="text-gray-500 leading-relaxed">
                    Join thousands of users who trust our platform for their daily workflow and
                    productivity.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/" className="ml-auto text-sm underline-offset-2 hover:underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <Input id="password" type="password" required placeholder="Enter Your password" />
                </div>
                <Button type="submit" className="w-full bg-primary mt-5">
                  Login
                </Button>
              </div>
            </form>
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
