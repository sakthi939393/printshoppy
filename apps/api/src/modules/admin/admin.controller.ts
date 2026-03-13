import { Controller, Get, Put, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('customers')
  getCustomers(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string) {
    return this.adminService.getCustomers(page, limit, search);
  }

  @Put('customers/:id/toggle-status')
  toggleCustomerStatus(@Param('id') id: string) {
    return this.adminService.toggleCustomerStatus(id);
  }

  @Get('orders')
  getAllOrders(@Query('page') page: number, @Query('limit') limit: number, @Query('status') status: string) {
    return this.adminService.getAllOrders(page, limit, status);
  }

  @Put('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body() body: { status: string; note: string }, @Req() req: any) {
    return this.adminService.updateOrderStatus(id, body.status, body.note, req.user.id);
  }
}
