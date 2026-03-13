import {
  Controller, Get, Post, Put, Param, Body, Query, UseGuards, Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProductionService } from './production.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('production')
@Controller('production')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN', 'PRODUCTION_STAFF')
@ApiBearerAuth()
export class ProductionController {
  constructor(private productionService: ProductionService) {}

  @Get('queue')
  @ApiOperation({ summary: 'Get print queue' })
  getPrintQueue(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status: string,
  ) {
    return this.productionService.getPrintQueue(page, limit, status);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get production statistics' })
  getStats() {
    return this.productionService.getStats();
  }

  @Post(':orderId/generate-file')
  @ApiOperation({ summary: 'Generate print file for order' })
  generatePrintFile(@Param('orderId') orderId: string) {
    return this.productionService.generatePrintFile(orderId);
  }

  @Put('jobs/:jobId/assign')
  @ApiOperation({ summary: 'Assign print job to staff' })
  assignJob(@Param('jobId') jobId: string, @Req() req: any) {
    return this.productionService.assignJob(jobId, req.user.id);
  }

  @Put('jobs/:jobId/status')
  @ApiOperation({ summary: 'Update print job status' })
  updateJobStatus(
    @Param('jobId') jobId: string,
    @Body() body: { status: string; notes?: string },
  ) {
    return this.productionService.updateJobStatus(jobId, body.status, body.notes);
  }
}
