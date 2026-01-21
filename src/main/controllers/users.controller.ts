import { ipcMain } from 'electron'
import { SignInTypes, UserService } from '../services/auth.services'
import { SessionService } from '../services/session.services'

export async function usersController(): Promise<void> {
  // get all users
  ipcMain.handle('users:get-all', async () => {
    return await UserService.getUsers()
  })
  // sign in
  ipcMain.handle('users:sign-in', async (_event, { email, password }: SignInTypes) => {
    const response = await UserService.signIn({ email, password })
    if (response.success) {
      SessionService.saveUser({ isAuthenticated: response.success || true, user: response.data })
      return response
    }
    return response
  })
}
