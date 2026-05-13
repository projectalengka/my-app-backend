import { Controller, Get, Post, Patch, Delete, Param, Body } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() data: { name: string; email: string; role: string; password?: string; avatar?: string }) {
    return this.usersService.create(data);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() data: any) {
    return this.usersService.update(id, data);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.usersService.delete(id);
  }

  @Post("reset-points")
  resetPoints() {
    return this.usersService.resetAllPoints();
  }
}
