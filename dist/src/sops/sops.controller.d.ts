import { SopsService } from './sops.service';
export declare class SopsController {
    private readonly sopsService;
    constructor(sopsService: SopsService);
    create(data: any): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        steps: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findAll(): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        steps: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    findOne(id: string): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        steps: import("@prisma/client/runtime/library").JsonValue | null;
    } | null>;
    update(id: string, data: any): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        steps: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(id: string): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        steps: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
