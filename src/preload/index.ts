import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { SignInTypes } from '../main/services/auth.services'

// Custom APIs for renderer
const api = {
  getUsers: () => ipcRenderer.invoke('users:get-all'),
  signIn: (data: SignInTypes) => ipcRenderer.invoke('users:sign-in', data),
  getSession: () => ipcRenderer.invoke('user:get-session'),
  logout: () => ipcRenderer.invoke('user:logout')
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
