"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Seeding database...");
    // Clean existing data
    await prisma.activityLog.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    // =============================================
    // USERS
    // =============================================
    const sarah = await prisma.user.create({
        data: { name: "Sarah Chen", email: "sarah@shaman.os", avatar: "https://i.pravatar.cc/150?u=sarah", role: "Ritual Master", points: 2400 },
    });
    const john = await prisma.user.create({
        data: { name: "John Rivera", email: "john@shaman.os", avatar: "https://i.pravatar.cc/150?u=john", role: "Invoker", points: 1800 },
    });
    const alex = await prisma.user.create({
        data: { name: "Alex Kim", email: "alex@shaman.os", avatar: "https://i.pravatar.cc/150?u=alex", role: "Spellcaster", points: 2100 },
    });
    const luna = await prisma.user.create({
        data: { name: "Luna Waves", email: "luna@shaman.os", avatar: "https://i.pravatar.cc/150?u=luna", role: "Dreamwalker", points: 1500 },
    });
    const guest = await prisma.user.create({
        data: { name: "Guest User", email: "guest@shaman.os", avatar: "https://i.pravatar.cc/150?u=guest", role: "Observer", points: 100 },
    });
    console.log("✅ Users created");
    // =============================================
    // PROJECTS
    // =============================================
    const p1 = await prisma.project.create({
        data: { name: "Brand Redesign 2025", status: "Active", summary: "Complete rebrand for client X", deadline: new Date("2025-08-15") },
    });
    const p2 = await prisma.project.create({
        data: { name: "Mobile App UI", status: "Active", summary: "UI/UX for fintech app", deadline: new Date("2025-07-01") },
    });
    const p3 = await prisma.project.create({
        data: { name: "Marketing Campaign", status: "Active", summary: "Q3 social media campaign", deadline: new Date("2025-06-20") },
    });
    const p4 = await prisma.project.create({
        data: { name: "Website Revamp", status: "Completed", summary: "Corporate website redesign" },
    });
    console.log("✅ Projects created");
    // =============================================
    // TASKS
    // =============================================
    await prisma.task.createMany({
        data: [
            { title: "Design Logo Concepts", status: "IN_PROGRESS", priority: "High", points: 30, deadline: new Date("2025-07-01"), tags: ["design", "logo"], projectId: p1.id, assigneeId: alex.id },
            { title: "Create Style Guide", status: "TODO", priority: "Medium", points: 20, deadline: new Date("2025-07-10"), tags: ["design"], projectId: p1.id, assigneeId: alex.id },
            { title: "Brand Color Palette", status: "TODO", priority: "High", points: 15, deadline: new Date("2025-07-05"), tags: ["design", "colors"], projectId: p1.id, assigneeId: luna.id },
            { title: "User Research", status: "DONE", priority: "High", points: 25, deadline: new Date("2025-06-15"), tags: ["research"], projectId: p2.id, assigneeId: luna.id },
            { title: "Wireframe Dashboard", status: "REVIEW", priority: "Urgent", points: 35, deadline: new Date("2025-06-25"), tags: ["wireframe"], projectId: p2.id, assigneeId: alex.id },
            { title: "Prototype Navigation", status: "IN_PROGRESS", priority: "Medium", points: 20, deadline: new Date("2025-06-28"), tags: ["prototype"], projectId: p2.id, assigneeId: alex.id },
            { title: "Social Media Assets", status: "IN_PROGRESS", priority: "Medium", points: 15, deadline: new Date("2025-06-18"), tags: ["social"], projectId: p3.id, assigneeId: john.id },
            { title: "Campaign Strategy", status: "TODO", priority: "High", points: 20, deadline: new Date("2025-06-22"), tags: ["strategy"], projectId: p3.id, assigneeId: sarah.id },
            { title: "Ad Copy Writing", status: "TODO", priority: "Low", points: 10, deadline: new Date("2025-06-30"), tags: ["copy"], projectId: p3.id, assigneeId: john.id },
            { title: "Final Presentation", status: "DONE", priority: "High", points: 25, deadline: new Date("2025-05-30"), tags: ["presentation"], projectId: p4.id, assigneeId: sarah.id },
        ],
    });
    console.log("✅ Tasks created");
    // =============================================
    // TRANSACTIONS
    // =============================================
    await prisma.transaction.createMany({
        data: [
            { type: "income", amount: 5000, status: "Completed", description: "Brand Redesign - Phase 1", userId: sarah.id },
            { type: "income", amount: 3500, status: "Pending", description: "Mobile App - Deposit", userId: sarah.id },
            { type: "expense", amount: 800, status: "Completed", description: "Stock Photos License", userId: john.id },
            { type: "income", amount: 2500, status: "Completed", description: "Marketing Campaign Fee", userId: sarah.id },
            { type: "expense", amount: 1200, status: "Completed", description: "Software Licenses", userId: sarah.id },
            { type: "income", amount: 4000, status: "Completed", description: "Website Revamp - Final", userId: sarah.id },
        ],
    });
    console.log("✅ Transactions created");
    // =============================================
    // ACTIVITY LOGS
    // =============================================
    await prisma.activityLog.createMany({
        data: [
            { action: "Task Updated", category: "Task", details: "Logo Concepts moved to In Progress", userId: alex.id },
            { action: "Payment Received", category: "Finance", details: "$5,000 from Brand Redesign", userId: sarah.id },
            { action: "Login Detected", category: "Security", details: "New login from Chrome/Windows", userId: sarah.id },
            { action: "Project Created", category: "Project", details: "Marketing Campaign added", userId: sarah.id },
            { action: "Member Invited", category: "Team", details: "Luna Waves joined the team", userId: sarah.id },
            { action: "Task Completed", category: "Task", details: "User Research marked as Done", userId: luna.id },
            { action: "Invoice Sent", category: "Finance", details: "INV-002 sent to TechStart Inc", userId: john.id },
        ],
    });
    console.log("✅ Activity Logs created");
    console.log("🎉 Seeding completed!");
}
main()
    .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
