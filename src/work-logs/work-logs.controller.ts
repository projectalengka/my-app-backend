import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkLogsService } from './work-logs.service';

@Controller('work-logs')
export class WorkLogsController {
  constructor(private readonly workLogsService: WorkLogsService) {}

  @Post()
  create(@Body() data: any) {
    return this.workLogsService.create(data);
  }

  @Get()
  findAll() {
    return this.workLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workLogsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.workLogsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workLogsService.remove(id);
  }
}
