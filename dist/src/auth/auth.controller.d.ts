import { UsersService } from "../users/users.service";
export declare class AuthController {
    private readonly usersService;
    constructor(usersService: UsersService);
    login(data: {
        email: string;
        password: string;
    }): Promise<{
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
        token: string;
    }>;
}
