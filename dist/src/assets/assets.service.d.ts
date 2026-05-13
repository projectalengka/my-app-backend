import { PrismaService } from '../prisma/prisma.service';
export declare class AssetsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        type: string;
        url: string | null;
        size: string | null;
        folderId: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        type: string;
        url: string | null;
        size: string | null;
        folderId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        type: string;
        url: string | null;
        size: string | null;
        folderId: string | null;
    } | null>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        type: string;
        url: string | null;
        size: string | null;
        folderId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tags: string[];
        type: string;
        url: string | null;
        size: string | null;
        folderId: string | null;
    }>;
}
