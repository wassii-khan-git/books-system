import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Auths, Categories, Companies, Products, Sales, WindowControls } from './apis'

// Custom APIs for renderer
const api = {
  // session
  getSession: () => ipcRenderer.invoke('user:get-session'),
  ...Auths,
  // categories
  ...Categories,
  // companies
  ...Companies,
  // products
  ...Products,
  // sales
  ...Sales,
  // window controls
  ...WindowControls
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
