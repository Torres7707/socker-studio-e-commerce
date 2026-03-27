import { describe, it, expect, beforeEach } from 'vitest'
import { useFilterStore } from './filterStore'

describe('FilterStore', () => {
  beforeEach(() => {
    useFilterStore.setState({
      priceRange: [0, 500],
      minRating: 0,
      sortBy: 'default',
      selectedCategories: [],
      searchHistory: [],
      popularSearches: ['Nordic', 'Minimalist', 'Wood', 'Ceramic', 'Wool', 'Linen'],
    })
  })

  it('starts with default filter state', () => {
    const { priceRange, minRating, sortBy, selectedCategories } = useFilterStore.getState()
    expect(priceRange).toEqual([0, 500])
    expect(minRating).toBe(0)
    expect(sortBy).toBe('default')
    expect(selectedCategories).toHaveLength(0)
  })

  it('sets price range', () => {
    const { setPriceRange } = useFilterStore.getState()
    
    setPriceRange([100, 300])
    
    const { priceRange } = useFilterStore.getState()
    expect(priceRange).toEqual([100, 300])
  })

  it('sets minimum rating', () => {
    const { setMinRating } = useFilterStore.getState()
    
    setMinRating(4)
    
    const { minRating } = useFilterStore.getState()
    expect(minRating).toBe(4)
  })

  it('sets sort by', () => {
    const { setSortBy } = useFilterStore.getState()
    
    setSortBy('price-asc')
    
    const { sortBy } = useFilterStore.getState()
    expect(sortBy).toBe('price-asc')
  })

  it('sets selected categories', () => {
    const { setSelectedCategories } = useFilterStore.getState()
    
    setSelectedCategories(['Furniture', 'Lighting'])
    
    const { selectedCategories } = useFilterStore.getState()
    expect(selectedCategories).toContain('Furniture')
    expect(selectedCategories).toContain('Lighting')
    expect(selectedCategories).toHaveLength(2)
  })

  it('toggles category on', () => {
    const { toggleCategory } = useFilterStore.getState()
    
    toggleCategory('Furniture')
    
    const { selectedCategories } = useFilterStore.getState()
    expect(selectedCategories).toContain('Furniture')
  })

  it('toggles category off', () => {
    const { toggleCategory } = useFilterStore.getState()
    
    toggleCategory('Furniture')
    toggleCategory('Furniture')
    
    const { selectedCategories } = useFilterStore.getState()
    expect(selectedCategories).not.toContain('Furniture')
  })

  it('toggles multiple categories', () => {
    const { toggleCategory } = useFilterStore.getState()
    
    toggleCategory('Furniture')
    toggleCategory('Lighting')
    toggleCategory('Decor')
    
    const { selectedCategories } = useFilterStore.getState()
    expect(selectedCategories).toContain('Furniture')
    expect(selectedCategories).toContain('Lighting')
    expect(selectedCategories).toContain('Decor')
    expect(selectedCategories).toHaveLength(3)
  })

  it('clears all filters', () => {
    const { setPriceRange, setMinRating, setSortBy, setSelectedCategories, clearFilters } = useFilterStore.getState()
    
    // Set some filters
    setPriceRange([100, 300])
    setMinRating(4)
    setSortBy('price-asc')
    setSelectedCategories(['Furniture'])
    
    // Clear all
    clearFilters()
    
    const { priceRange, minRating, sortBy, selectedCategories } = useFilterStore.getState()
    expect(priceRange).toEqual([0, 500])
    expect(minRating).toBe(0)
    expect(sortBy).toBe('default')
    expect(selectedCategories).toHaveLength(0)
  })

  it('adds search history', () => {
    const { addSearchHistory } = useFilterStore.getState()
    
    addSearchHistory('Nordic chair')
    
    const { searchHistory } = useFilterStore.getState()
    expect(searchHistory).toContain('Nordic chair')
    expect(searchHistory).toHaveLength(1)
  })

  it('adds search to beginning of history', () => {
    const { addSearchHistory } = useFilterStore.getState()
    
    addSearchHistory('First search')
    addSearchHistory('Second search')
    
    const { searchHistory } = useFilterStore.getState()
    expect(searchHistory[0]).toBe('Second search')
    expect(searchHistory[1]).toBe('First search')
  })

  it('removes duplicate search from history', () => {
    const { addSearchHistory } = useFilterStore.getState()
    
    addSearchHistory('Nordic chair')
    addSearchHistory('Wood table')
    addSearchHistory('Nordic chair') // Duplicate
    
    const { searchHistory } = useFilterStore.getState()
    expect(searchHistory).toHaveLength(2)
    expect(searchHistory[0]).toBe('Nordic chair')
    expect(searchHistory[1]).toBe('Wood table')
  })

  it('limits search history to 10 items', () => {
    const { addSearchHistory } = useFilterStore.getState()
    
    // Add 12 searches
    for (let i = 1; i <= 12; i++) {
      addSearchHistory(`Search ${i}`)
    }
    
    const { searchHistory } = useFilterStore.getState()
    expect(searchHistory).toHaveLength(10)
    expect(searchHistory[0]).toBe('Search 12')
    expect(searchHistory[9]).toBe('Search 3')
  })

  it('does not add empty search to history', () => {
    const { addSearchHistory } = useFilterStore.getState()
    
    addSearchHistory('')
    addSearchHistory('   ')
    
    const { searchHistory } = useFilterStore.getState()
    expect(searchHistory).toHaveLength(0)
  })

  it('clears search history', () => {
    const { addSearchHistory, clearSearchHistory } = useFilterStore.getState()
    
    addSearchHistory('Search 1')
    addSearchHistory('Search 2')
    clearSearchHistory()
    
    const { searchHistory } = useFilterStore.getState()
    expect(searchHistory).toHaveLength(0)
  })

  it('gets search suggestions with empty query', () => {
    const { getSearchSuggestions } = useFilterStore.getState()
    
    const suggestions = getSearchSuggestions('')
    
    expect(suggestions).toHaveLength(5)
    expect(suggestions).toContain('Nordic')
    expect(suggestions).toContain('Minimalist')
  })

  it('gets search suggestions with query', () => {
    const { addSearchHistory, getSearchSuggestions } = useFilterStore.getState()
    
    addSearchHistory('Nordic chair')
    addSearchHistory('Wood table')
    
    const suggestions = getSearchSuggestions('Nordic')
    
    expect(suggestions).toContain('Nordic chair')
    expect(suggestions).toContain('Nordic') // From popular searches
  })

  it('combines history and popular in suggestions', () => {
    const { addSearchHistory, getSearchSuggestions } = useFilterStore.getState()
    
    addSearchHistory('Nordic chair')
    
    const suggestions = getSearchSuggestions('Nordic')
    
    expect(suggestions).toContain('Nordic chair') // From history
    expect(suggestions).toContain('Nordic') // From popular
  })

  it('limits suggestions to 5 items', () => {
    const { addSearchHistory, getSearchSuggestions } = useFilterStore.getState()
    
    // Add many matching searches
    addSearchHistory('Nordic 1')
    addSearchHistory('Nordic 2')
    addSearchHistory('Nordic 3')
    addSearchHistory('Nordic 4')
    addSearchHistory('Nordic 5')
    addSearchHistory('Nordic 6')
    
    const suggestions = getSearchSuggestions('Nordic')
    
    expect(suggestions).toHaveLength(5)
  })

  it('handles case insensitive search', () => {
    const { addSearchHistory, getSearchSuggestions } = useFilterStore.getState()
    
    addSearchHistory('NORDIC chair')
    
    const suggestions = getSearchSuggestions('nordic')
    
    expect(suggestions).toContain('NORDIC chair')
  })
})