import { describe, it, expect, beforeEach } from 'vitest'
import { useFavoritesStore } from './favoritesStore'

describe('FavoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: [] })
  })

  it('starts with empty favorites', () => {
    const { favorites } = useFavoritesStore.getState()
    expect(favorites).toHaveLength(0)
  })

  it('adds favorite', () => {
    const { addFavorite } = useFavoritesStore.getState()
    
    addFavorite('1')
    
    const { favorites } = useFavoritesStore.getState()
    expect(favorites).toContain('1')
    expect(favorites).toHaveLength(1)
  })

  it('adds multiple favorites', () => {
    const { addFavorite } = useFavoritesStore.getState()
    
    addFavorite('1')
    addFavorite('2')
    addFavorite('3')
    
    const { favorites } = useFavoritesStore.getState()
    expect(favorites).toContain('1')
    expect(favorites).toContain('2')
    expect(favorites).toContain('3')
    expect(favorites).toHaveLength(3)
  })

  it('handles adding same favorite multiple times', () => {
    const { addFavorite } = useFavoritesStore.getState()
    
    addFavorite('1')
    addFavorite('1')
    
    const { favorites } = useFavoritesStore.getState()
    // Note: Current implementation allows duplicates, so we expect 2
    // In a real app, you might want to prevent duplicates
    expect(favorites).toHaveLength(2)
  })

  it('removes favorite', () => {
    const { addFavorite, removeFavorite } = useFavoritesStore.getState()
    
    addFavorite('1')
    addFavorite('2')
    removeFavorite('1')
    
    const { favorites } = useFavoritesStore.getState()
    expect(favorites).not.toContain('1')
    expect(favorites).toContain('2')
    expect(favorites).toHaveLength(1)
  })

  it('handles removing non-existent favorite', () => {
    const { removeFavorite } = useFavoritesStore.getState()
    
    removeFavorite('non-existent')
    
    const { favorites } = useFavoritesStore.getState()
    expect(favorites).toHaveLength(0)
  })

  it('toggles favorite on', () => {
    const { toggleFavorite } = useFavoritesStore.getState()
    
    toggleFavorite('1')
    
    const { favorites } = useFavoritesStore.getState()
    expect(favorites).toContain('1')
  })

  it('toggles favorite off', () => {
    const { addFavorite, toggleFavorite } = useFavoritesStore.getState()
    
    addFavorite('1')
    toggleFavorite('1')
    
    const { favorites } = useFavoritesStore.getState()
    expect(favorites).not.toContain('1')
  })

  it('checks if product is favorite', () => {
    const { addFavorite, isFavorite } = useFavoritesStore.getState()
    
    addFavorite('1')
    
    expect(isFavorite('1')).toBe(true)
    expect(isFavorite('2')).toBe(false)
  })

  it('gets favorites count', () => {
    const { addFavorite, getCount } = useFavoritesStore.getState()
    
    expect(getCount()).toBe(0)
    
    addFavorite('1')
    expect(getCount()).toBe(1)
    
    addFavorite('2')
    expect(getCount()).toBe(2)
  })

  it('maintains favorites order', () => {
    const { addFavorite } = useFavoritesStore.getState()
    
    addFavorite('1')
    addFavorite('2')
    addFavorite('3')
    
    const { favorites } = useFavoritesStore.getState()
    expect(favorites[0]).toBe('1')
    expect(favorites[1]).toBe('2')
    expect(favorites[2]).toBe('3')
  })

  it('handles complex toggle sequence', () => {
    const { toggleFavorite, isFavorite, getCount } = useFavoritesStore.getState()
    
    // Add 1, 2, 3
    toggleFavorite('1')
    toggleFavorite('2')
    toggleFavorite('3')
    
    expect(getCount()).toBe(3)
    expect(isFavorite('1')).toBe(true)
    expect(isFavorite('2')).toBe(true)
    expect(isFavorite('3')).toBe(true)
    
    // Remove 2
    toggleFavorite('2')
    
    expect(getCount()).toBe(2)
    expect(isFavorite('1')).toBe(true)
    expect(isFavorite('2')).toBe(false)
    expect(isFavorite('3')).toBe(true)
    
    // Add 2 back
    toggleFavorite('2')
    
    expect(getCount()).toBe(3)
    expect(isFavorite('1')).toBe(true)
    expect(isFavorite('2')).toBe(true)
    expect(isFavorite('3')).toBe(true)
  })
})