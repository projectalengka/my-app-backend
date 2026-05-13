import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany({
      include: { assignee: true, project: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByProject(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId },
      include: { assignee: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: { assignee: true, project: true },
    });
  }

  async create(data: {
    title: string; projectId: string; status?: string; priority?: string;
    description?: string; deadline?: string; assigneeId?: string; tags?: string[];
    points?: number;
  }) {
    if (!data.title?.trim()) {
      throw new BadRequestException("Task title is required");
    }
    if (!data.projectId?.trim()) {
      throw new BadRequestException("Project ID is required");
    }
    let parsedDeadline: Date;
    if (data.deadline) {
      parsedDeadline = new Date(data.deadline);
      if (isNaN(parsedDeadline.getTime())) {
        parsedDeadline = new Date();
      }
    } else {
      parsedDeadline = new Date();
    }
    return this.prisma.task.create({
      data: {
        title: data.title,
        projectId: data.projectId,
        status: data.status || "TODO",
        priority: data.priority || "Medium",
        description: data.description,
        deadline: parsedDeadline,
        assigneeId: data.assigneeId,
        tags: data.tags || [],
        points: data.points || 20,
      },
      include: { assignee: true, project: true },
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
    return this.prisma.task.update({
      where: { id },
      data,
      include: { assignee: true, project: true },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.task.update({
      where: { id },
      data: { status },
      include: { assignee: true, project: true },
    });
  }

  async delete(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}
