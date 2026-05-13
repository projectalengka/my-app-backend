const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding test projects...");

  // Get Sarah (Ritual Master) - the creator
  const sarah = await prisma.user.findUnique({
    where: { email: "sarah@shaman.os" }
  });

  // Get Alex (Designer) - the assignee
  const alex = await prisma.user.findUnique({
    where: { email: "alex@shaman.os" }
  });

  if (!sarah) {
    console.log("Sarah (Ritual Master) not found. Please run seed-users.js first.");
    return;
  }

  if (!alex) {
    console.log("Alex (Designer) not found. Please run seed-users.js first.");
    return;
  }

  console.log(`Creating projects as ${sarah.name}...`);
  console.log(`Designer assignee: ${alex.name} (${alex.id})`);

  const projectsData = [
    {
      name: "Brand Identity - Coffee Shop",
      description: "Complete brand identity design for a new coffee shop including logo, color palette, and brand guidelines.",
      summary: "Modern coffee shop branding",
      category: "Branding",
      status: "Active",
      leadId: sarah.id,
      designerIds: [alex.id],
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      name: "Website Redesign - Tech Startup",
      description: "Complete redesign of corporate website with modern UI/UX. Includes landing page, about us, services, and contact pages.",
      summary: "Corporate website redesign",
      category: "Web Design",
      status: "Active",
      leadId: sarah.id,
      designerIds: [alex.id],
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      name: "Social Media Kit - Fashion Brand",
      description: "Social media templates and assets for a fashion brand Instagram and Facebook accounts.",
      summary: "Social media templates",
      category: "Social Media",
      status: "Active",
      leadId: sarah.id,
      designerIds: [alex.id],
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      name: "Packaging Design - Organic Products",
      description: "Packaging design for organic food products including labels, boxes, and marketing materials.",
      summary: "Organic food packaging",
      category: "Packaging",
      status: "Active",
      leadId: sarah.id,
      designerIds: [alex.id],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      name: "Logo Design - Fitness App",
      description: "Modern and dynamic logo design for a fitness mobile application.",
      summary: "Fitness app logo",
      category: "Logo",
      status: "Archived",
      leadId: sarah.id,
      designerIds: [alex.id],
      deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  for (const projectData of projectsData) {
    const existing = await prisma.project.findFirst({
      where: { name: projectData.name }
    });

    if (!existing) {
      await prisma.project.create({
        data: projectData
      });
      console.log(`✅ Created: ${projectData.name} (${projectData.status})`);
    } else {
      console.log(`⚠️ Already exists: ${projectData.name}`);
    }
  }

  console.log("\n✅ Seed complete!");
  console.log("Now login as Alex (Designer) to see assigned projects on dashboard.");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());