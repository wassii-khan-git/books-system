import prisma from '../src/main/lib/prisma'

async function main(): Promise<void> {
  // Create a new user with a
  const user = await prisma.user.create({
    data: {
      name: 'Shredded Union',
      email: 'developer@gmail.com',
      password: '$2a$12$i9LRleJbKfM3ypNEtX82XOuO6IGftqd/EXWWLraD5DmKBRhxie2G2'
    }
  })
  console.log('Created user:', user)

  // seed 20 categories record
  for (let i = 0; i < 20; i++) {
    await prisma.category.create({
      data: {
        title: `Category ${i + 1}`,
        description: `Description for category ${i + 1}`
      }
    })
  }

  // Fetch all users with their
  const allUsers = await prisma.user.findMany()
  console.log('All users:', JSON.stringify(allUsers, null, 2))
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
