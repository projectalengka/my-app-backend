import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
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
