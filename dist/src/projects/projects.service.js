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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProjectsService = class ProjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async findOne(id) {
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
    async create(data) {
        if (!data.name?.trim()) {
            throw new common_1.BadRequestException("Project name is required");
        }
        const { deadline, ...rest } = data;
        let parsedDeadline;
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
        return this.prisma.project.update({ where: { id }, data });
    }
    async delete(id) {
        return this.prisma.project.delete({ where: { id } });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map