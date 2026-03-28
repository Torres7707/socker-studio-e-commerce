import { prisma } from './utils/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.favorite.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.shippingAddress.deleteMany()
  await prisma.order.deleteMany()
  await prisma.address.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Cleared existing data')

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
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
    }),
    prisma.product.create({
      data: {
        name: 'Minimalist Ceramic Vase',
        description: 'Handcrafted stoneware vase with matte finish. Simple, elegant design.',
        price: 65,
        image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400&h=400&fit=crop',
        category: 'Decor',
        rating: 4.9,
        reviews: 89,
        inStock: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Oak Dining Chair',
        description: 'Solid oak wood chair with natural finish. Ergonomic design meets Scandinavian simplicity.',
        price: 299,
        image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop',
        category: 'Furniture',
        rating: 4.7,
        reviews: 56,
        inStock: true,
      },
    }),
    prisma.product.create({
      data: {
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
    }),
    prisma.product.create({
      data: {
        name: 'Pendant Lamp "Aurora"',
        description: 'Nordic-inspired pendant light with soft, diffused glow. Powder-coated steel.',
        price: 159,
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop',
        category: 'Lighting',
        rating: 4.8,
        reviews: 67,
        inStock: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Handwoven Basket Set',
        description: 'Set of 3 seagrass baskets. Perfect for storage or planters.',
        price: 79,
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop',
        category: 'Storage',
        rating: 4.5,
        reviews: 145,
        inStock: false,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Merino Wool Pillow',
        description: 'Luxuriously soft merino wool pillow. Natural temperature regulation.',
        price: 89,
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop',
        category: 'Home Textiles',
        rating: 4.9,
        reviews: 98,
        inStock: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Floating Wall Shelf',
        description: 'Minimalist floating shelf in solid ash wood. Invisible mounting system.',
        price: 55,
        image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&h=400&fit=crop',
        category: 'Furniture',
        rating: 4.4,
        reviews: 178,
        inStock: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Scandinavian Coffee Table',
        description: 'Clean-lined coffee table in solid birch. Timeless Nordic design.',
        price: 349,
        image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&h=400&fit=crop',
        category: 'Furniture',
        rating: 4.7,
        reviews: 45,
        inStock: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cotton Waffle Blanket',
        description: 'Breathable waffle-weave cotton blanket. Perfect for summer nights.',
        price: 79,
        originalPrice: 99,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
        category: 'Home Textiles',
        rating: 4.6,
        reviews: 112,
        inStock: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Table Lamp "Hygge"',
        description: 'Warm ambient table lamp with linen shade. Creates cozy atmosphere.',
        price: 129,
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop',
        category: 'Lighting',
        rating: 4.8,
        reviews: 78,
        inStock: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Wooden Storage Box',
        description: 'Handcrafted pine storage box with lid. Natural finish.',
        price: 39,
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop',
        category: 'Storage',
        rating: 4.3,
        reviews: 89,
        inStock: true,
      },
    }),
  ])

  console.log(`✅ Created ${products.length} products`)

  // Create demo users
  const passwordHash = await bcrypt.hash('password123', 12)
  
  const demoUser = await prisma.user.create({
    data: {
      username: 'demo',
      email: 'demo@example.com',
      name: 'Demo User',
      passwordHash,
      provider: 'credentials',
    },
  })

  const testUser = await prisma.user.create({
    data: {
      username: 'testuser',
      email: 'test@example.com',
      name: 'Test User',
      passwordHash,
      provider: 'credentials',
    },
  })

  console.log(`✅ Created demo users: ${demoUser.name}, ${testUser.name}`)

  // Create sample reviews
  const sampleReviews = [
    { productId: products[0].id, userId: demoUser.id, userName: demoUser.name, rating: 5, comment: 'Absolutely love this blanket! So soft and warm.' },
    { productId: products[0].id, userId: testUser.id, userName: testUser.name, rating: 4, comment: 'Great quality, perfect for winter.' },
    { productId: products[1].id, userId: demoUser.id, userName: demoUser.name, rating: 5, comment: 'Beautiful vase, looks amazing in my living room.' },
    { productId: products[2].id, userId: testUser.id, userName: testUser.name, rating: 5, comment: 'Sturdy and comfortable. Highly recommend!' },
    { productId: products[3].id, userId: demoUser.id, userName: demoUser.name, rating: 4, comment: 'Nice quality linen, fits perfectly.' },
    { productId: products[4].id, userId: testUser.id, userName: testUser.name, rating: 5, comment: 'Creates the perfect ambiance in my dining room.' },
  ]

  for (const review of sampleReviews) {
    await prisma.review.create({ data: review })
  }

  console.log(`✅ Created ${sampleReviews.length} sample reviews`)

  // Create sample addresses
  await prisma.address.create({
    data: {
      userId: demoUser.id,
      name: 'Home',
      street: '123 Nordic Street',
      city: 'Stockholm',
      state: 'Stockholm',
      zipCode: '11122',
      country: 'Sweden',
      isDefault: true,
    },
  })

  console.log('✅ Created sample address')

  // Create sample favorites
  await prisma.favorite.create({
    data: {
      userId: demoUser.id,
      productId: products[0].id,
    },
  })
  await prisma.favorite.create({
    data: {
      userId: demoUser.id,
      productId: products[2].id,
    },
  })

  console.log('✅ Created sample favorites')

  // Create sample cart items
  await prisma.cartItem.create({
    data: {
      userId: demoUser.id,
      productId: products[1].id,
      quantity: 1,
    },
  })
  await prisma.cartItem.create({
    data: {
      userId: demoUser.id,
      productId: products[3].id,
      quantity: 2,
    },
  })

  console.log('✅ Created sample cart items')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
