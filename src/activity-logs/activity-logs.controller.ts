import { Controller, Get, Post, Body } from "@nestjs/common";
import { ActivityLogsService } from "./activity-logs.service";

@Controller("activity-logs")
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  findAll() {
    return this.activityLogsService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.activityLogsService.create(data);
  }
}
