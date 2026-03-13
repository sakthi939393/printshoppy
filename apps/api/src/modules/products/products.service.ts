import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import slugify from 'slugify';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const {
      page = 1, limit = 20, category, search,
      minPrice, maxPrice, sort = 'createdAt', order = 'desc',
    } = query;

    const where: any = { status: 'ACTIVE' };
    if (category) where.category = { slug: category };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = minPrice;
      if (maxPrice) where.basePrice.lte = maxPrice;
    }

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { where: { isPrimary: true }, take: 1 },
          variants: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
          _count: { select: { reviews: true } },
        },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      products,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
        printAreas: true,
        templates: { where: { isPublic: true } },
        reviews: {
          where: { isVisible: true },
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { reviews: true, wishlist: true } },
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto) {
    const slug = slugify(dto.name, { lower: true, strict: true });
    return this.prisma.product.create({
      data: {
        ...dto,
        slug,
        variants: dto.variants
          ? { create: dto.variants }
          : undefined,
        images: dto.images
          ? { create: dto.images }
          : undefined,
        printAreas: dto.printAreas
          ? { create: dto.printAreas }
          : undefined,
      },
      include: { variants: true, images: true, printAreas: true },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    const updateData: any = { ...dto };
    if (dto.name) {
      updateData.slug = slugify(dto.name, { lower: true, strict: true });
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: { variants: true, images: true },
    });
  }

  async delete(id: string) {
    await this.prisma.product.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
  }

  async calculatePrice(productId: string, variantId: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    const variant = product.variants.find(v => v.id === variantId);
    const basePrice = variant ? Number(variant.price) : Number(product.basePrice);

    // Quantity pricing tiers
    let discount = 0;
    if (quantity >= 100) discount = 0.15;
    else if (quantity >= 50) discount = 0.10;
    else if (quantity >= 25) discount = 0.07;
    else if (quantity >= 10) discount = 0.05;

    const unitPrice = basePrice * (1 - discount);
    const subtotal = unitPrice * quantity;

    return {
      unitPrice: Math.round(unitPrice * 100) / 100,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100),
      savings: Math.round((basePrice - unitPrice) * quantity * 100) / 100,
    };
  }

  async getFeatured() {
    return this.prisma.product.findMany({
      where: { status: 'ACTIVE', sortOrder: { gt: 0 } },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        _count: { select: { reviews: true } },
      },
      orderBy: { sortOrder: 'desc' },
      take: 8,
    });
  }
}
