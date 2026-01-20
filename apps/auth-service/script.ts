import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client' // Import directly from generated location

const connectionString = process.env.AUTH_DATABASE_URL || process.env.DATABASE_URL
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Connecting to:', connectionString);
  // Create a new user with a post
  try {
    const user = await prisma.user.create({
      data: {
        name: 'Alice',
        email: `alice${Date.now()}@prisma.io`,
        posts: {
          create: {
            title: 'Hello World',
            content: 'This is my first post!',
            published: true,
          },
        },
      },
      include: {
        posts: true,
      },
    })
    console.log('Created user:', user)

    // Fetch all users with their posts
    const allUsers = await prisma.user.findMany({
      include: {
        posts: true,
      },
    })
    console.log('All users count:', allUsers.length)
  } catch (e) {
    console.error('Error during query:', e)
    throw e
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
