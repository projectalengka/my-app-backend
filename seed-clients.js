const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding clients...");

  const clientsToSeed = [
    {
      name: "MerchCo Studio",
      company: "MerchCo Studio",
      email: "orders@merchco.fiverr.com",
      phone: "+1 555 1234567",
      status: "Active",
      totalSpent: 12500000,
      lastContact: new Date('2026-05-10'),
      tags: ["Fiverr", "Merchandise", "T-Shirt"]
    },
    {
      name: "PrintPalace Pro",
      company: "PrintPalace Pro",
      email: "design@printpalace.fiverr.com",
      phone: "+1 555 2345678",
      status: "Active",
      totalSpent: 8900000,
      lastContact: new Date('2026-05-08'),
      tags: ["Fiverr", "Print-on-Demand"]
    },
    {
      name: "BrandForge Creative",
      company: "BrandForge Creative",
      email: "hello@brandforge.co",
      phone: "+1 555 3456789",
      status: "Active",
      totalSpent: 15600000,
      lastContact: new Date('2026-05-09'),
      tags: ["Behance", "Brand Identity", "Merchandise"]
    },
    {
      name: "ThreadTheory Labs",
      company: "ThreadTheory Labs",
      email: "projects@threadtheory.com",
      phone: "+1 555 4567890",
      status: "Active",
      totalSpent: 11200000,
      lastContact: new Date('2026-05-06'),
      tags: ["Dribbble", "Streetwear", "Apparel"]
    },
    {
      name: "VelvetInk Studio",
      company: "VelvetInk Studio",
      email: "orders@velvetink.fiverr.com",
      phone: "+1 555 5678901",
      status: "Lead",
      totalSpent: 0,
      lastContact: new Date('2026-05-11'),
      tags: ["Fiverr", "Apparel Design"]
    },
    {
      name: "MerchMotion",
      company: "MerchMotion",
      email: "design@merchmotion.design",
      phone: "+1 555 6789012",
      status: "Active",
      totalSpent: 7800000,
      lastContact: new Date('2026-05-05'),
      tags: ["Dribbble", "Merchandise", "Illustration"]
    },
    {
      name: "InkRepublic Studio",
      company: "InkRepublic Studio",
      email: "briefs@inkrepublic.behance.net",
      phone: "+1 555 7890123",
      status: "Active",
      totalSpent: 18900000,
      lastContact: new Date('2026-05-07'),
      tags: ["Behance", "Fashion", "Merchandise"]
    },
    {
      name: "DropShip Tees Co",
      company: "DropShip Tees Co",
      email: "orders@dropshipteeks.fiverr.com",
      phone: "+1 555 8901234",
      status: "Lead",
      totalSpent: 0,
      lastContact: new Date('2026-05-10'),
      tags: ["Fiverr", "Dropshipping", "T-Shirt"]
    },
    {
      name: "ArtisanThreads Studio",
      company: "ArtisanThreads Studio",
      email: "hello@artisanthreads.io",
      phone: "+1 555 9012345",
      status: "Active",
      totalSpent: 14300000,
      lastContact: new Date('2026-05-04'),
      tags: ["Behance", "Limited Edition", "Merchandise"]
    },
    {
      name: "StreetCanvas Collective",
      company: "StreetCanvas Collective",
      email: "design@streetcanvas.dribbble.com",
      phone: "+1 555 0123456",
      status: "Active",
      totalSpent: 9500000,
      lastContact: new Date('2026-05-09'),
      tags: ["Dribbble", "Streetwear", "Hoodie"]
    }
  ];

  for (const client of clientsToSeed) {
    const exists = await prisma.client.findUnique({
      where: { email: client.email }
    });

    if (!exists) {
      await prisma.client.create({
        data: client
      });
      console.log(`Created client: ${client.name} (${client.status})`);
    } else {
      await prisma.client.update({
        where: { email: client.email },
        data: client
      });
      console.log(`Updated client: ${client.name} (${client.status})`);
    }
  }

  console.log("Client seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
