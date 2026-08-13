import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

async function main() {
  console.log('🔍 DATABASE_URL saat ini:', process.env.DATABASE_URL);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.user.upsert({
      where: { email: 'admin@roomis.com' },
      update: {},
      create: {
        email: 'admin@roomis.com',
        password: await bcrypt.hash('12345678', 10),
        name: 'Admin Logistik',
        role: 'ADMIN',
      },
    });

    await prisma.asset.upsert({
      where: { id: 'asset-test-001' },
      update: {},
      create: {
        id: 'asset-test-001',
        name: 'Lab Komputer A',
        description: 'Ruangan ber-AC kapasitas 40 orang',
        category: 'ROOM',
      },
    });

    console.log('✅ Seed berhasil!');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error('Terjadi kesalahan saat seed:', e);
  process.exit(1);
});
