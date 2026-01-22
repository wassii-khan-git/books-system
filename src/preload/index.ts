import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { SignInTypes } from '../main/services/auth.services'
import { AddCategoryTypes } from '../main/services/categories.services'

// Custom APIs for renderer
const api = {
  // session
  getSession: () => ipcRenderer.invoke('user:get-session'),
  // auth
  getUsers: () => ipcRenderer.invoke('users:get-all'),
  signIn: (data: SignInTypes) => ipcRenderer.invoke('users:sign-in', data),
  logout: () => ipcRenderer.invoke('user:logout'),
  // categories
  getCategories: () => ipcRenderer.invoke('get-categories'),
  addCategory: (data: AddCategoryTypes) => ipcRenderer.invoke('add-category', data),
  updateCategory: (data: AddCategoryTypes) => ipcRenderer.invoke('update-category', data),
  deleteCategory: (id: number) => ipcRenderer.invoke('delete-category', id)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
