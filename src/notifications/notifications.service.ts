import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.notification.create({ data });
  }

  async findAll() {
    return this.prisma.notification.findMany();
  }

  async findOne(id: string) {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.notification.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.notification.delete({ where: { id } });
  }
}
