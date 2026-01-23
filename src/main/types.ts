import { User } from '../generated/prisma/client'

export type ResponseTypes = {
  success: boolean
  message: string
  data?: any
  pagination?: {
    page: string
    limit: string
    total: number
  }
}

export type AuthTypes = {
  isAuthenticated: boolean
  user: User
}
