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
exports.BudgetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BudgetsService = class BudgetsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.budget.findMany({
            include: { project: true },
            orderBy: { createdAt: "desc" },
        });
    }
    async findById(id) {
        const budget = await this.prisma.budget.findUnique({
            where: { id },
            include: { project: true },
        });
        if (!budget) {
            throw new common_1.NotFoundException("Budget not found");
        }
        return budget;
    }
    async findByProjectId(projectId) {
        const budget = await this.prisma.budget.findUnique({
            where: { projectId },
            include: { project: true },
        });
        if (!budget) {
            throw new common_1.NotFoundException("Budget not found for project");
        }
        return budget;
    }
    async create(data) {
        if (!data.projectId?.trim()) {
            throw new common_1.BadRequestException("Project ID is required");
        }
        if (isNaN(data.plannedBudget) || data.plannedBudget <= 0) {
            throw new common_1.BadRequestException("Planned budget must be a positive number");
        }
        const project = await this.prisma.project.findUnique({
            where: { id: data.projectId },
        });
        if (!project) {
            throw new common_1.NotFoundException("Project not found");
        }
        const existingBudget = await this.prisma.budget.findUnique({
            where: { projectId: data.projectId },
        });
        if (existingBudget) {
            throw new common_1.BadRequestException("Budget already exists for this project");
        }
        return this.prisma.budget.create({
            data: {
                projectId: data.projectId,
                plannedBudget: data.plannedBudget,
                status: "Healthy",
            },
            include: { project: true },
        });
    }
    async update(id, data) {
        const budget = await this.findById(id);
        let status = budget.status;
        if (data.plannedBudget) {
            status = this.calculateStatus(budget.actualExpenses, data.plannedBudget || budget.plannedBudget);
        }
        return this.prisma.budget.update({
            where: { id },
            data: {
                plannedBudget: data.plannedBudget,
                status,
            },
            include: { project: true },
        });
    }
    async updateActuals(projectId) {
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
        const budget = await this.prisma.budget.findUnique({
            where: { projectId },
        });
        if (!budget) {
            throw new common_1.NotFoundException("Budget not found");
        }
        const status = this.calculateStatus(actualExpenses, budget.plannedBudget);
        return this.prisma.budget.update({
            where: { projectId },
            data: {
                actualRevenue,
                actualExpenses,
                status,
            },
            include: { project: true },
        });
    }
    async delete(id) {
        const budget = await this.findById(id);
        await this.prisma.budget.delete({
            where: { id },
        });
        return { message: "Budget deleted successfully", id };
    }
    calculateStatus(actualExpenses, plannedBudget) {
        const usagePercentage = (actualExpenses / plannedBudget) * 100;
        if (usagePercentage > 100) {
            return "Over Budget";
        }
        else if (usagePercentage > 80) {
            return "Warning";
        }
        else {
            return "Healthy";
        }
    }
    async getAnalytics() {
        const budgets = await this.prisma.budget.findMany({
            include: { project: true },
        });
        const totalPlanned = budgets.reduce((sum, b) => sum + b.plannedBudget, 0);
        const totalActualRevenue = budgets.reduce((sum, b) => sum + b.actualRevenue, 0);
        const totalActualExpenses = budgets.reduce((sum, b) => sum + b.actualExpenses, 0);
        const totalNetProfit = totalActualRevenue - totalActualExpenses;
        const healthyCount = budgets.filter((b) => b.status === "Healthy").length;
        const warningCount = budgets.filter((b) => b.status === "Warning").length;
        const overBudgetCount = budgets.filter((b) => b.status === "Over Budget").length;
        const remainingBudget = totalPlanned - totalActualExpenses;
        return {
            totalPlanned,
            totalActualRevenue,
            totalActualExpenses,
            totalNetProfit,
            remainingBudget,
            budgetCount: budgets.length,
            healthyCount,
            warningCount,
            overBudgetCount,
            budgets: budgets.map((b) => ({
                id: b.id,
                projectName: b.project.name,
                projectId: b.projectId,
                plannedBudget: b.plannedBudget,
                actualRevenue: b.actualRevenue,
                actualExpenses: b.actualExpenses,
                remainingBudget: b.plannedBudget - b.actualExpenses,
                netProfit: b.actualRevenue - b.actualExpenses,
                usagePercentage: Math.round((b.actualExpenses / b.plannedBudget) * 100),
                status: b.status,
            })),
        };
    }
};
exports.BudgetsService = BudgetsService;
exports.BudgetsService = BudgetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BudgetsService);
//# sourceMappingURL=budgets.service.js.map