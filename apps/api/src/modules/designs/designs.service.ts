import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { UploadsService } from '../uploads/uploads.service';

@Injectable()
export class DesignsService {
  constructor(
    private prisma: PrismaService,
    private uploadsService: UploadsService,
  ) {}

  async create(userId: string, dto: CreateDesignDto) {
    return this.prisma.design.create({
      data: {
        userId,
        name: dto.name,
        templateId: dto.templateId,
        productId: dto.productId,
        canvasJson: dto.canvasJson,
        printAreaId: dto.printAreaId,
        width: dto.width,
        height: dto.height,
        status: 'DRAFT',
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.design.findMany({
      where: { userId, status: { not: 'DRAFT' } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const design = await this.prisma.design.findUnique({ where: { id } });
    if (!design) throw new NotFoundException('Design not found');
    if (design.userId !== userId) throw new ForbiddenException();
    return design;
  }

  async update(id: string, userId: string, dto: UpdateDesignDto) {
    const design = await this.findOne(id, userId);

    return this.prisma.design.update({
      where: { id },
      data: {
        name: dto.name ?? design.name,
        canvasJson: dto.canvasJson ?? design.canvasJson,
        thumbnail: dto.thumbnail ?? design.thumbnail,
        previewUrl: dto.previewUrl ?? design.previewUrl,
        status: dto.status as any ?? design.status,
      },
    });
  }

  async save(id: string, userId: string, dto: UpdateDesignDto) {
    await this.findOne(id, userId);
    return this.prisma.design.update({
      where: { id },
      data: {
        canvasJson: dto.canvasJson,
        thumbnail: dto.thumbnail,
        previewUrl: dto.previewUrl,
        status: 'SAVED',
      },
    });
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.prisma.design.delete({ where: { id } });
  }

  async generatePreview(id: string, userId: string, imageData: string) {
    await this.findOne(id, userId);
    // Upload thumbnail to R2
    const thumbnailUrl = await this.uploadsService.uploadBase64(
      imageData, `designs/${id}/thumbnail.jpg`, 'image/jpeg'
    );
    return this.prisma.design.update({
      where: { id },
      data: { thumbnail: thumbnailUrl, previewUrl: thumbnailUrl },
    });
  }

  async duplicate(id: string, userId: string) {
    const design = await this.findOne(id, userId);
    return this.prisma.design.create({
      data: {
        userId,
        name: `${design.name} (Copy)`,
        templateId: design.templateId,
        productId: design.productId,
        canvasJson: design.canvasJson,
        printAreaId: design.printAreaId,
        width: design.width,
        height: design.height,
        status: 'DRAFT',
      },
    });
  }
}
