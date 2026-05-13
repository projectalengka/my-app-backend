import { PrismaService } from "../prisma/prisma.service";
type CreateBudgetInput = {
    projectId: string;
    plannedBudget: number;
};
type UpdateBudgetInput = Partial<CreateBudgetInput>;
export declare class BudgetsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        project: {
            budget: number | null;
            category: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            description: string | null;
            summary: string | null;
            goals: string | null;
            styleNotes: string | null;
            background: string | null;
            formatSpecs: string | null;
            visualReference: string | null;
            deadline: Date | null;
            platform: string | null;
            leadId: string | null;
            members: import("@prisma/client/runtime/library").JsonValue | null;
            designerIds: import("@prisma/client/runtime/library").JsonValue | null;
            pointConfig: import("@prisma/client/runtime/library").JsonValue | null;
            referenceLinks: string | null;
            clientId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        projectId: string;
        plannedBudget: number;
        actualRevenue: number;
        actualExpenses: number;
    })[]>;
    findById(id: string): Promise<{
        project: {
            budget: number | null;
            category: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            description: string | null;
            summary: string | null;
            goals: string | null;
            styleNotes: string | null;
            background: string | null;
            formatSpecs: string | null;
            visualReference: string | null;
            deadline: Date | null;
            platform: string | null;
            leadId: string | null;
            members: import("@prisma/client/runtime/library").JsonValue | null;
            designerIds: import("@prisma/client/runtime/library").JsonValue | null;
            pointConfig: import("@prisma/client/runtime/library").JsonValue | null;
            referenceLinks: string | null;
            clientId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        projectId: string;
        plannedBudget: number;
        actualRevenue: number;
        actualExpenses: number;
    }>;
    findByProjectId(projectId: string): Promise<{
        project: {
            budget: number | null;
            category: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            description: string | null;
            summary: string | null;
            goals: string | null;
            styleNotes: string | null;
            background: string | null;
            formatSpecs: string | null;
            visualReference: string | null;
            deadline: Date | null;
            platform: string | null;
            leadId: string | null;
            members: import("@prisma/client/runtime/library").JsonValue | null;
            designerIds: import("@prisma/client/runtime/library").JsonValue | null;
            pointConfig: import("@prisma/client/runtime/library").JsonValue | null;
            referenceLinks: string | null;
            clientId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        projectId: string;
        plannedBudget: number;
        actualRevenue: number;
        actualExpenses: number;
    }>;
    create(data: CreateBudgetInput): Promise<{
        project: {
            budget: number | null;
            category: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            description: string | null;
            summary: string | null;
            goals: string | null;
            styleNotes: string | null;
            background: string | null;
            formatSpecs: string | null;
            visualReference: string | null;
            deadline: Date | null;
            platform: string | null;
            leadId: string | null;
            members: import("@prisma/client/runtime/library").JsonValue | null;
            designerIds: import("@prisma/client/runtime/library").JsonValue | null;
            pointConfig: import("@prisma/client/runtime/library").JsonValue | null;
            referenceLinks: string | null;
            clientId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        projectId: string;
        plannedBudget: number;
        actualRevenue: number;
        actualExpenses: number;
    }>;
    update(id: string, data: UpdateBudgetInput): Promise<{
        project: {
            budget: number | null;
            category: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            description: string | null;
            summary: string | null;
            goals: string | null;
            styleNotes: string | null;
            background: string | null;
            formatSpecs: string | null;
            visualReference: string | null;
            deadline: Date | null;
            platform: string | null;
            leadId: string | null;
            members: import("@prisma/client/runtime/library").JsonValue | null;
            designerIds: import("@prisma/client/runtime/library").JsonValue | null;
            pointConfig: import("@prisma/client/runtime/library").JsonValue | null;
            referenceLinks: string | null;
            clientId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        projectId: string;
        plannedBudget: number;
        actualRevenue: number;
        actualExpenses: number;
    }>;
    updateActuals(projectId: string): Promise<{
        project: {
            budget: number | null;
            category: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            description: string | null;
            summary: string | null;
            goals: string | null;
            styleNotes: string | null;
            background: string | null;
            formatSpecs: string | null;
            visualReference: string | null;
            deadline: Date | null;
            platform: string | null;
            leadId: string | null;
            members: import("@prisma/client/runtime/library").JsonValue | null;
            designerIds: import("@prisma/client/runtime/library").JsonValue | null;
            pointConfig: import("@prisma/client/runtime/library").JsonValue | null;
            referenceLinks: string | null;
            clientId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        projectId: string;
        plannedBudget: number;
        actualRevenue: number;
        actualExpenses: number;
    }>;
    delete(id: string): Promise<{
        message: string;
        id: string;
    }>;
    private calculateStatus;
    getAnalytics(): Promise<{
        totalPlanned: number;
        totalActualRevenue: number;
        totalActualExpenses: number;
        totalNetProfit: number;
        remainingBudget: number;
        budgetCount: number;
        healthyCount: number;
        warningCount: number;
        overBudgetCount: number;
        budgets: {
            id: string;
            projectName: string;
            projectId: string;
            plannedBudget: number;
            actualRevenue: number;
            actualExpenses: number;
            remainingBudget: number;
            netProfit: number;
            usagePercentage: number;
            status: string;
        }[];
    }>;
}
export {};
