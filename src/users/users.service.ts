import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { points: "desc" },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { name: string; email: string; role: string; password?: string; avatar?: string }) {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: Partial<{ name: string; email: string; role: string; password: string; avatar: string; points: number }>) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async resetAllPoints() {
    return this.prisma.user.updateMany({ data: { points: 0 } });
  }
}
