import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: string;
        name: string;
        color: string;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        color: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        color: string;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        color: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        color: string;
    }>;
}
