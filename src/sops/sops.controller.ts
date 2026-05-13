import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SopsService } from './sops.service';

@Controller('sops')
export class SopsController {
  constructor(private readonly sopsService: SopsService) {}

  @Post()
  create(@Body() data: any) {
    return this.sopsService.create(data);
  }

  @Get()
  findAll() {
    return this.sopsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sopsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.sopsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sopsService.remove(id);
  }
}
