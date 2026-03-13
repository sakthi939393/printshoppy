import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, phone: true, avatar: true, role: true, isVerified: true, walletBalance: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: string, data: { name?: string; phone?: string; avatar?: string }) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({ where: { userId }, orderBy: { isDefault: 'desc' } });
  }

  async createAddress(userId: string, data: any) {
    if (data.isDefault) {
      await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    return this.prisma.address.create({ data: { ...data, userId } });
  }

  async updateAddress(id: string, userId: string, data: any) {
    if (data.isDefault) {
      await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    return this.prisma.address.update({ where: { id }, data });
  }

  async deleteAddress(id: string, userId: string) {
    await this.prisma.address.deleteMany({ where: { id, userId } });
  }

  async getWishlist(userId: string) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
    });
  }

  async toggleWishlist(userId: string, productId: string) {
    const existing = await this.prisma.wishlist.findFirst({ where: { userId, productId } });
    if (existing) {
      await this.prisma.wishlist.delete({ where: { id: existing.id } });
      return { added: false };
    }
    await this.prisma.wishlist.create({ data: { userId, productId } });
    return { added: true };
  }
}
