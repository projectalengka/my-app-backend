"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TasksService = class TasksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.task.findMany({
            include: { assignee: true, project: true },
            orderBy: { createdAt: "desc" },
        });
    }
    async findByProject(projectId) {
        return this.prisma.task.findMany({
            where: { projectId },
            include: { assignee: true },
            orderBy: { createdAt: "desc" },
        });
    }
    async findOne(id) {
        return this.prisma.task.findUnique({
            where: { id },
            include: { assignee: true, project: true },
        });
    }
    async create(data) {
        if (!data.title?.trim()) {
            throw new common_1.BadRequestException("Task title is required");
        }
        if (!data.projectId?.trim()) {
            throw new common_1.BadRequestException("Project ID is required");
        }
        let parsedDeadline;
        if (data.deadline) {
            parsedDeadline = new Date(data.deadline);
            if (isNaN(parsedDeadline.getTime())) {
                parsedDeadline = new Date();
            }
        }
        else {
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
    async update(id, data) {
        if (data.deadline) {
            const parsed = new Date(data.deadline);
            if (!isNaN(parsed.getTime())) {
                data.deadline = parsed;
            }
            else {
                delete data.deadline;
            }
        }
        return this.prisma.task.update({
            where: { id },
            data,
            include: { assignee: true, project: true },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.task.update({
            where: { id },
            data: { status },
            include: { assignee: true, project: true },
        });
    }
    async delete(id) {
        return this.prisma.task.delete({ where: { id } });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
