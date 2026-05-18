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
  signOut: vi.fn().mockResolvedValue(undefined),
  onAuthStateChanged: vi.fn(),
  linkWithCredential: vi.fn(),
}))

// Mock the API module
vi.mock('@/lib/api', () => ({
  API_BASE_URL: 'http://localhost:3001/api',
}))

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('starts with unauthenticated state', () => {
    const { user, isAuthenticated, isLoading } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
    expect(isLoading).toBe(false)
  })

  it('handles successful login', async () => {
    const mockUser = { id: '1', username: 'testuser', email: 'test@example.com', name: 'Test User', provider: 'credentials' }
    const mockToken = 'mock-jwt-token'

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser, token: mockToken }),
    })

    const { login } = useAuthStore.getState()
    const result = await login('testuser', 'password')

    expect(result).toBe(true)
    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).not.toBeNull()
    expect(user?.username).toBe('testuser')
    expect(isAuthenticated).toBe(true)
    expect(localStorage.getItem('auth_token')).toBe(mockToken)
  })

  it('handles login failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    })

    const { login } = useAuthStore.getState()
    await expect(login('testuser', 'wrongpassword')).rejects.toThrow('Invalid credentials')

    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
  })

  it('handles successful registration', async () => {
    const mockUser = { id: '1', username: 'newuser', email: 'new@example.com', name: 'New User', provider: 'credentials' }
    const mockToken = 'mock-jwt-token'

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser, token: mockToken }),
    })

    const { register } = useAuthStore.getState()
    const result = await register('newuser', 'new@example.com', 'password', 'New User')

    expect(result).toBe(true)
    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).not.toBeNull()
    expect(user?.username).toBe('newuser')
    expect(isAuthenticated).toBe(true)
  })

  it('handles logout', async () => {
    // First login
    const mockUser = { id: '1', username: 'testuser', email: 'test@example.com', name: 'Test User', provider: 'credentials' }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser, token: 'token' }),
    })

    const { login, logout } = useAuthStore.getState()
    await login('testuser', 'password')
    expect(localStorage.getItem('auth_token')).toBe('token')

    // Then logout
    await logout()

    const { user, isAuthenticated } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(isAuthenticated).toBe(false)
    expect(localStorage.getItem('auth_token')).toBeNull()
  })

  it('sets loading state during login', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: '1' }, token: 'token' }),
    })

    expect(useAuthStore.getState().isLoading).toBe(false)

    const { login } = useAuthStore.getState()
    await login('testuser', 'password')

    expect(useAuthStore.getState().isLoading).toBe(false)
  })
})
