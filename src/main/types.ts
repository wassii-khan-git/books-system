import { User } from '../generated/prisma/client'

export type ResponseTypes = {
  success: boolean
  message: string
  data?: any
}

export type AuthTypes = {
  isAuthenticated: boolean
  user?: User
}
