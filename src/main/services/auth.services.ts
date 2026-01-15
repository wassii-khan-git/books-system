import prisma from '../lib/prisma'

export const UserService = {
  getUsers: async () => {
    return await prisma.user.findMany()
  }
}
