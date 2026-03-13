import { Controller, Get, Put, Post, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  getProfile(@Req() req: any) { return this.usersService.findById(req.user.id); }

  @Put('profile')
  updateProfile(@Req() req: any, @Body() body: any) { return this.usersService.updateProfile(req.user.id, body); }

  @Get('addresses')
  getAddresses(@Req() req: any) { return this.usersService.getAddresses(req.user.id); }

  @Post('addresses')
  createAddress(@Req() req: any, @Body() body: any) { return this.usersService.createAddress(req.user.id, body); }

  @Put('addresses/:id')
  updateAddress(@Req() req: any, @Param('id') id: string, @Body() body: any) { return this.usersService.updateAddress(id, req.user.id, body); }

  @Delete('addresses/:id')
  deleteAddress(@Req() req: any, @Param('id') id: string) { return this.usersService.deleteAddress(id, req.user.id); }

  @Get('wishlist')
  getWishlist(@Req() req: any) { return this.usersService.getWishlist(req.user.id); }

  @Post('wishlist/:productId')
  toggleWishlist(@Req() req: any, @Param('productId') productId: string) { return this.usersService.toggleWishlist(req.user.id, productId); }
}
