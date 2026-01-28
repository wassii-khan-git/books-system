// src/store/use-auth-store.ts
import { create } from 'zustand'
import { User } from 'src/generated/prisma/client'

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
  // set user
  setUser: (user) => set({ isAuthenticated: true, user, isLoading: false }),
  // fetch session
  fetchSession: async () => {
    set({ isLoading: true })
    try {
      const session = await window.api.getSession()
      if (session?.user) {
        set({ isAuthenticated: true, user: session.user, isLoading: false })
      } else {
        set({ isAuthenticated: false, user: null, isLoading: false })
      }
    } catch (error) {
      console.log('error==', error)
      set({ isAuthenticated: false, user: null, isLoading: false })
    }
  },
  // logout
  logout: async () => {
    set({ isLoading: true })
    try {
      await window.api.logout()
      set({ isAuthenticated: false, user: null, isLoading: false })
    } catch (error) {
      console.log('error==', error)
      set({ isLoading: false })
    }
  }
}))
