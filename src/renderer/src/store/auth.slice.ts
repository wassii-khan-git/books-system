import { User } from 'src/generated/prisma/client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  setUser: (user: User) => void
  fetchSession: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      setUser: (user) => set({ isAuthenticated: true, user, isLoading: false }),
      fetchSession: async () => {
        try {
          const session = await window.api.getSession()
          console.log('session---', session)
          set({ isAuthenticated: true, user: session?.user, isLoading: false })
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
          await window.api.logout()
          set({ isAuthenticated: false, user: null, isLoading: false })
        } catch (error) {
          console.log('Errorr--', error)
          set({ isLoading: false })
        } finally {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'auth-store'
    }
  )
)
