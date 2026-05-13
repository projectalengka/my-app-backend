import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";

@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get("analytics")
  getAnalytics() {
    return this.transactionsService.getAnalytics();
  }

  @Get("type/:type")
  findByType(@Param("type") type: string) {
    return this.transactionsService.findByType(type);
  }

  @Get("category/:category")
  findByCategory(@Param("category") category: string) {
    return this.transactionsService.findByCategory(category);
  }

  @Get("project/:projectId")
  findByProjectId(@Param("projectId") projectId: string) {
    return this.transactionsService.findByProjectId(projectId);
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.transactionsService.findById(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.transactionsService.create(data);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() data: any) {
    return this.transactionsService.update(id, data);
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() data: { status: string }) {
    return this.transactionsService.updateStatus(id, data.status);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.transactionsService.delete(id);
  }
}
