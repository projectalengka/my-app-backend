import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

type CreateTransactionInput = {
  type: string;
  amount: number;
  status: string;
  description?: string;
  userId: string;
  category?: string;
  paymentMethod?: string;
  date?: string | Date;
  relatedId?: string;
  projectId?: string;
  invoiceId?: string;
  attachmentUrl?: string;
};

type UpdateTransactionInput = Partial<CreateTransactionInput>;

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

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

  async findById(id: string) {
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
      throw new NotFoundException("Transaction not found");
    }

    return transaction;
  }

  async findByProjectId(projectId: string) {
    return this.prisma.transaction.findMany({
      where: { projectId },
      include: { user: true, project: true, invoice: true },
      orderBy: { date: "desc" },
    });
  }

  async findByType(type: string) {
    return this.prisma.transaction.findMany({
      where: {
        type,
        status: "Completed",
      },
      include: { user: true, project: true },
      orderBy: { date: "desc" },
    });
  }

  async findByCategory(category: string) {
    return this.prisma.transaction.findMany({
      where: { category },
      include: { user: true, project: true },
      orderBy: { date: "desc" },
    });
  }

  async create(data: CreateTransactionInput) {
    if (!data.userId?.trim()) {
      throw new BadRequestException("User ID is required for transactions");
    }

    const validTypes = ["income", "expense"];
    const validStatuses = ["Completed", "Pending", "Cancelled"];

    if (!validTypes.includes(data.type)) {
      throw new BadRequestException(
        `Invalid type. Must be: ${validTypes.join(", ")}`,
      );
    }

    const amount = Number(data.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestException("Amount must be a positive number");
    }

    if (!validStatuses.includes(data.status)) {
      throw new BadRequestException(
        `Invalid status. Must be: ${validStatuses.join(", ")}`,
      );
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

    // Update budget if project transaction
    if (data.projectId && data.status === "Completed") {
      await this.updateProjectBudget(data.projectId);
    }

    return transaction;
  }

  async update(id: string, data: UpdateTransactionInput) {
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

    // Update budget if project changed or status changed
    if (
      (data.projectId && data.projectId !== transaction.projectId) ||
      (data.status && data.status !== transaction.status)
    ) {
      const projectId = data.projectId || transaction.projectId;
      if (projectId) {
        await this.updateProjectBudget(projectId);
      }
    }

    return updated;
  }

  async updateStatus(id: string, status: string) {
    const transaction = await this.findById(id);

    const validStatuses = ["Completed", "Pending", "Cancelled"];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(
        `Invalid status. Must be: ${validStatuses.join(", ")}`,
      );
    }

    const updated = await this.prisma.transaction.update({
      where: { id },
      data: { status },
      include: { user: true, project: true, invoice: true },
    });

    // Update budget
    if (transaction.projectId) {
      await this.updateProjectBudget(transaction.projectId);
    }

    return updated;
  }

  async delete(id: string) {
    const transaction = await this.findById(id);

    await this.prisma.transaction.delete({
      where: { id },
    });

    // Update budget
    if (transaction.projectId) {
      await this.updateProjectBudget(transaction.projectId);
    }

    return { message: "Transaction deleted successfully", id };
  }

  private async updateProjectBudget(projectId: string) {
    const budget = await this.prisma.budget.findUnique({
      where: { projectId },
    });

    if (!budget) return;

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
    } else if (usagePercentage > 80) {
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

    // Group by category
    const byCategory: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.category) {
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
      }
    });

    // Monthly breakdown
    const monthlyData: Record<string, { income: number; expense: number }> = {};
    transactions.forEach((t) => {
      const month = new Date(t.date).toISOString().substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      if (t.type === "income") {
        monthlyData[month].income += t.amount;
      } else {
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
}
