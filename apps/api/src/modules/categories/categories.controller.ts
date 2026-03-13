import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get() @Public()
  findAll() { return this.categoriesService.findAll(); }

  @Get(':slug') @Public()
  findOne(@Param('slug') slug: string) { return this.categoriesService.findOne(slug); }

  @Post() @Roles('ADMIN', 'SUPER_ADMIN')
  create(@Body() body: any) { return this.categoriesService.create(body); }

  @Put(':id') @Roles('ADMIN', 'SUPER_ADMIN')
  update(@Param('id') id: string, @Body() body: any) { return this.categoriesService.update(id, body); }
}
