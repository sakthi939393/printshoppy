import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async validate(code: string, amount: number) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    if (!coupon || !coupon.isActive) throw new BadRequestException('Invalid coupon');
    if (coupon.validUntil && new Date() > coupon.validUntil) throw new BadRequestException('Coupon expired');
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) throw new BadRequestException('Coupon limit reached');
    if (coupon.minOrderAmount && amount < Number(coupon.minOrderAmount)) throw new BadRequestException(`Min order ₹${coupon.minOrderAmount}`);
    return coupon;
  }

  async findAll() { return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } }); }

  async create(data: any) { return this.prisma.coupon.create({ data }); }

  async update(id: string, data: any) { return this.prisma.coupon.update({ where: { id }, data }); }

  async delete(id: string) { return this.prisma.coupon.delete({ where: { id } }); }
}
