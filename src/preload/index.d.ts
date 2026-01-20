import { UserTypes } from '@/pages/(auth)/login'
import { ElectronAPI } from '@electron-toolkit/preload'
import { AuthTypes } from 'src/main/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getUsers: () => Promise<UserTypes[]>
      signIn: (data: SignInTypes) => Promise<ResponseTypes>
      getSession: () => Promise<AuthTypes>
      logout: () => Promise<void>
    }
  }
}
