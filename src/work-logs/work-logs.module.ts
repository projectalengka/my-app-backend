import { Module } from '@nestjs/common';
import { WorkLogsService } from './work-logs.service';
import { WorkLogsController } from './work-logs.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [WorkLogsController],
  providers: [WorkLogsService, PrismaService],
})
export class WorkLogsModule {}
