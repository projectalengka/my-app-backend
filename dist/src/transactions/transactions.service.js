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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TransactionsService = class TransactionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.transaction.findMany({
            include: {
                user: true,
                project: true,
                invoice: {
                    include: { client: true },
                },
            },
            orderBy: { date: "desc" },
        });
    }
    async findById(id) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                user: true,
                project: true,
                invoice: {
                    include: { client: true },
                },
            },
        });
        if (!transaction) {
            throw new common_1.NotFoundException("Transaction not found");
        }
        return transaction;
    }
    async findByProjectId(projectId) {
        return this.prisma.transaction.findMany({
            where: { projectId },
            include: { user: true, project: true, invoice: true },
            orderBy: { date: "desc" },
        });
    }
    async findByType(type) {
        return this.prisma.transaction.findMany({
            where: {
                type,
                status: "Completed",
            },
            include: { user: true, project: true },
            orderBy: { date: "desc" },
        });
    }
    async findByCategory(category) {
        return this.prisma.transaction.findMany({
            where: { category },
            include: { user: true, project: true },
            orderBy: { date: "desc" },
        });
    }
    async create(data) {
        if (!data.userId?.trim()) {
            throw new common_1.BadRequestException("User ID is required for transactions");
        }
        const validTypes = ["income", "expense"];
        const validStatuses = ["Completed", "Pending", "Cancelled"];
        if (!validTypes.includes(data.type)) {
            throw new common_1.BadRequestException(`Invalid type. Must be: ${validTypes.join(", ")}`);
        }
        const amount = Number(data.amount);
        if (isNaN(amount) || amount <= 0) {
            throw new common_1.BadRequestException("Amount must be a positive number");
        }
        if (!validStatuses.includes(data.status)) {
            throw new common_1.BadRequestException(`Invalid status. Must be: ${validStatuses.join(", ")}`);
        }
        const transaction = await this.prisma.transaction.create({
            data: {
                type: data.type,
                amount,
                status: data.status,
                description: data.description,
                userId: data.userId,
                category: data.category,
                paymentMethod: data.paymentMethod,
                date: data.date ? new Date(data.date) : new Date(),
                relatedId: data.relatedId,
                projectId: data.projectId,
                invoiceId: data.invoiceId,
                attachmentUrl: data.attachmentUrl,
            },
            include: { user: true, project: true, invoice: true },
        });
        if (data.projectId && data.status === "Completed") {
            await this.updateProjectBudget(data.projectId);
        }
        return transaction;
    }
    async update(id, data) {
        const transaction = await this.findById(id);
        const updated = await this.prisma.transaction.update({
            where: { id },
            data: {
                type: data.type,
                amount: data.amount ? Number(data.amount) : undefined,
                status: data.status,
                description: data.description,
                category: data.category,
                paymentMethod: data.paymentMethod,
                date: data.date ? new Date(data.date) : undefined,
                projectId: data.projectId,
                invoiceId: data.invoiceId,
                attachmentUrl: data.attachmentUrl,
            },
            include: { user: true, project: true, invoice: true },
        });
        if ((data.projectId && data.projectId !== transaction.projectId) ||
            (data.status && data.status !== transaction.status)) {
            const projectId = data.projectId || transaction.projectId;
            if (projectId) {
                await this.updateProjectBudget(projectId);
            }
        }
        return updated;
    }
    async updateStatus(id, status) {
        const transaction = await this.findById(id);
        const validStatuses = ["Completed", "Pending", "Cancelled"];
        if (!validStatuses.includes(status)) {
            throw new common_1.BadRequestException(`Invalid status. Must be: ${validStatuses.join(", ")}`);
        }
        const updated = await this.prisma.transaction.update({
            where: { id },
            data: { status },
            include: { user: true, project: true, invoice: true },
        });
        if (transaction.projectId) {
            await this.updateProjectBudget(transaction.projectId);
        }
        return updated;
    }
    async delete(id) {
        const transaction = await this.findById(id);
        await this.prisma.transaction.delete({
            where: { id },
        });
        if (transaction.projectId) {
            await this.updateProjectBudget(transaction.projectId);
        }
        return { message: "Transaction deleted successfully", id };
    }
    async updateProjectBudget(projectId) {
        const budget = await this.prisma.budget.findUnique({
            where: { projectId },
        });
        if (!budget)
            return;
        const transactions = await this.prisma.transaction.findMany({
            where: {
                projectId,
                status: "Completed",
            },
        });
        const actualRevenue = transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
        const actualExpenses = transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);
        const usagePercentage = budget.plannedBudget > 0
            ? (actualExpenses / budget.plannedBudget) * 100
            : 0;
        let status = "Healthy";
        if (usagePercentage > 100) {
            status = "Over Budget";
        }
        else if (usagePercentage > 80) {
            status = "Warning";
        }
        await this.prisma.budget.update({
            where: { projectId },
            data: {
                actualRevenue,
                actualExpenses,
                status,
            },
        });
    }
    async getAnalytics() {
        const transactions = await this.prisma.transaction.findMany({
            where: { status: "Completed" },
        });
        const income = transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);
        const netProfit = income - expenses;
        const byCategory = {};
        transactions.forEach((t) => {
            if (t.category) {
                byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
            }
        });
        const monthlyData = {};
        transactions.forEach((t) => {
            const month = new Date(t.date).toISOString().substring(0, 7);
            if (!monthlyData[month]) {
                monthlyData[month] = { income: 0, expense: 0 };
            }
            if (t.type === "income") {
                monthlyData[month].income += t.amount;
            }
            else {
                monthlyData[month].expense += t.amount;
            }
        });
        return {
            totalIncome: income,
            totalExpenses: expenses,
            netProfit,
            profitMargin: income > 0 ? Math.round((netProfit / income) * 100) : 0,
            transactionCount: transactions.length,
            byCategory,
            monthlyData: Object.entries(monthlyData)
                .sort()
                .map(([month, data]) => ({ month, ...data })),
        };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map