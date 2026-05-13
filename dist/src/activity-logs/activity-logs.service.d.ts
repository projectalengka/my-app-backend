import { PrismaService } from "../prisma/prisma.service";
export declare class ActivityLogsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            password: string | null;
            avatar: string | null;
            role: string;
            points: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        category: string;
        id: string;
        userId: string;
        action: string;
        details: string | null;
        timestamp: Date;
    })[]>;
    create(data: {
        action: string;
        category: string;
        details?: string;
        userId: string;
    }): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            password: string | null;
            avatar: string | null;
            role: string;
            points: number;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        category: string;
        id: string;
        userId: string;
        action: string;
        details: string | null;
        timestamp: Date;
    }>;
}
