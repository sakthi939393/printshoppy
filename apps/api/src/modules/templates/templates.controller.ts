import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('templates')
@Controller('templates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}

  @Get() @Public()
  findAll(@Query('productId') productId: string, @Query('category') category: string) {
    return this.templatesService.findAll(productId, category);
  }

  @Get(':id') @Public()
  findOne(@Param('id') id: string) { return this.templatesService.findOne(id); }

  @Post() @Roles('ADMIN', 'SUPER_ADMIN')
  create(@Body() body: any) { return this.templatesService.create(body); }

  @Put(':id') @Roles('ADMIN', 'SUPER_ADMIN')
  update(@Param('id') id: string, @Body() body: any) { return this.templatesService.update(id, body); }

  @Delete(':id') @Roles('ADMIN', 'SUPER_ADMIN')
  delete(@Param('id') id: string) { return this.templatesService.delete(id); }
}
