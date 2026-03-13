import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ShippingService } from './shipping.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('shipping')
@Controller('shipping')
@UseGuards(JwtAuthGuard)
export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  @Get('serviceability') @Public()
  checkServiceability(@Query('pincode') pincode: string, @Query('weight') weight: number) {
    return this.shippingService.checkServiceability(pincode, weight);
  }

  @Get('track/:orderId') @ApiBearerAuth()
  track(@Param('orderId') orderId: string) {
    return this.shippingService.trackShipment(orderId);
  }

  @Post('create/:orderId') @ApiBearerAuth()
  create(@Param('orderId') orderId: string) {
    return this.shippingService.createShipment(orderId);
  }
}
