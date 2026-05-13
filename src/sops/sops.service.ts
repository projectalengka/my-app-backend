import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SopsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.sOP.create({ data });
  }

  async findAll() {
    return this.prisma.sOP.findMany();
  }

  async findOne(id: string) {
    return this.prisma.sOP.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.sOP.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.sOP.delete({ where: { id } });
  }
}
