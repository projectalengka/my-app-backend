import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
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
