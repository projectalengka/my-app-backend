import { Controller, Get, Post, Patch, Delete, Param, Body } from "@nestjs/common";
import { ProjectsService } from "./projects.service";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.projectsService.create(data);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() data: any) {
    return this.projectsService.update(id, data);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.projectsService.delete(id);
  }
}
