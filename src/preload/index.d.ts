import { UserTypes } from '@/pages/(auth)/login'
import { ElectronAPI } from '@electron-toolkit/preload'
import { AuthTypes } from 'src/main/types'
import { AddCategoryTypes } from 'src/main/services/categories.services'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      // auth
      getUsers: () => Promise<UserTypes[]>
      signIn: (data: SignInTypes) => Promise<ResponseTypes>
      logout: () => Promise<void>
      // session
      getSession: () => Promise<AuthTypes>
      // categories
      getCategories: () => Promise<ResponseTypes>
      addCategory: (data: AddCategoryTypes) => Promise<ResponseTypes>
      updateCategory: (data: AddCategoryTypes) => Promise<ResponseTypes>
      deleteCategory: (id: number) => Promise<ResponseTypes>
    }
  }
}
