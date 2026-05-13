const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Removing TODO and migrating to IN PROGRESS / REVIEW...");

  await prisma.task.updateMany({
    where: { status: 'TODO' },
    data: { status: 'IN PROGRESS / REVIEW' }
  });

  console.log("Status migration complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
