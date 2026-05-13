import { ActivityLogsService } from "./activity-logs.service";
export declare class ActivityLogsController {
    private readonly activityLogsService;
    constructor(activityLogsService: ActivityLogsService);
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
    create(data: any): Promise<{
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
