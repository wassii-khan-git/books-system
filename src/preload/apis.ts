import { ipcRenderer } from 'electron'
import { SignInTypes } from '../main/services/auth.services'
import { AddCategoryTypes } from '../main/services/categories.services'
import { AddCompanyTypes } from '../main/services/companies.services'

// auths
export const Auths = {
  getUsers: () => ipcRenderer.invoke('users:get-all'),
  signIn: (data: SignInTypes) => ipcRenderer.invoke('users:sign-in', data),
  logout: () => ipcRenderer.invoke('user:logout')
}

// categories
export const Categories = {
  // categories
  getCategories: ({ page, limit }: { page: string; limit: string }) =>
    ipcRenderer.invoke('get-categories', { page, limit }),
  getCategoryById: (id: number) => ipcRenderer.invoke('get-category-by-id', id),
  addCategory: (data: AddCategoryTypes) => ipcRenderer.invoke('add-category', data),
  updateCategory: (data: AddCategoryTypes) => ipcRenderer.invoke('update-category', data),
  deleteCategory: (id: number) => ipcRenderer.invoke('delete-category', id)
}

// companies
export const Companies = {
  // Companies
  getCompanies: ({ page, limit }: { page: string; limit: string }) =>
    ipcRenderer.invoke('get-companies', { page, limit }),
  addCompany: (data: AddCompanyTypes) => ipcRenderer.invoke('add-company', data),
  updateCompany: (data: AddCompanyTypes) => ipcRenderer.invoke('update-company', data),
  deleteCompany: (id: number) => ipcRenderer.invoke('delete-company', id)
}

// window controls
export const WindowControls = {
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  toggleFullScreen: () => ipcRenderer.invoke('window:toggle-fullscreen'),
  isFullScreen: () => ipcRenderer.invoke('window:is-fullscreen'),
  onFullScreenChange: (callback: (isFullScreen: boolean) => void): (() => void) => {
    const listener = (_event, isFullScreen: boolean) => callback(isFullScreen)
    ipcRenderer.on('window:fullscreen-changed', listener)
    return () => {
      ipcRenderer.removeListener('window:fullscreen-changed', listener)
    }
  }
}
