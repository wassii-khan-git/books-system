import { UserTypes } from '@/pages/(auth)/login'
import { ElectronAPI } from '@electron-toolkit/preload'
import { AuthTypes } from 'src/main/types'
import { AddCategoryTypes } from 'src/main/services/categories.services'
import { AddCompanyTypes } from 'src/main/services/companies.services'
import { AddProductTypes } from 'src/main/services/product.services'

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
      getCategories: ({ page, limit }) => Promise<ResponseTypes>
      getCategoryById: (id: number) => Promise<ResponseTypes>
      addCategory: (data: AddCategoryTypes) => Promise<ResponseTypes>
      updateCategory: (data: AddCategoryTypes) => Promise<ResponseTypes>
      deleteCategory: (id: number) => Promise<ResponseTypes>
      // Companies
      getCompanies: ({ page, limit }) => Promise<ResponseTypes>
      addCompany: (data: AddCompanyTypes) => Promise<ResponseTypes>
      updateCompany: (data: AddCompanyTypes) => Promise<ResponseTypes>
      deleteCompany: (id: number) => Promise<ResponseTypes>
      // products
      getProducts: ({
        page,
        limit,
        searchTerm
      }: {
        page: number
        limit: number
        searchTerm?: string
      }) => Promise<ResponseTypes>
      getProductById: (productId: number) => Promise<ResponseTypes>
      addProduct: (data: AddProductTypes) => Promise<ResponseTypes>
      updateProduct: (data: AddProductTypes) => Promise<ResponseTypes>
      deleteProduct: (id: number) => Promise<ResponseTypes>
      // window controls
      minimizeWindow: () => Promise<void>
      closeWindow: () => Promise<void>
      toggleFullScreen: () => Promise<boolean>
      isFullScreen: () => Promise<boolean>
      onFullScreenChange: (callback: (isFullScreen: boolean) => void) => () => void
    }
  }
}
