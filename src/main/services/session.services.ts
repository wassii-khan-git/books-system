import Store from 'electron-store'
import { AuthTypes } from '../types'

// store
const store = new Store()

export const SessionService = {
  saveUser: (userData: AuthTypes): void => {
    store.set('user', userData)
  },
  getUser: () => {
    return store.get('user')
  },
  logout: () => {
    return store.delete('user')
  }
}
