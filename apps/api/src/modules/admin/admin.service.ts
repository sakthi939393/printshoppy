import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getCustomers(page = 1, limit = 20, search?: string) {
    const where: any = { role: 'CUSTOMER' };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [total, customers] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        select: { id: true, name: true, email: true, phone: true, isActive: true, createdAt: true, _count: { select: { orders: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
    return { customers, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async getAllOrders(page = 1, limit = 20, status?: string) {
    const where: any = {};
    if (status) where.status = status;
    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: { select: { name: true } } } },
          payment: true,
          shipping: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
    return { orders, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async updateOrderStatus(orderId: string, status: string, note: string, adminId: string) {
    return Promise.all([
      this.prisma.order.update({ where: { id: orderId }, data: { status: status as any } }),
      this.prisma.orderTimeline.create({ data: { orderId, status: status as any, note, createdBy: adminId } }),
    ]);
  }

  async toggleCustomerStatus(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;
    return this.prisma.user.update({ where: { id: userId }, data: { isActive: !user.isActive } });
  }
}
