import { ipcMain } from 'electron'
import { UserService } from '../services/auth.services'

export async function usersController(): Promise<void> {
  // get all users
  ipcMain.handle('users:get-all', async () => {
    return await UserService.getUsers()
  })
}
