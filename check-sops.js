const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Checking SOPs in database...");
  
  const sops = await prisma.sOP.findMany();
  console.log("Total SOPs:", sops.length);
  console.log(JSON.stringify(sops, null, 2));
  
  await prisma.$disconnect();
}

main().catch(console.error);