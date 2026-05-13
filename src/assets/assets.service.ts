import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.asset.create({ data });
  }

  async findAll() {
    return this.prisma.asset.findMany();
  }

  async findOne(id: string) {
    return this.prisma.asset.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.asset.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.asset.delete({ where: { id } });
  }
}
