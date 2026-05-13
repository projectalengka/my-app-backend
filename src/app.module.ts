import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "./prisma/prisma.service";

import { UsersModule } from "./users/users.module";
import { ProjectsModule } from "./projects/projects.module";
import { TasksModule } from "./tasks/tasks.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { ActivityLogsModule } from "./activity-logs/activity-logs.module";
import { AuthModule } from "./auth/auth.module";
import { ClientsModule } from "./clients/clients.module";
import { AssetsModule } from "./assets/assets.module";
import { InvoicesModule } from "./invoices/invoices.module";
import { BudgetsModule } from "./budgets/budgets.module";
import { SopsModule } from "./sops/sops.module";
import { CategoriesModule } from "./categories/categories.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { WorkLogsModule } from "./work-logs/work-logs.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    ProjectsModule,
    TasksModule,
    TransactionsModule,
    ActivityLogsModule,
    AuthModule,
    ClientsModule,
    AssetsModule,
    InvoicesModule,
    BudgetsModule,
    SopsModule,
    CategoriesModule,
    NotificationsModule,
    WorkLogsModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
