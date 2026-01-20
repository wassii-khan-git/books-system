import { UserTypes } from '@/pages/(auth)/login'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  user: UserTypes | null
  setUser: (user: UserTypes) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setUser: (user) => set({ isAuthenticated: true, user }),
      logout: () => {
        window.api.logout() // Clear the Electron-Store on disk too
        set({ isAuthenticated: false, user: null })
      }
    }),
    {
      name: 'auth-store'
    }
  )
)
