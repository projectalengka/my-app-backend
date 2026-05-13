import { PrismaService } from "../prisma/prisma.service";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        email: string;
        password: string | null;
        avatar: string | null;
        role: string;
        points: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        password: string | null;
        avatar: string | null;
        role: string;
        points: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findByEmail(email: string): Promise<{
        id: string;
        name: string;
        email: string;
        password: string | null;
        avatar: string | null;
        role: string;
        points: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(data: {
        name: string;
        email: string;
        role: string;
        password?: string;
        avatar?: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        password: string | null;
        avatar: string | null;
        role: string;
        points: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: Partial<{
        name: string;
        email: string;
        role: string;
        password: string;
        avatar: string;
        points: number;
    }>): Promise<{
        id: string;
        name: string;
        email: string;
        password: string | null;
        avatar: string | null;
        role: string;
        points: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        password: string | null;
        avatar: string | null;
        role: string;
        points: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    resetAllPoints(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
