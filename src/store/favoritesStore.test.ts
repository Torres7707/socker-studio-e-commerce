import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useFavoritesStore } from './favoritesStore'

// Mock the API module
vi.mock('@/lib/api', () => ({
  favoritesApi: {
    getFavorites: vi.fn().mockResolvedValue([]),
    addToFavorites: vi.fn().mockResolvedValue({}),
    removeFromFavorites: vi.fn().mockResolvedValue({}),
    checkFavorite: vi.fn().mockResolvedValue({ isFavorite: false }),
  },
}))

describe('FavoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: [] })
    vi.clearAllMocks()
  })

  it('starts with empty favorites', () => {
    const { favorites } = useFavoritesStore.getState()
    expect(favorites).toHaveLength(0)
  })

  it('adds favorite', async () => {
    const { addFavorite } = useFavoritesStore.getState()
    await addFavorite('1')
    const { favorites } = useFavoritesStore.getState()
    expect(favorites).toContain('1')
    expect(favorites).toHaveLength(1)
  })

  it('adds multiple favorites', async () => {
    const { addFavorite } = useFavoritesStore.getState()
    await addFavorite('1')
    await addFavorite('2')
    await addFavorite('3')
    const { favorites } = useFavoritesStore.getState()
    expect(favorites).toContain('1')
    expect(favorites).toContain('2')
    expect(favorites).toContain('3')
    expect(favorites).toHaveLength(3)
  })

  it('removes favorite', async () => {
    const { addFavorite, removeFavorite } = useFavoritesStore.getState()
    await addFavorite('1')
    await addFavorite('2')
    await removeFavorite('1')
    const { favorites } = useFavoritesStore.getState()
    expect(favorites).not.toContain('1')
    expect(favorites).toContain('2')
    expect(favorites).toHaveLength(1)
  })

  it('handles removing non-existent favorite', async () => {
    const { removeFavorite } = useFavoritesStore.getState()
    await removeFavorite('non-existent')
    const { favorites } = useFavoritesStore.getState()
    expect(favorites).toHaveLength(0)
  })

  it('checks if product is favorite', async () => {
    const { addFavorite, isFavorite } = useFavoritesStore.getState()
    await addFavorite('1')
    expect(isFavorite('1')).toBe(true)
    expect(isFavorite('2')).toBe(false)
  })

  it('gets favorites count', async () => {
    const { addFavorite, getCount } = useFavoritesStore.getState()
    expect(getCount()).toBe(0)
    await addFavorite('1')
    expect(getCount()).toBe(1)
    await addFavorite('2')
    expect(getCount()).toBe(2)
  })
})
