import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import Stripe from 'stripe';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
  private razorpay: Razorpay;
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private ordersService: OrdersService,
  ) {
    this.razorpay = new Razorpay({
      key_id: configService.get('RAZORPAY_KEY_ID', ''),
      key_secret: configService.get('RAZORPAY_KEY_SECRET', ''),
    });

    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY', ''), {
      apiVersion: '2023-10-16',
    });
  }

  async createRazorpayOrder(orderId: string, userId: string) {
    const order = await this.ordersService.findOne(orderId, userId);
    const amount = Math.round(Number(order.totalAmount) * 100); // paise

    const razorpayOrder = await this.razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: order.orderNumber,
      notes: { orderId, userId },
    });

    const payment = await this.prisma.payment.upsert({
      where: { orderId },
      create: {
        orderId,
        gateway: 'RAZORPAY',
        gatewayOrderId: razorpayOrder.id,
        amount: order.totalAmount,
        currency: 'INR',
        status: 'PENDING',
      },
      update: {
        gatewayOrderId: razorpayOrder.id,
        status: 'PENDING',
      },
    });

    return {
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency: 'INR',
      keyId: this.configService.get('RAZORPAY_KEY_ID'),
      orderNumber: order.orderNumber,
    };
  }

  async verifyRazorpayPayment(dto: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderId: string;
  }) {
    const expectedSignature = crypto
      .createHmac('sha256', this.configService.get('RAZORPAY_KEY_SECRET', ''))
      .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== dto.razorpaySignature) {
      throw new BadRequestException('Invalid payment signature');
    }

    await Promise.all([
      this.prisma.payment.update({
        where: { orderId: dto.orderId },
        data: {
          gatewayPaymentId: dto.razorpayPaymentId,
          status: 'COMPLETED',
        },
      }),
      this.ordersService.updateStatus(dto.orderId, {
        status: 'CONFIRMED',
        note: `Payment received via Razorpay. Payment ID: ${dto.razorpayPaymentId}`,
      }),
    ]);

    return { success: true, message: 'Payment verified successfully' };
  }

  async createStripePaymentIntent(orderId: string, userId: string) {
    const order = await this.ordersService.findOne(orderId, userId);
    const amount = Math.round(Number(order.totalAmount) * 100); // cents

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      metadata: { orderId, userId },
    });

    await this.prisma.payment.upsert({
      where: { orderId },
      create: {
        orderId,
        gateway: 'STRIPE',
        gatewayOrderId: paymentIntent.id,
        amount: order.totalAmount,
        currency: 'INR',
        status: 'PENDING',
      },
      update: {
        gatewayOrderId: paymentIntent.id,
        status: 'PENDING',
      },
    });

    return { clientSecret: paymentIntent.client_secret };
  }

  async handleStripeWebhook(payload: Buffer, signature: string) {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.configService.get('STRIPE_WEBHOOK_SECRET', ''),
      );
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata.orderId;

      await Promise.all([
        this.prisma.payment.update({
          where: { orderId },
          data: { gatewayPaymentId: intent.id, status: 'COMPLETED' },
        }),
        this.ordersService.updateStatus(orderId, {
          status: 'CONFIRMED',
          note: `Payment received via Stripe`,
        }),
      ]);
    }

    return { received: true };
  }

  async refund(orderId: string, amount?: number) {
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== 'COMPLETED') throw new BadRequestException('Payment not completed');

    const refundAmount = amount ?? Number(payment.amount);

    if (payment.gateway === 'RAZORPAY' && payment.gatewayPaymentId) {
      const refund = await this.razorpay.payments.refund(payment.gatewayPaymentId, {
        amount: Math.round(refundAmount * 100),
      });
      await this.prisma.payment.update({
        where: { orderId },
        data: {
          status: refundAmount >= Number(payment.amount) ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
          refundAmount,
          refundId: refund.id,
        },
      });
    } else if (payment.gateway === 'STRIPE' && payment.gatewayPaymentId) {
      const refund = await this.stripe.refunds.create({
        payment_intent: payment.gatewayPaymentId,
        amount: Math.round(refundAmount * 100),
      });
      await this.prisma.payment.update({
        where: { orderId },
        data: {
          status: 'REFUNDED',
          refundAmount,
          refundId: refund.id,
        },
      });
    }

    return { success: true };
  }
}
