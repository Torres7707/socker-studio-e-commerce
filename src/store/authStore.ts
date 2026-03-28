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
          
          const response = await fetch('http://localhost:3001/api/auth/login', {
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
          
          const response = await fetch('http://localhost:3001/api/auth/register', {
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
          const user = convertFirebaseUser(result.user)
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
          const user = convertFirebaseUser(result.user)
          set({ user, isAuthenticated: true, isLoading: false })
          return true
        } catch (error: unknown) {
          const firebaseError = error as { code?: string; credential?: AuthCredential }
          
          // 处理账号已存在的情况
          if (firebaseError.code === 'auth/account-exists-with-different-credential' && firebaseError.credential) {
            // 获取当前登录的用户
            const currentUser = auth.currentUser
            if (currentUser) {
              try {
                // 关联凭证到当前用户
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
    }),
    {
      name: 'scandinavian_shop_user',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)