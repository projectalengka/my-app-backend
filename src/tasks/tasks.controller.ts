import { Controller, Get, Post, Patch, Delete, Param, Body } from "@nestjs/common";
import { TasksService } from "./tasks.service";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tasksService.findOne(id);
  }

  @Get("project/:projectId")
  findByProject(@Param("projectId") projectId: string) {
    return this.tasksService.findByProject(projectId);
  }

  @Post()
  create(@Body() data: any) {
    return this.tasksService.create(data);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() data: any) {
    return this.tasksService.update(id, data);
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body("status") status: string) {
    return this.tasksService.updateStatus(id, status);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.tasksService.delete(id);
  }
}
