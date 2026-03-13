import {
  Controller, Get, Post, Put, Delete, Param, Body,
  UseGuards, Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DesignsService } from './designs.service';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('designs')
@Controller('designs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DesignsController {
  constructor(private designsService: DesignsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new design' })
  create(@Req() req: any, @Body() dto: CreateDesignDto) {
    return this.designsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get my designs' })
  findAll(@Req() req: any) {
    return this.designsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get design by ID' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.designsService.findOne(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update design' })
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateDesignDto) {
    return this.designsService.update(id, req.user.id, dto);
  }

  @Post(':id/save')
  @ApiOperation({ summary: 'Save design' })
  save(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateDesignDto) {
    return this.designsService.save(id, req.user.id, dto);
  }

  @Post(':id/preview')
  @ApiOperation({ summary: 'Generate design preview thumbnail' })
  generatePreview(
    @Req() req: any,
    @Param('id') id: string,
    @Body('imageData') imageData: string,
  ) {
    return this.designsService.generatePreview(id, req.user.id, imageData);
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate design' })
  duplicate(@Req() req: any, @Param('id') id: string) {
    return this.designsService.duplicate(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete design' })
  delete(@Req() req: any, @Param('id') id: string) {
    return this.designsService.delete(id, req.user.id);
  }
}
