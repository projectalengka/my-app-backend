"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InvoicesService = class InvoicesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.invoice.findMany({
            include: {
                client: true,
                project: true,
                items: true,
                transactions: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }
    async findById(id) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
            include: {
                client: true,
                project: true,
                items: true,
                transactions: true,
            },
        });
        if (!invoice) {
            throw new common_1.NotFoundException("Invoice not found");
        }
        return invoice;
    }
    async findByClientId(clientId) {
        return this.prisma.invoice.findMany({
            where: { clientId },
            include: {
                items: true,
                transactions: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }
    async findByProjectId(projectId) {
        return this.prisma.invoice.findMany({
            where: { projectId },
            include: {
                client: true,
                items: true,
                transactions: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }
    async create(data) {
        if (!data.invoiceNumber?.trim()) {
            throw new common_1.BadRequestException("Invoice number is required");
        }
        const status = data.status ?? "Draft";
        const invoice = await this.prisma.$transaction(async (tx) => {
            const existing = await tx.invoice.findUnique({
                where: { invoiceNumber: data.invoiceNumber },
            });
            if (existing) {
                throw new common_1.BadRequestException("Invoice number already exists");
            }
            return tx.invoice.create({
                data: {
                    invoiceNumber: data.invoiceNumber,
                    clientId: data.clientId,
                    projectId: data.projectId,
                    issueDate: new Date(data.issueDate),
                    dueDate: new Date(data.dueDate),
                    subtotal: Number(data.subtotal),
                    tax: Number(data.tax ?? 0),
                    total: Number(data.total ?? data.subtotal ?? 0),
                    currency: data.currency ?? "USD",
                    notes: data.notes,
                    paymentTerms: data.paymentTerms,
                    reminder: data.reminder ?? true,
                    status,
                    items: {
                        create: (data.items ?? []).map((item) => ({
                            name: item.name,
                            quantity: Number(item.quantity),
                            unitPrice: Number(item.unitPrice),
                            total: Number(item.total),
                        })),
                    },
                },
                include: {
                    client: true,
                    project: true,
                    items: true,
                },
            });
        });
        return invoice;
    }
    async update(id, data) {
        const invoice = await this.findById(id);
        if (data.invoiceNumber && data.invoiceNumber !== invoice.invoiceNumber) {
            const existing = await this.prisma.invoice.findUnique({
                where: { invoiceNumber: data.invoiceNumber },
            });
            if (existing) {
                throw new common_1.BadRequestException("Invoice number already exists");
            }
        }
        const { items, ...invoiceData } = data;
        const updated = await this.prisma.invoice.update({
            where: { id },
            data: {
                invoiceNumber: invoiceData.invoiceNumber,
                clientId: invoiceData.clientId,
                projectId: invoiceData.projectId,
                issueDate: invoiceData.issueDate ? new Date(invoiceData.issueDate) : undefined,
                dueDate: invoiceData.dueDate ? new Date(invoiceData.dueDate) : undefined,
                subtotal: invoiceData.subtotal !== undefined ? Number(invoiceData.subtotal) : undefined,
                tax: invoiceData.tax !== undefined ? Number(invoiceData.tax) : undefined,
                total: invoiceData.total !== undefined ? Number(invoiceData.total) : undefined,
                notes: invoiceData.notes,
                paymentTerms: invoiceData.paymentTerms,
                reminder: invoiceData.reminder,
                status: invoiceData.status,
                ...(items
                    ? {
                        items: {
                            deleteMany: {},
                            create: items.map((item) => ({
                                name: item.name,
                                quantity: Number(item.quantity),
                                unitPrice: Number(item.unitPrice),
                                total: Number(item.total),
                            })),
                        },
                    }
                    : {}),
            },
            include: {
                client: true,
                project: true,
                items: true,
            },
        });
        return updated;
    }
    async updateStatus(id, status) {
        const validStatuses = [
            "Draft",
            "Sent",
            "Viewed",
            "Pending",
            "Paid",
            "Overdue",
            "Cancelled",
        ];
        if (!validStatuses.includes(status)) {
            throw new common_1.BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
        }
        const invoice = await this.findById(id);
        const allowedTransitions = {
            Draft: ["Sent", "Cancelled"],
            Sent: ["Viewed", "Pending", "Cancelled"],
            Viewed: ["Pending", "Cancelled"],
            Pending: ["Paid", "Overdue", "Cancelled"],
            Paid: [],
            Overdue: ["Pending", "Paid", "Cancelled"],
            Cancelled: [],
        };
        if (status !== invoice.status && !allowedTransitions[invoice.status]?.includes(status)) {
            throw new common_1.BadRequestException(`Cannot transition from "${invoice.status}" to "${status}". Allowed: ${allowedTransitions[invoice.status]?.join(", ") || "none"}.`);
        }
        const updated = await this.prisma.invoice.update({
            where: { id },
            data: { status },
            include: {
                client: true,
                project: true,
                items: true,
            },
        });
        if (status === "Overdue") {
            const user = await this.prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
            if (user) {
                await this.prisma.notification.create({
                    data: {
                        userId: user.id,
                        type: "SYSTEM",
                        title: "Overdue invoice",
                        message: `${updated.invoiceNumber} is overdue and needs follow-up.`,
                        link: "/finance",
                    },
                });
            }
        }
        return updated;
    }
    async markAsPaid(id, transactionId, userId) {
        const invoice = await this.findById(id);
        const updated = await this.prisma.invoice.update({
            where: { id },
            data: { status: "Paid" },
            include: {
                client: true,
                project: true,
                items: true,
            },
        });
        // If transaction ID provided, link it
        if (transactionId) {
            await this.prisma.transaction.update({
                where: { id: transactionId },
                data: { invoiceId: id },
            });
        }
        else {
            const existingTransaction = await this.prisma.transaction.findFirst({
                where: { invoiceId: id, type: "income" },
            });
            const fallbackUser = userId ??
                (await this.prisma.user.findFirst({
                    orderBy: { createdAt: "asc" },
                }))?.id;
            if (!existingTransaction && fallbackUser) {
                await this.prisma.transaction.create({
                    data: {
                        type: "income",
                        amount: invoice.total,
                        status: "Completed",
                        description: `Invoice paid: ${invoice.invoiceNumber}`,
                        userId: fallbackUser,
                        category: "Project Payment",
                        paymentMethod: "bank transfer",
                        date: new Date(),
                        projectId: invoice.projectId,
                        invoiceId: id,
                    },
                });
                if (invoice.projectId) {
                    await this.syncProjectBudget(invoice.projectId);
                }
            }
        }
        return updated;
    }
    async syncProjectBudget(projectId) {
        const budget = await this.prisma.budget.findUnique({ where: { projectId } });
        if (!budget)
            return;
        const transactions = await this.prisma.transaction.findMany({
            where: { projectId, status: "Completed" },
        });
        const actualRevenue = transactions
            .filter((transaction) => transaction.type === "income")
            .reduce((sum, transaction) => sum + transaction.amount, 0);
        const actualExpenses = transactions
            .filter((transaction) => transaction.type === "expense")
            .reduce((sum, transaction) => sum + transaction.amount, 0);
        const usagePercentage = budget.plannedBudget ? (actualExpenses / budget.plannedBudget) * 100 : 0;
        const status = usagePercentage > 100
            ? "Over Budget"
            : usagePercentage > 80
                ? "Warning"
                : "Healthy";
        await this.prisma.budget.update({
            where: { projectId },
            data: { actualRevenue, actualExpenses, status },
        });
    }
    async delete(id) {
        const invoice = await this.findById(id);
        await this.prisma.invoice.delete({
            where: { id },
        });
        return { message: "Invoice deleted successfully", id };
    }
    async duplicate(id) {
        const invoice = await this.findById(id);
        const newInvoiceNumber = `${invoice.invoiceNumber}-COPY-${Date.now().toString().slice(-6)}`;
        const duplicated = await this.prisma.invoice.create({
            data: {
                invoiceNumber: newInvoiceNumber,
                clientId: invoice.clientId,
                projectId: invoice.projectId,
                issueDate: new Date(),
                dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
                subtotal: invoice.subtotal,
                tax: invoice.tax,
                total: invoice.total,
                notes: invoice.notes,
                paymentTerms: invoice.paymentTerms,
                status: "Draft",
                items: {
                    create: invoice.items.map((item) => ({
                        name: item.name,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        total: item.total,
                    })),
                },
            },
            include: {
                client: true,
                project: true,
                items: true,
            },
        });
        return duplicated;
    }
    async getAnalytics() {
        const invoices = await this.prisma.invoice.findMany({
            include: { items: true },
        });
        const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const paidInvoices = invoices.filter((inv) => inv.status === "Paid");
        const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
        const pendingInvoices = invoices.filter((inv) => ["Pending", "Sent", "Viewed"].includes(inv.status));
        const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0);
        const overdueInvoices = invoices.filter((inv) => inv.status === "Overdue");
        const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);
        return {
            totalInvoiced,
            totalPaid,
            totalPending,
            totalOverdue,
            invoiceCount: invoices.length,
            paidCount: paidInvoices.length,
            pendingCount: pendingInvoices.length,
            overdueCount: overdueInvoices.length,
            unpaidRatio: invoices.length > 0
                ? Math.round(((pendingInvoices.length + overdueInvoices.length) /
                    invoices.length) *
                    100)
                : 0,
        };
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvoicesService);
