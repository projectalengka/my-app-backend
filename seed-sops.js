const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding SOPs/Grimoire...");

  const sopsData = [
    {
      title: "Project Briefing Guidelines",
      category: "Onboarding",
      content: `PROJECT BRIEFING GUIDELINES

Before starting any design project, ensure you have the following information:

1. CLIENT INFORMATION
   - Company name and logo
   - Brand guidelines (if any)
   - Target audience
   - Competitor analysis

2. PROJECT REQUIREMENTS
   - Deliverables list
   - Format specifications (size, resolution, color mode)
   - Deadline timeline
   - Budget constraints

3. COMMUNICATION
   - Primary contact person
   - Review cycle (usually 2-3 rounds)
   - Feedback format (written or video)

Remember: Always ask clarifying questions before starting to avoid revisions later.`,
    },
    {
      title: "File Naming Convention",
      category: "Technical",
      content: `STANDARD FILE NAMING CONVENTION

Use this format for all project files:

[Client]_[Project]_[Type]_[Version].[extension]

Examples:
- Nike_BrandRefresh_Logo_v1.ai
- Nike_BrandRefresh_Logo_v2.ai
- Nike_BrandRefresh_Banner_FB.ai

FOLDER STRUCTURE:
/ProjectName
  /01_Concepts
  /02_Working
  /03_Final
  /04_Export

Always keep working files organized and backed up!`,
    },
    {
      title: "Color Theory Basics",
      category: "Design",
      content: `COLOR THEORY ESSENTIALS

PRIMARY COLORS:
- Red, Blue, Yellow (cannot be created by mixing)

SECONDARY COLORS:
- Orange, Green, Violet (created by mixing two primaries)

TERTIARY COLORS:
- Created by mixing one primary + one secondary

COLOR HARMONY RULES:
1. Complementary: Opposite colors on wheel
2. Analogous: Adjacent colors
3. Triadic: Three colors equally spaced

TIPS:
- Use 60-30-10 rule (dominant, secondary, accent)
- Consider cultural meanings of colors
- Test in grayscale to check contrast`,
    },
    {
      title: "Typography Best Practices",
      category: "Design",
      content: `TYPOGRAPHY GUIDELINES

FONT PAIRING:
- One serif + one sans-serif
- Match x-heights for better pairing
- Limit to 2-3 fonts per project

HIERARCHY:
- Heading: Bold, larger size
- Body: Regular weight, readable size (16px minimum)
- Caption: Smaller, lighter

LINE HEIGHT:
- Headings: 1.2-1.3
- Body text: 1.5-1.6
- Good line height improves readability by 20%

LINE LENGTH:
- Ideal: 45-75 characters
- Too long = harder to read
- Too short = eye strain from frequent jumps`,
    },
    {
      title: "Revision Request Process",
      category: "Workflow",
      content: `REVISION WORKFLOW

1. RECEIVE FEEDBACK
   - Document all feedback in writing
   - Highlight specific changes needed
   - Note any conflicting feedback

2. CLARIFY DOUBTS
   - Ask questions immediately if unclear
   - Request reference examples if needed
   - Confirm deadline for revised version

3. IMPLEMENT CHANGES
   - Make changes systematically
   - Keep track of what was changed
   - Create new version, don't overwrite

4. SUBMIT REVISION
   - Preview before sending
   - Attach relevant files
   - Summarize changes made

5. WAIT FOR APPROVAL
   - Usually 1-2 business days
   - Don't start next project until approved`,
    },
  ];

  for (const sopData of sopsData) {
    const existing = await prisma.sOP.findFirst({
      where: { title: sopData.title }
    });

    if (!existing) {
      await prisma.sOP.create({
        data: {
          title: sopData.title,
          category: sopData.category,
          description: sopData.content,
        }
      });
      console.log(`✅ Created SOP: ${sopData.title}`);
    } else {
      console.log(`⚠️ Already exists: ${sopData.title}`);
    }
  }

  console.log("\n✅ SOP Seed complete!");
  console.log("Now check the Grimoire section in Team menu.");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());