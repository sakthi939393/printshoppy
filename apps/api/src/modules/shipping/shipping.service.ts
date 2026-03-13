import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ShippingService {
  private token: string | null = null;
  private baseUrl = 'https://apiv2.shiprocket.in/v1/external';

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async authenticate() {
    const response = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/auth/login`, {
        email: this.configService.get('SHIPROCKET_EMAIL'),
        password: this.configService.get('SHIPROCKET_PASSWORD'),
      })
    );
    this.token = response.data.token;
    return this.token;
  }

  private getHeaders() {
    return { Authorization: `Bearer ${this.token}` };
  }

  async checkServiceability(pincode: string, weight: number = 0.5) {
    if (!this.token) await this.authenticate();
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/courier/serviceability`, {
          params: { pickup_postcode: '110001', delivery_postcode: pincode, weight, cod: 0 },
          headers: this.getHeaders(),
        })
      );
      return response.data;
    } catch { return { available: false }; }
  }

  async createShipment(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { address: true, user: true, items: { include: { product: true } } },
    });
    if (!order || !order.address) return null;

    if (!this.token) await this.authenticate();

    const payload = {
      order_id: order.orderNumber,
      order_date: order.createdAt.toISOString(),
      billing_customer_name: order.user.name,
      billing_address: order.address.line1,
      billing_city: order.address.city,
      billing_state: order.address.state,
      billing_pincode: order.address.pincode,
      billing_email: order.user.email,
      billing_phone: order.address.phone,
      order_items: order.items.map(item => ({
        name: item.product.name,
        sku: item.productId,
        units: item.quantity,
        selling_price: Number(item.unitPrice),
      })),
      payment_method: 'Prepaid',
      sub_total: Number(order.totalAmount),
      weight: 0.5,
    };

    const response = await firstValueFrom(
      this.httpService.post(`${this.baseUrl}/orders/create/adhoc`, payload, {
        headers: this.getHeaders(),
      })
    );

    if (response.data.order_id) {
      await this.prisma.shipment.upsert({
        where: { orderId },
        create: { orderId, shiprocketId: String(response.data.order_id), status: 'PENDING' },
        update: { shiprocketId: String(response.data.order_id) },
      });
    }

    return response.data;
  }

  async trackShipment(orderId: string) {
    const shipment = await this.prisma.shipment.findUnique({ where: { orderId } });
    if (!shipment?.awbCode) return null;

    if (!this.token) await this.authenticate();
    const response = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/courier/track/awb/${shipment.awbCode}`, {
        headers: this.getHeaders(),
      })
    );
    return response.data;
  }
}
