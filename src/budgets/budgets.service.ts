import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

type CreateBudgetInput = {
  projectId: string;
  plannedBudget: number;
};

type UpdateBudgetInput = Partial<CreateBudgetInput>;

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.budget.findMany({
      include: { project: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    const budget = await this.prisma.budget.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!budget) {
      throw new NotFoundException("Budget not found");
    }

    return budget;
  }

  async findByProjectId(projectId: string) {
    const budget = await this.prisma.budget.findUnique({
      where: { projectId },
      include: { project: true },
    });

    if (!budget) {
      throw new NotFoundException("Budget not found for project");
    }

    return budget;
  }

  async create(data: CreateBudgetInput) {
    if (!data.projectId?.trim()) {
      throw new BadRequestException("Project ID is required");
    }

    if (isNaN(data.plannedBudget) || data.plannedBudget <= 0) {
      throw new BadRequestException("Planned budget must be a positive number");
    }

    const project = await this.prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const existingBudget = await this.prisma.budget.findUnique({
      where: { projectId: data.projectId },
    });

    if (existingBudget) {
      throw new BadRequestException("Budget already exists for this project");
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

  async update(id: string, data: UpdateBudgetInput) {
    const budget = await this.findById(id);

    let status = budget.status;
    if (data.plannedBudget) {
      status = this.calculateStatus(
        budget.actualExpenses,
        data.plannedBudget || budget.plannedBudget,
      );
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

  async updateActuals(projectId: string) {
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
      throw new NotFoundException("Budget not found");
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

  async delete(id: string) {
    const budget = await this.findById(id);

    await this.prisma.budget.delete({
      where: { id },
    });

    return { message: "Budget deleted successfully", id };
  }

  private calculateStatus(
    actualExpenses: number,
    plannedBudget: number,
  ): string {
    const usagePercentage = (actualExpenses / plannedBudget) * 100;

    if (usagePercentage > 100) {
      return "Over Budget";
    } else if (usagePercentage > 80) {
      return "Warning";
    } else {
      return "Healthy";
    }
  }

  async getAnalytics() {
    const budgets = await this.prisma.budget.findMany({
      include: { project: true },
    });

    const totalPlanned = budgets.reduce((sum, b) => sum + b.plannedBudget, 0);
    const totalActualRevenue = budgets.reduce(
      (sum, b) => sum + b.actualRevenue,
      0,
    );
    const totalActualExpenses = budgets.reduce(
      (sum, b) => sum + b.actualExpenses,
      0,
    );
    const totalNetProfit = totalActualRevenue - totalActualExpenses;

    const healthyCount = budgets.filter((b) => b.status === "Healthy").length;
    const warningCount = budgets.filter((b) => b.status === "Warning").length;
    const overBudgetCount = budgets.filter(
      (b) => b.status === "Over Budget",
    ).length;

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
}
