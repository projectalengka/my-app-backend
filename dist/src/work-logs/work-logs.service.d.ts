import { PrismaService } from '../prisma/prisma.service';
export declare class WorkLogsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: string;
        description: string;
        userId: string;
        date: Date;
        taskId: string | null;
        hours: number;
    }>;
    findAll(): Promise<{
        id: string;
        description: string;
        userId: string;
        date: Date;
        taskId: string | null;
        hours: number;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        description: string;
        userId: string;
        date: Date;
        taskId: string | null;
        hours: number;
    } | null>;
    update(id: string, data: any): Promise<{
        id: string;
        description: string;
        userId: string;
        date: Date;
        taskId: string | null;
        hours: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        description: string;
        userId: string;
        date: Date;
        taskId: string | null;
        hours: number;
    }>;
}
