import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  linkWithCredential,
  type User as FirebaseUser,
  type AuthCredential
} from 'firebase/auth'
import { auth, googleProvider, githubProvider } from '@/lib/firebase'
import { API_BASE_URL } from '@/lib/api'
import { type User } from '@/schemas'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string, name: string) => Promise<boolean>
  loginWithGoogle: () => Promise<boolean>
  loginWithGithub: () => Promise<boolean>
  logout: () => Promise<void>
  initializeAuthListener: () => void
  fetchUser: () => Promise<void>
}

// Helper function to convert Firebase user to our User type
const convertFirebaseUser = (firebaseUser: FirebaseUser): User => {
  const providerId = firebaseUser.providerData[0]?.providerId
  let provider: 'google' | 'github' | 'credentials' = 'credentials'
  
  if (providerId === 'google.com') {
    provider = 'google'
  } else if (providerId === 'github.com') {
    provider = 'github'
  }

  return {
    id: firebaseUser.uid,
    username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'user',
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || 'User',
    photoURL: firebaseUser.photoURL || undefined,
    provider
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (username: string, password: string): Promise<boolean> => {
        try {
          set({ isLoading: true })
          
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Login failed')
          }

          const { user, token } = await response.json()
          
          // Store token in localStorage
          localStorage.setItem('auth_token', token)
          
          set({ user, isAuthenticated: true, isLoading: false })
          return true
        } catch (error) {
          console.error('Login error:', error)
          set({ isLoading: false })
          throw error
        }
      },

      register: async (username: string, email: string, password: string, name: string): Promise<boolean> => {
        try {
          set({ isLoading: true })
          
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, name }),
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Registration failed')
          }

          const { user, token } = await response.json()
          
          // Store token in localStorage
          localStorage.setItem('auth_token', token)
          
          set({ user, isAuthenticated: true, isLoading: false })
          return true
        } catch (error) {
          console.error('Registration error:', error)
          set({ isLoading: false })
          throw error
        }
      },

      loginWithGoogle: async (): Promise<boolean> => {
        try {
          set({ isLoading: true })
          const result = await signInWithPopup(auth, googleProvider)
          const firebaseUser = result.user

          const response = await fetch(`${API_BASE_URL}/auth/oauth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'User',
              photoURL: firebaseUser.photoURL || undefined,
              provider: 'google',
              firebaseUid: firebaseUser.uid,
            }),
          })

          if (!response.ok) {
            throw new Error('OAuth login failed')
          }

          const { user, token } = await response.json()
          localStorage.setItem('auth_token', token)
          set({ user, isAuthenticated: true, isLoading: false })
          return true
        } catch (error) {
          console.error('Google login error:', error)
          set({ isLoading: false })
          throw error
        }
      },

      loginWithGithub: async (): Promise<boolean> => {
        try {
          set({ isLoading: true })
          const result = await signInWithPopup(auth, githubProvider)
          const firebaseUser = result.user

          const response = await fetch(`${API_BASE_URL}/auth/oauth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'User',
              photoURL: firebaseUser.photoURL || undefined,
              provider: 'github',
              firebaseUid: firebaseUser.uid,
            }),
          })

          if (!response.ok) {
            throw new Error('OAuth login failed')
          }

          const { user, token } = await response.json()
          localStorage.setItem('auth_token', token)
          set({ user, isAuthenticated: true, isLoading: false })
          return true
        } catch (error: unknown) {
          const firebaseError = error as { code?: string; credential?: AuthCredential }

          if (firebaseError.code === 'auth/account-exists-with-different-credential' && firebaseError.credential) {
            const currentUser = auth.currentUser
            if (currentUser) {
              try {
                await linkWithCredential(currentUser, firebaseError.credential)
                const user = convertFirebaseUser(currentUser)
                set({ user, isAuthenticated: true, isLoading: false })
                return true
              } catch (linkError) {
                console.error('Account linking error:', linkError)
                set({ isLoading: false })
                throw linkError
              }
            }
          }

          console.error('GitHub login error:', error)
          set({ isLoading: false })
          throw error
        }
      },

      logout: async (): Promise<void> => {
        try {
          localStorage.removeItem('auth_token')
          await signOut(auth)
          set({ user: null, isAuthenticated: false, isLoading: false })
        } catch (error) {
          console.error('Logout error:', error)
          throw error
        }
      },

      initializeAuthListener: () => {
        onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            const user = convertFirebaseUser(firebaseUser)
            set({ user, isAuthenticated: true, isLoading: false })
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false })
          }
        })
      },

      fetchUser: async () => {
        try {
          set({ isLoading: true })
          const token = localStorage.getItem('auth_token')
          if (!token) {
            set({ user: null, isAuthenticated: false, isLoading: false })
            return
          }

          const response = await fetch(`${API_BASE_URL}/users/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            // Token is invalid, clear it
            localStorage.removeItem('auth_token')
            set({ user: null, isAuthenticated: false, isLoading: false })
            return
          }

          const user = await response.json()
          set({ user, isAuthenticated: true, isLoading: false })
        } catch (error) {
          console.error('Failed to fetch user:', error)
          localStorage.removeItem('auth_token')
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },
    }),
    {
      name: 'scandinavian_shop_auth',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
)

// Initialize auth state from token
const initializeAuth = async () => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    // Token exists, fetch user data
    const store = useAuthStore.getState()
    await store.fetchUser()
  }
}

// Call initialization
initializeAuth()
