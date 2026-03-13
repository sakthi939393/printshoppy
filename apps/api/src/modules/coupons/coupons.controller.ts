import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('coupons')
@Controller('coupons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Post('validate')
  validate(@Body() body: { code: string; amount: number }) {
    return this.couponsService.validate(body.code, body.amount);
  }

  @Get() @Roles('ADMIN', 'SUPER_ADMIN') @ApiBearerAuth()
  findAll() { return this.couponsService.findAll(); }

  @Post() @Roles('ADMIN', 'SUPER_ADMIN') @ApiBearerAuth()
  create(@Body() body: any) { return this.couponsService.create(body); }

  @Put(':id') @Roles('ADMIN', 'SUPER_ADMIN') @ApiBearerAuth()
  update(@Param('id') id: string, @Body() body: any) { return this.couponsService.update(id, body); }

  @Delete(':id') @Roles('ADMIN', 'SUPER_ADMIN') @ApiBearerAuth()
  delete(@Param('id') id: string) { return this.couponsService.delete(id); }
}
