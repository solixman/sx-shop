// prisma/script.ts
import "dotenv/config";
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🌱 Starting seeding script...')

  // 1️⃣ Test database connection
  try {
    await prisma.$queryRaw`SELECT 1;`
    console.log('✅ Database connection OK')
  } catch (err) {
    console.error('❌ Cannot connect to the database:', err)
    process.exit(1)
  }

  // 2️⃣ Prepare product items for the order
  const itemsData = [
    { productId: 101, name: 'Wireless Mouse', price: 25.99, quantity: 2 },
    { productId: 102, name: 'Mechanical Keyboard', price: 79.99, quantity: 1 },
  ]

  // Compute subtotal for each item
  const itemsWithSubtotal = itemsData.map(item => ({
    ...item,
    subtotal: item.price * item.quantity,
  }))

  // Compute total order price
  const totalPrice = itemsWithSubtotal.reduce((sum, item) => sum + item.subtotal, 0)

  // 3️⃣ Create a new order with product items
  const order = await prisma.order.create({
    data: {
      userId: 1, // replace with a valid user ID from Auth service
      status: 'PENDING',
      totalPrice,
      items: { create: itemsWithSubtotal },
    },
    include: { items: true },
  })

  console.log('✅ Created order:')
  console.dir(order, { depth: null })

  // 4️⃣ Fetch all orders with items
  const allOrders = await prisma.order.findMany({
    include: { items: true },
  })

  console.log('📦 All Orders:')
  console.dir(allOrders, { depth: null })
}

// Disconnect safely
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding data:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
