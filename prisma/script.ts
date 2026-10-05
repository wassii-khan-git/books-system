import bcrypt from 'bcryptjs'
import prisma from '../src/main/lib/prisma'

async function main(): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  const name = process.env.SEED_ADMIN_NAME || 'Bookstore Admin'

  if (!email || !password || password === 'CHANGE_ME_BEFORE_SEEDING') {
    throw new Error('Set SEED_ADMIN_EMAIL and a custom SEED_ADMIN_PASSWORD in .env before seeding.')
  }

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name, email, password: await bcrypt.hash(password, 12) }
  })
  console.log(`Administrator ready: ${email}. Existing accounts are left unchanged.`)
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
