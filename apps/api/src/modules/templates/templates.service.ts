import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async findAll(productId?: string, category?: string) {
    return this.prisma.template.findMany({
      where: {
        isPublic: true,
        ...(productId && { productId }),
        ...(category && { category }),
      },
      orderBy: { usageCount: 'desc' },
    });
  }

  async findOne(id: string) {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async create(data: any) {
    return this.prisma.template.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.template.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.template.delete({ where: { id } });
  }

  async incrementUsage(id: string) {
    return this.prisma.template.update({ where: { id }, data: { usageCount: { increment: 1 } } });
  }
}
