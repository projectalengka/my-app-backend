import { WorkLogsService } from './work-logs.service';
export declare class WorkLogsController {
    private readonly workLogsService;
    constructor(workLogsService: WorkLogsService);
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
    }>;
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
