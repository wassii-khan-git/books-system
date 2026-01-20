import prisma from '../lib/prisma'
import bcrypt from 'bcryptjs'
import { ResponseTypes } from '../types'
import { loginSchema } from '../../renderer/src/pages/(auth)/validations'

export type SignInTypes = {
  email: string
  password: string
}

export const UserService = {
  getUsers: async () => {
    return await prisma.user.findMany()
  },
  signIn: async ({ email, password }: SignInTypes): Promise<ResponseTypes> => {
    // validation
    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      return { success: false, message: result.error.message }
    }

    // check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email }
    })

    // if user not found
    if (!user) {
      return { success: false, message: email + '--User not found', data: user }
    }
    // check if password is correct
    const isPassword = await bcrypt.compare(password, user.password)
    // if password is not correct
    if (!isPassword) {
      return { success: false, message: 'Incorrect password' }
    }
    // return the response
    return {
      success: true,
      message: 'Login successful',
      data: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }
    }
  }
}
