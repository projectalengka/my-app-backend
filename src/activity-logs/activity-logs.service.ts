import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ActivityLogsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.activityLog.findMany({
      include: { user: true },
      orderBy: { timestamp: "desc" },
      take: 50,
    });
  }

  async create(data: { action: string; category: string; details?: string; userId: string }) {
    return this.prisma.activityLog.create({
      data,
      include: { user: true },
    });
  }
}
