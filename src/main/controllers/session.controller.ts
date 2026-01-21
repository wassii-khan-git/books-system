import { ipcMain } from 'electron'
import { SessionService } from '../services/session.services'

export async function sessionsController(): Promise<void> {
  // get session
  ipcMain.handle('user:get-session', () => {
    return SessionService.getUser()
  })
  // remove session
  ipcMain.handle('user:logout', () => {
    return SessionService.logout()
  })
}
