import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: { children: { where: { isActive: true } }, _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(slug: string) {
    return this.prisma.category.findUnique({ where: { slug }, include: { children: true } });
  }

  async create(data: any) {
    return this.prisma.category.create({ data: { ...data, slug: slugify(data.name, { lower: true }) } });
  }

  async update(id: string, data: any) {
    return this.prisma.category.update({ where: { id }, data });
  }
}
