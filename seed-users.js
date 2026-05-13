const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  console.log("Seeding users...");

  const password = await bcrypt.hash('123', 10);

  const usersToSeed = [
    // 2 Ritual Masters
    {
      name: "Sarah Putri Anggraini",
      email: "ritualmaster@shmn.os",
      role: "Ritual Master",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      points: 2400
    },
    {
      name: "Rizki Ramadhan",
      email: "ritualmaster2@shmn.os",
      role: "Ritual Master",
      avatar: "https://i.pravatar.cc/150?u=rizki",
      points: 1850
    },
    // 1 Invoker
    {
      name: "Budi Santoso",
      email: "invoker@shmn.os",
      role: "Invoker",
      avatar: "https://i.pravatar.cc/150?u=budi",
      points: 1200
    },
    // 6 Designers
    {
      name: "Alexandro Wijaya",
      email: "designer@shmn.os",
      role: "Designer",
      avatar: "https://i.pravatar.cc/150?u=alex",
      points: 980
    },
    {
      name: "Maya Kusumawati",
      email: "designer2@shmn.os",
      role: "Designer",
      avatar: "https://i.pravatar.cc/150?u=maya",
      points: 720
    },
    {
      name: "Fajar Nugroho",
      email: "designer3@shmn.os",
      role: "Designer",
      avatar: "https://i.pravatar.cc/150?u=fajar",
      points: 650
    },
    {
      name: "Dewi Lestari",
      email: "designer4@shmn.os",
      role: "Designer",
      avatar: "https://i.pravatar.cc/150?u=dewi",
      points: 540
    },
    {
      name: "Rendra Prasetyo",
      email: "designer5@shmn.os",
      role: "Designer",
      avatar: "https://i.pravatar.cc/150?u=rendra",
      points: 430
    },
    {
      name: "Anisa Rahmawati",
      email: "designer6@shmn.os",
      role: "Designer",
      avatar: "https://i.pravatar.cc/150?u=anisa",
      points: 380
    },
    // 2 Dream Walkers
    {
      name: "Luna Cantika",
      email: "dreamwalker@shmn.os",
      role: "Dream Walker",
      avatar: "https://i.pravatar.cc/150?u=luna",
      points: 890
    },
    {
      name: "Kavin Arkaan",
      email: "dreamwalker2@shmn.os",
      role: "Dream Walker",
      avatar: "https://i.pravatar.cc/150?u=kavin",
      points: 760
    },
    // 1 Observer
    {
      name: "Guru Guest",
      email: "observer@shmn.os",
      role: "Observer",
      avatar: "https://i.pravatar.cc/150?u=guest",
      points: 50
    }
  ];

  for (const user of usersToSeed) {
    const exists = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (!exists) {
      await prisma.user.create({
        data: {
          ...user,
          password: password
        }
      });
      console.log(`Created user: ${user.email} (${user.role})`);
    } else {
      await prisma.user.update({
        where: { email: user.email },
        data: {
          ...user,
          password: password
        }
      });
      console.log(`Updated user: ${user.email} (${user.role})`);
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
