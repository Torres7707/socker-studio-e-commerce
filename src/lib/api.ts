const API_BASE_URL = 'http://localhost:3001/api'

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

// Helper function to make authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken()
  
  const headers: HeadersInit = {
    ...options.headers,
  }
  
  // Only set Content-Type to application/json if there's a body
  if (options.body) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json'
  }
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }
  
  return fetch(url, {
    ...options,
    headers,
  })
}

// Products API
export const productsApi = {
  getProducts: async (params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    minRating?: number
    sortBy?: string
  }) => {
    const searchParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
    }
    
    const response = await fetch(`${API_BASE_URL}/products?${searchParams.toString()}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    
    return response.json()
  },
  
  getProduct: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch product')
    }
    
    return response.json()
  },
  
  getProductReviews: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/reviews`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch reviews')
    }
    
    return response.json()
  },
  
  addReview: async (productId: string, data: { rating: number; comment: string }) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to add review')
    }
    
    return response.json()
  },
  
  markReviewHelpful: async (productId: string, reviewId: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews/${reviewId}/helpful`, {
      method: 'POST',
    })
    
    if (!response.ok) {
      throw new Error('Failed to mark review as helpful')
    }
    
    return response.json()
  },
}

// Auth API
export const authApi = {
  login: async (username: string, password: string) => {
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
    
    return response.json()
  },
  
  register: async (data: { username: string; email: string; password: string; name: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }
    
    return response.json()
  },
  
  logout: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
    })
    
    if (!response.ok) {
      throw new Error('Logout failed')
    }
    
    return response.json()
  },
  
  refreshToken: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
    })
    
    if (!response.ok) {
      throw new Error('Token refresh failed')
    }
    
    return response.json()
  },
}

// Cart API
export const cartApi = {
  getCart: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/cart`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch cart')
    }
    
    return response.json()
  },
  
  addToCart: async (productId: string, quantity: number = 1) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/cart`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to add to cart')
    }
    
    return response.json()
  },
  
  updateCartItem: async (id: string, quantity: number) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update cart item')
    }
    
    return response.json()
  },
  
  removeFromCart: async (id: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/cart/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to remove from cart')
    }
    
    return response.json()
  },
  
  clearCart: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to clear cart')
    }
    
    return response.json()
  },
}

// Orders API
export const ordersApi = {
  createOrder: async (data: {
    shippingAddress: {
      firstName: string
      lastName: string
      email: string
      phone: string
      address: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/orders`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create order')
    }
    
    return response.json()
  },
  
  getOrders: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/orders`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch orders')
    }
    
    return response.json()
  },
  
  getOrder: async (id: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/orders/${id}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch order')
    }
    
    return response.json()
  },
  
  updateOrderStatus: async (id: string, status: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update order status')
    }
    
    return response.json()
  },
}

// Users API
export const usersApi = {
  getProfile: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/profile`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile')
    }
    
    return response.json()
  },
  
  updateProfile: async (data: { name?: string; email?: string; photoURL?: string }) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update profile')
    }
    
    return response.json()
  },
  
  getAddresses: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/addresses`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch addresses')
    }
    
    return response.json()
  },
  
  addAddress: async (data: {
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    isDefault: boolean
  }) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/addresses`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to add address')
    }
    
    return response.json()
  },
  
  updateAddress: async (id: string, data: Partial<{
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    isDefault: boolean
  }>) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update address')
    }
    
    return response.json()
  },
  
  deleteAddress: async (id: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/addresses/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete address')
    }
    
    return response.json()
  },
}

// Favorites API
export const favoritesApi = {
  getFavorites: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/favorites`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch favorites')
    }
    
    return response.json()
  },
  
  addToFavorites: async (productId: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/favorites/${productId}`, {
      method: 'POST',
    })
    
    if (!response.ok) {
      throw new Error('Failed to add to favorites')
    }
    
    return response.json()
  },
  
  removeFromFavorites: async (productId: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/favorites/${productId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to remove from favorites')
    }
    
    return response.json()
  },
  
  checkFavorite: async (productId: string) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/favorites/check/${productId}`)
    
    if (!response.ok) {
      throw new Error('Failed to check favorite status')
    }
    
    return response.json()
  },
}
