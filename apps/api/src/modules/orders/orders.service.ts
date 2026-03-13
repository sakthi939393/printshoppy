import {
  Injectable, NotFoundException, BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    // Validate cart items
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = cart.items.map(item => {
      const price = item.variant
        ? Number(item.variant.price)
        : Number(item.product.basePrice);
      const total = price * item.quantity;
      subtotal += total;
      return {
        productId: item.productId,
        variantId: item.variantId,
        designId: item.designId,
        quantity: item.quantity,
        unitPrice: price,
        totalPrice: total,
        customization: item.customization,
      };
    });

    // Apply coupon
    let discountAmount = 0;
    let couponId: string | null = null;
    if (dto.couponCode) {
      const coupon = await this.validateCoupon(dto.couponCode, userId, subtotal);
      couponId = coupon.id;
      discountAmount = this.calculateCouponDiscount(coupon, subtotal);
    }

    const shippingAmount = subtotal >= 999 ? 0 : 99;
    const taxAmount = Math.round((subtotal - discountAmount) * 0.18 * 100) / 100;
    const totalAmount = subtotal - discountAmount + shippingAmount + taxAmount;

    // Generate order number
    const orderNumber = `PSP${Date.now().toString().slice(-8)}${Math.random().toString(36).slice(-4).toUpperCase()}`;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        addressId: dto.addressId,
        subtotal,
        discountAmount,
        shippingAmount,
        taxAmount,
        totalAmount,
        couponCode: dto.couponCode,
        couponId,
        notes: dto.notes,
        items: { create: orderItems },
        timeline: {
          create: { status: 'PENDING', note: 'Order created' },
        },
      },
      include: {
        items: {
          include: { product: true, variant: true },
        },
        address: true,
      },
    });

    // Clear cart
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    // Update coupon usage
    if (couponId) {
      await this.prisma.coupon.update({
        where: { id: couponId },
        data: { usageCount: { increment: 1 } },
      });
    }

    return order;
  }

  async findAll(userId: string, page = 1, limit = 10) {
    const where = { userId };
    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                include: { images: { where: { isPrimary: true }, take: 1 } },
              },
            },
          },
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

  async findOne(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId;

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
            variant: true,
            design: true,
          },
        },
        address: true,
        payment: true,
        shipping: true,
        printJob: true,
        timeline: { orderBy: { createdAt: 'asc' } },
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto, updatedBy?: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const [updated] = await Promise.all([
      this.prisma.order.update({
        where: { id },
        data: { status: dto.status as any },
      }),
      this.prisma.orderTimeline.create({
        data: {
          orderId: id,
          status: dto.status as any,
          note: dto.note,
          createdBy: updatedBy,
        },
      }),
    ]);

    return updated;
  }

  async cancel(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
    });
    if (!order) throw new NotFoundException('Order not found');

    const cancellableStatuses = ['PENDING', 'CONFIRMED', 'PAYMENT_PENDING'];
    if (!cancellableStatuses.includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    return this.updateStatus(id, { status: 'CANCELLED', note: 'Cancelled by customer' });
  }

  async reorder(orderId: string, userId: string) {
    const order = await this.findOne(orderId, userId);

    // Add items back to cart
    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }

    await Promise.all(order.items.map(item =>
      this.prisma.cartItem.create({
        data: {
          cartId: cart!.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          customization: item.customization ?? undefined,
        },
      })
    ));

    return { message: 'Items added to cart' };
  }

  private async validateCoupon(code: string, userId: string, amount: number) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    if (!coupon || !coupon.isActive) throw new BadRequestException('Invalid coupon code');

    if (coupon.validUntil && new Date() > coupon.validUntil) {
      throw new BadRequestException('Coupon has expired');
    }
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }
    if (coupon.minOrderAmount && amount < Number(coupon.minOrderAmount)) {
      throw new BadRequestException(
        `Minimum order amount is ₹${coupon.minOrderAmount} for this coupon`
      );
    }

    return coupon;
  }

  private calculateCouponDiscount(coupon: any, amount: number): number {
    if (coupon.type === 'PERCENTAGE') {
      const discount = amount * (Number(coupon.value) / 100);
      return coupon.maxDiscount
        ? Math.min(discount, Number(coupon.maxDiscount))
        : discount;
    }
    if (coupon.type === 'FIXED') {
      return Math.min(Number(coupon.value), amount);
    }
    return 0;
  }
}
