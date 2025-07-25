import { PrismaClient } from '@prisma/client';
import { FirebaseScrypt } from 'firebase-scrypt';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

const firebaseHashingParams = {
  memCost: 14,
  rounds: 8,
  saltSeparator: 'Bw==',
  signerKey: 'gdShl9G7k68tQK/PsKz6bExGdaQ2l0/w6LXWoEjpWxAjn/bYGoSZXz2byS9hTi57iMwX65iLUaHdySmIhwOB4w==',
};

const scrypt = new FirebaseScrypt(firebaseHashingParams);

async function main() {
  // 1. Set your admin's email and password
  const email = 'leroy.dave+admin@gmail.com';
  const password = 'chestnw3gard';

  // 2. Generate a random salt
  const passwordSalt = crypto.randomBytes(16).toString('base64');

  // 3. Hash the password
  const passwordHash = await scrypt.hash(password, passwordSalt);

  // 4. Create or upsert the user
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      passwordSalt,
      emailVerified: true,
      lastLogin: new Date(),
    },
  });

  // 5. Find the school you want to add the admin to
  const school = await prisma.school.findFirst({
    where: { name: 'Los Gatos High School' }, // <-- Change this!
  });

  if (!school) {
    throw new Error('School not found');
  }

  // 6. Connect the user as an admin to the school
  await prisma.school.update({
    where: { id: school.id },
    data: {
      admins: { connect: { id: user.id } }
    }
  });

  console.log('Seeded admin user:', user.email, 'for school:', school.name);
  console.log('Password for this user:', password);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
