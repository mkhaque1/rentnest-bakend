import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL']! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Seed admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@rentnest.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@rentnest.com',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('✔ Seeded admin user (admin@rentnest.com / admin123)');

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
