import { Module } from '@nestjs/common';
import { SopsService } from './sops.service';
import { SopsController } from './sops.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SopsController],
  providers: [SopsService, PrismaService],
})
export class SopsModule {}
