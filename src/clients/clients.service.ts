import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.client.create({ data });
  }

  async findAll() {
    return this.prisma.client.findMany({
      include: { projects: true, invoices: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    return this.prisma.client.findUnique({
      where: { id },
      include: { projects: true, invoices: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.client.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.client.delete({ where: { id } });
  }
}
