import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      include: {
        client: true,
        invoices: true,
        transactions: true,
        projectBudget: true,
        tasks: { include: { assignee: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        invoices: true,
        transactions: true,
        projectBudget: true,
        tasks: { include: { assignee: true } },
      },
    });
  }

  async create(data: {
    name: string;
    description?: string;
    summary?: string;
    goals?: string;
    styleNotes?: string;
    background?: string;
    formatSpecs?: string;
    visualReference?: string;
    deadline?: string;
    status?: string;
    clientId?: string;
    category?: string;
    platform?: string;
    leadId?: string;
    members?: any;
    designerIds?: any;
    budget?: number;
    pointConfig?: any;
  }) {
    if (!data.name?.trim()) {
      throw new BadRequestException("Project name is required");
    }
    const { deadline, ...rest } = data;
    let parsedDeadline: Date | undefined;
    if (deadline) {
      parsedDeadline = new Date(deadline);
      if (isNaN(parsedDeadline.getTime())) {
        parsedDeadline = undefined;
      }
    }
    return this.prisma.project.create({
      data: {
        ...rest,
        deadline: parsedDeadline,
      },
    });
  }

  async update(id: string, data: any) {
    if (data.deadline) {
      const parsed = new Date(data.deadline);
      if (!isNaN(parsed.getTime())) {
        data.deadline = parsed;
      } else {
        delete data.deadline;
      }
    }
    return this.prisma.project.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}
