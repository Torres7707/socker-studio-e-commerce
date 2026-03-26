export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Nordic Wool Throw',
    description: 'Hand-woven pure new wool blanket in soft grey tones. Perfect for cozy evenings.',
    price: 189,
    originalPrice: 229,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    category: 'Home Textiles',
    rating: 4.8,
    reviews: 124,
    inStock: true,
  },
  {
    id: '2',
    name: 'Minimalist Ceramic Vase',
    description: 'Handcrafted stoneware vase with matte finish. Simple, elegant design.',
    price: 65,
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400&h=400&fit=crop',
    category: 'Decor',
    rating: 4.9,
    reviews: 89,
    inStock: true,
  },
  {
    id: '3',
    name: 'Oak Dining Chair',
    description: 'Solid oak wood chair with natural finish. Ergonomic design meets Scandinavian simplicity.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop',
    category: 'Furniture',
    rating: 4.7,
    reviews: 56,
    inStock: true,
  },
  {
    id: '4',
    name: 'Linen Cushion Cover',
    description: '100% washed linen cushion cover. Available in natural earth tones.',
    price: 45,
    originalPrice: 59,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop',
    category: 'Home Textiles',
    rating: 4.6,
    reviews: 203,
    inStock: true,
  },
  {
    id: '5',
    name: 'Pendant Lamp " Aurora"',
    description: 'Nordic-inspired pendant light with soft, diffused glow. Powder-coated steel.',
    price: 159,
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop',
    category: 'Lighting',
    rating: 4.8,
    reviews: 67,
    inStock: true,
  },
  {
    id: '6',
    name: 'Handwoven Basket Set',
    description: 'Set of 3 seagrass baskets. Perfect for storage or planters.',
    price: 79,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop',
    category: 'Storage',
    rating: 4.5,
    reviews: 145,
    inStock: false,
  },
  {
    id: '7',
    name: 'Merino Wool Pillow',
    description: 'Luxuriously soft merino wool pillow. Natural temperature regulation.',
    price: 89,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop',
    category: 'Home Textiles',
    rating: 4.9,
    reviews: 98,
    inStock: true,
  },
  {
    id: '8',
    name: 'Floating Wall Shelf',
    description: 'Minimalist floating shelf in solid ash wood. Invisible mounting system.',
    price: 55,
    image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&h=400&fit=crop',
    category: 'Furniture',
    rating: 4.4,
    reviews: 178,
    inStock: true,
  },
]

export const categories = [
  'All',
  'Home Textiles',
  'Furniture',
  'Lighting',
  'Decor',
  'Storage',
]
