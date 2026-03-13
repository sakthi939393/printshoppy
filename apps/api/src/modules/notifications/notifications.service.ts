import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor(private prisma: PrismaService, private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('SMTP_HOST'),
      port: configService.get('SMTP_PORT', 587),
      auth: { user: configService.get('SMTP_USER'), pass: configService.get('SMTP_PASS') },
    });
  }

  async create(userId: string, title: string, message: string, type: string, data?: any) {
    return this.prisma.notification.create({ data: { userId, title, message, type, data } });
  }

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markRead(id: string, userId: string) {
    return this.prisma.notification.update({ where: { id }, data: { isRead: true } });
  }

  async sendOrderEmail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: `"PrintShoppy" <${this.configService.get('SMTP_USER')}>`,
        to, subject, html,
      });
    } catch (error) {
      console.error('Email send failed:', error);
    }
  }
}
