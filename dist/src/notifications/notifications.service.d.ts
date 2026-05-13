import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: string;
        type: string;
        userId: string;
        title: string;
        timestamp: Date;
        message: string;
        read: boolean;
        link: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        type: string;
        userId: string;
        title: string;
        timestamp: Date;
        message: string;
        read: boolean;
        link: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        type: string;
        userId: string;
        title: string;
        timestamp: Date;
        message: string;
        read: boolean;
        link: string | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        type: string;
        userId: string;
        title: string;
        timestamp: Date;
        message: string;
        read: boolean;
        link: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        type: string;
        userId: string;
        title: string;
        timestamp: Date;
        message: string;
        read: boolean;
        link: string | null;
    }>;
}
