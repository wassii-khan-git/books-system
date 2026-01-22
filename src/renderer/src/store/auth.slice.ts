import { User } from 'src/generated/prisma/client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  setUser: (user: User) => void
  fetchSession: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  setUser: (user) => set({ isAuthenticated: true, user, isLoading: false }),
  fetchSession: async () => {
    try {
      const session = await window.api.getSession()
      console.log('session---', session)
      if (session !== null && session !== undefined) {
        set({ isAuthenticated: true, user: session?.user, isLoading: false })
      }
    } catch (error) {
      console.log('Erroro---', error)
      set({ isAuthenticated: false, user: null, isLoading: false })
    } finally {
      set({ isLoading: false })
    }
  },
  logout: async () => {
    set({ isLoading: true })
    try {
      const response = await window.api.logout()
      console.log('lgoout -- response---', response)
      set({ isAuthenticated: false, user: null, isLoading: false })
    } catch (error) {
      console.log('Errorr--', error)
      set({ isLoading: false })
    } finally {
      set({ isLoading: false })
    }
  }
}))
