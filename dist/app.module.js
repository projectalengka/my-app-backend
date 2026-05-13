"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("./prisma/prisma.service");
const users_module_1 = require("./users/users.module");
const projects_module_1 = require("./projects/projects.module");
const tasks_module_1 = require("./tasks/tasks.module");
const transactions_module_1 = require("./transactions/transactions.module");
const activity_logs_module_1 = require("./activity-logs/activity-logs.module");
const auth_module_1 = require("./auth/auth.module");
const clients_module_1 = require("./clients/clients.module");
const assets_module_1 = require("./assets/assets.module");
const invoices_module_1 = require("./invoices/invoices.module");
const budgets_module_1 = require("./budgets/budgets.module");
const sops_module_1 = require("./sops/sops.module");
const categories_module_1 = require("./categories/categories.module");
const notifications_module_1 = require("./notifications/notifications.module");
const work_logs_module_1 = require("./work-logs/work-logs.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            users_module_1.UsersModule,
            projects_module_1.ProjectsModule,
            tasks_module_1.TasksModule,
            transactions_module_1.TransactionsModule,
            activity_logs_module_1.ActivityLogsModule,
            auth_module_1.AuthModule,
            clients_module_1.ClientsModule,
            assets_module_1.AssetsModule,
            invoices_module_1.InvoicesModule,
            budgets_module_1.BudgetsModule,
            sops_module_1.SopsModule,
            categories_module_1.CategoriesModule,
            notifications_module_1.NotificationsModule,
            work_logs_module_1.WorkLogsModule,
        ],
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], AppModule);
