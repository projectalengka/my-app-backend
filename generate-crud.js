const fs = require('fs');
const path = require('path');

const modules = ['clients', 'assets', 'invoices', 'sops', 'categories', 'notifications', 'work-logs'];

modules.forEach(mod => {
    const camelMod = mod.replace(/-([a-z])/g, g => g[1].toUpperCase());
    const singularMod = mod.endsWith('s') ? mod.slice(0, -1) : mod;
    const camelSingular = singularMod.replace(/-([a-z])/g, g => g[1].toUpperCase());
    const pascalMod = camelMod.charAt(0).toUpperCase() + camelMod.slice(1);
    const pascalSingular = camelSingular.charAt(0).toUpperCase() + camelSingular.slice(1);
    
    // Write Service
    const servicePath = path.join(__dirname, 'src', mod, `${mod}.service.ts`);
    const serviceContent = `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ${pascalMod}Service {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.${camelSingular}.create({ data });
  }

  async findAll() {
    return this.prisma.${camelSingular}.findMany();
  }

  async findOne(id: string) {
    return this.prisma.${camelSingular}.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.${camelSingular}.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.${camelSingular}.delete({ where: { id } });
  }
}
`;
    fs.writeFileSync(servicePath, serviceContent);

    // Write Controller
    const controllerPath = path.join(__dirname, 'src', mod, `${mod}.controller.ts`);
    const controllerContent = `import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ${pascalMod}Service } from './${mod}.service';

@Controller('${mod}')
export class ${pascalMod}Controller {
  constructor(private readonly ${camelMod}Service: ${pascalMod}Service) {}

  @Post()
  create(@Body() data: any) {
    return this.${camelMod}Service.create(data);
  }

  @Get()
  findAll() {
    return this.${camelMod}Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.${camelMod}Service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.${camelMod}Service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.${camelMod}Service.remove(id);
  }
}
`;
    fs.writeFileSync(controllerPath, controllerContent);
    
    // Write Module to import PrismaService
    const modulePath = path.join(__dirname, 'src', mod, `${mod}.module.ts`);
    const moduleContent = `import { Module } from '@nestjs/common';
import { ${pascalMod}Service } from './${mod}.service';
import { ${pascalMod}Controller } from './${mod}.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [${pascalMod}Controller],
  providers: [${pascalMod}Service, PrismaService],
})
export class ${pascalMod}Module {}
`;
    fs.writeFileSync(modulePath, moduleContent);
});

console.log('All backend boilerplate generated successfully!');
