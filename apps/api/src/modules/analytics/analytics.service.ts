import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

    const [totalOrders, totalRevenue, totalCustomers, totalProducts,
      recentOrders, ordersByStatus, topProducts] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: { status: { in: ['CONFIRMED','PROCESSING','DISPATCHED','SHIPPED','DELIVERED'] } },
        _sum: { totalAmount: true },
      }),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.product.count({ where: { status: 'ACTIVE' } }),
      this.prisma.order.findMany({
        orderBy: { createdAt: 'desc' }, take: 10,
        include: { user: { select: { name: true, email: true } }, items: true },
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        _count: true,
      }),
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, totalPrice: true },
        orderBy: { _sum: { totalPrice: 'desc' } },
        take: 5,
      }),
    ]);

    return {
      summary: {
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount ?? 0,
        totalCustomers,
        totalProducts,
      },
      recentOrders,
      ordersByStatus,
      topProducts,
    };
  }

  async getRevenueChart(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { in: ['CONFIRMED','PROCESSING','DISPATCHED','SHIPPED','DELIVERED'] },
      },
      select: { createdAt: true, totalAmount: true },
      orderBy: { createdAt: 'asc' },
    });

    const grouped = orders.reduce((acc: any, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!acc[date]) acc[date] = { date, revenue: 0, orders: 0 };
      acc[date].revenue += Number(order.totalAmount);
      acc[date].orders += 1;
      return acc;
    }, {});

    return Object.values(grouped);
  }
}
