import { UsersService } from "./users.service";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    }>;
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
    update(id: string, data: any): Promise<{
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
    resetPoints(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
