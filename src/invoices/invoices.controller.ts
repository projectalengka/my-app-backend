import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { InvoicesService } from "./invoices.service";

@Controller("invoices")
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(@Body() data: any) {
    return this.invoicesService.create(data);
  }

  @Get()
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get("analytics")
  getAnalytics() {
    return this.invoicesService.getAnalytics();
  }

  @Get("client/:clientId")
  findByClientId(@Param("clientId") clientId: string) {
    return this.invoicesService.findByClientId(clientId);
  }

  @Get("project/:projectId")
  findByProjectId(@Param("projectId") projectId: string) {
    return this.invoicesService.findByProjectId(projectId);
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.invoicesService.findById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() data: any) {
    return this.invoicesService.update(id, data);
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() data: { status: string }) {
    return this.invoicesService.updateStatus(id, data.status);
  }

  @Patch(":id/mark-paid")
  markAsPaid(
    @Param("id") id: string,
    @Body() data?: { transactionId?: string; userId?: string },
  ) {
    return this.invoicesService.markAsPaid(id, data?.transactionId, data?.userId);
  }

  @Post(":id/duplicate")
  duplicate(@Param("id") id: string) {
    return this.invoicesService.duplicate(id);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.invoicesService.delete(id);
  }
}
