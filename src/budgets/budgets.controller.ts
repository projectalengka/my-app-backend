import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { BudgetsService } from "./budgets.service";

@Controller("budgets")
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  findAll() {
    return this.budgetsService.findAll();
  }

  @Get("analytics")
  getAnalytics() {
    return this.budgetsService.getAnalytics();
  }

  @Get("project/:projectId")
  findByProjectId(@Param("projectId") projectId: string) {
    return this.budgetsService.findByProjectId(projectId);
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.budgetsService.findById(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.budgetsService.create(data);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() data: any) {
    return this.budgetsService.update(id, data);
  }

  @Patch("project/:projectId/sync")
  syncProjectBudget(@Param("projectId") projectId: string) {
    return this.budgetsService.updateActuals(projectId);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.budgetsService.delete(id);
  }
}
