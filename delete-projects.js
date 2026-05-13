const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Deleting all projects...");
  const result = await prisma.project.deleteMany();
  console.log(`Deleted ${result.count} projects`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => console.error(e));
