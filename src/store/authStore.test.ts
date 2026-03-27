import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from './authStore'

// Mock Firebase
vi.mock('@/lib/firebase', () => ({
  auth: {},
  googleProvider: {},
  githubProvider: {},
}))

vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  linkWithCredential: vi.fn(),
}))

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  })

  it('starts with unauthenticated state', () => {
    const { user, isAuthenticated, isLoading } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
    expect(isLoading).toBe(false)
  })

  it('handles successful login', async () => {
    const { login } = useAuthStore.getState()
    
    const result = await login('testuser', 'password')
    
    expect(result).toBe(true)
    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).not.toBeNull()
    expect(user?.username).toBe('testuser')
    expect(isAuthenticated).toBe(true)
  })

  it('handles successful registration', async () => {
    const { register } = useAuthStore.getState()
    
    const result = await register('newuser', 'new@example.com', 'password', 'New User')
    
    expect(result).toBe(true)
    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).not.toBeNull()
    expect(user?.username).toBe('newuser')
    expect(user?.email).toBe('new@example.com')
    expect(isAuthenticated).toBe(true)
  })

  it('handles logout', async () => {
    // First login
    const { login, logout } = useAuthStore.getState()
    await login('testuser', 'password')
    
    // Then logout
    await logout()
    
    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
  })

  it('sets loading state during login', async () => {
    const { login } = useAuthStore.getState()
    
    // Check initial state
    expect(useAuthStore.getState().isLoading).toBe(false)
    
    const result = await login('testuser', 'password')
    
    // Check result is successful
    expect(result).toBe(true)
    
    // Check loading state is false after login
    expect(useAuthStore.getState().isLoading).toBe(false)
  })

  it('sets loading state during registration', async () => {
    const { register } = useAuthStore.getState()
    
    // Check initial state
    expect(useAuthStore.getState().isLoading).toBe(false)
    
    const result = await register('newuser', 'new@example.com', 'password', 'New User')
    
    // Check result is successful
    expect(result).toBe(true)
    
    // Check loading state is false after registration
    expect(useAuthStore.getState().isLoading).toBe(false)
  })

  it('sets loading state during logout', async () => {
    const { login, logout } = useAuthStore.getState()
    
    // First login
    await login('testuser', 'password')
    
    // Check loading state is false before logout
    expect(useAuthStore.getState().isLoading).toBe(false)
    
    await logout()
    
    // Check loading state is false after logout
    expect(useAuthStore.getState().isLoading).toBe(false)
  })

  it('creates user with correct provider type', async () => {
    const { login } = useAuthStore.getState()
    
    await login('testuser', 'password')
    
    const { user } = useAuthStore.getState()
    expect(user?.provider).toBe('credentials')
  })

  it('generates email from username', async () => {
    const { login } = useAuthStore.getState()
    
    await login('testuser', 'password')
    
    const { user } = useAuthStore.getState()
    expect(user?.email).toBe('testuser@example.com')
  })

  it('capitalizes username for display name', async () => {
    const { login } = useAuthStore.getState()
    
    await login('testuser', 'password')
    
    const { user } = useAuthStore.getState()
    expect(user?.name).toBe('Testuser')
  })
})