import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminHash = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@printshoppy.com' },
    update: {},
    create: {
      email: 'admin@printshoppy.com',
      name: 'Super Admin',
      passwordHash: adminHash,
      role: 'SUPER_ADMIN',
      isVerified: true,
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Create test customer
  const customerHash = await bcrypt.hash('Customer@123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Test Customer',
      passwordHash: customerHash,
      role: 'CUSTOMER',
      isVerified: true,
    },
  });
  console.log('✅ Customer created:', customer.email);

  // Create categories
  const categories = [
    { name: 'T-Shirts & Apparel', slug: 'tshirts', image: '👕', description: 'Custom printed t-shirts and apparel' },
    { name: 'Mugs & Drinkware', slug: 'mugs', image: '☕', description: 'Custom mugs and drinkware' },
    { name: 'Business Cards', slug: 'business-cards', image: '💼', description: 'Professional business cards' },
    { name: 'Banners & Signage', slug: 'banners', image: '🎌', description: 'Banners and signage solutions' },
    { name: 'Stickers & Labels', slug: 'stickers', image: '✨', description: 'Custom stickers and labels' },
    { name: 'Notebooks & Diaries', slug: 'notebooks', image: '📓', description: 'Custom notebooks and diaries' },
    { name: 'Photo Products', slug: 'photo', image: '🖼️', description: 'Photo prints and frames' },
    { name: 'Packaging', slug: 'packaging', image: '📦', description: 'Custom packaging solutions' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, isActive: true },
    });
  }
  console.log('✅ Categories created');

  // Create sample products
  const tshirtCategory = await prisma.category.findUnique({ where: { slug: 'tshirts' } });
  const mugCategory = await prisma.category.findUnique({ where: { slug: 'mugs' } });
  const cardCategory = await prisma.category.findUnique({ where: { slug: 'business-cards' } });

  const products = [
    {
      categoryId: tshirtCategory!.id,
      name: 'Classic Custom T-Shirt',
      slug: 'classic-custom-tshirt',
      description: 'Premium quality 100% cotton t-shirt. Perfect for custom printing.',
      basePrice: 399,
      status: 'ACTIVE' as const,
      isCustomizable: true,
      productionDays: 3,
      tags: ['tshirt', 'cotton', 'casual'],
      sortOrder: 10,
      variants: [
        { name: 'S - White', sku: 'TSH-S-WHT', price: 399, size: 'S', color: 'White', colorHex: '#ffffff', stock: 100 },
        { name: 'M - White', sku: 'TSH-M-WHT', price: 399, size: 'M', color: 'White', colorHex: '#ffffff', stock: 100 },
        { name: 'L - White', sku: 'TSH-L-WHT', price: 399, size: 'L', color: 'White', colorHex: '#ffffff', stock: 100 },
        { name: 'XL - White', sku: 'TSH-XL-WHT', price: 449, size: 'XL', color: 'White', colorHex: '#ffffff', stock: 50 },
        { name: 'S - Black', sku: 'TSH-S-BLK', price: 399, size: 'S', color: 'Black', colorHex: '#000000', stock: 100 },
        { name: 'M - Black', sku: 'TSH-M-BLK', price: 399, size: 'M', color: 'Black', colorHex: '#000000', stock: 100 },
      ],
      printAreas: [
        { name: 'Front Center', x: 125, y: 50, width: 250, height: 300, unit: 'px', allowedDpi: 150 },
        { name: 'Back Center', x: 125, y: 50, width: 250, height: 300, unit: 'px', allowedDpi: 150 },
      ],
    },
    {
      categoryId: mugCategory!.id,
      name: 'Premium Photo Mug 11oz',
      slug: 'premium-photo-mug-11oz',
      description: 'High quality ceramic mug with sublimation printing. Dishwasher safe.',
      basePrice: 299,
      status: 'ACTIVE' as const,
      isCustomizable: true,
      productionDays: 2,
      tags: ['mug', 'ceramic', 'gift'],
      sortOrder: 9,
      variants: [
        { name: 'White - 11oz', sku: 'MUG-11-WHT', price: 299, color: 'White', colorHex: '#ffffff', stock: 200 },
        { name: 'Black - 11oz', sku: 'MUG-11-BLK', price: 349, color: 'Black', colorHex: '#000000', stock: 100 },
        { name: 'White - 15oz', sku: 'MUG-15-WHT', price: 399, color: 'White', colorHex: '#ffffff', stock: 100 },
      ],
      printAreas: [
        { name: 'Mug Print Area', x: 50, y: 50, width: 400, height: 200, unit: 'px', allowedDpi: 150 },
      ],
    },
    {
      categoryId: cardCategory!.id,
      name: 'Premium Business Cards',
      slug: 'premium-business-cards',
      description: '350gsm premium business cards with UV coating. Pack of 100.',
      basePrice: 499,
      status: 'ACTIVE' as const,
      isCustomizable: true,
      minQuantity: 100,
      productionDays: 2,
      tags: ['business-card', 'networking', 'professional'],
      sortOrder: 8,
      variants: [
        { name: '100 pcs - Matte', sku: 'BC-100-MAT', price: 499, stock: 0 },
        { name: '250 pcs - Matte', sku: 'BC-250-MAT', price: 899, stock: 0 },
        { name: '500 pcs - Matte', sku: 'BC-500-MAT', price: 1499, stock: 0 },
        { name: '100 pcs - Glossy', sku: 'BC-100-GLS', price: 599, stock: 0 },
        { name: '250 pcs - Glossy', sku: 'BC-250-GLS', price: 999, stock: 0 },
      ],
      printAreas: [
        { name: 'Front', x: 0, y: 0, width: 1050, height: 600, unit: 'px', allowedDpi: 300 },
        { name: 'Back', x: 0, y: 0, width: 1050, height: 600, unit: 'px', allowedDpi: 300 },
      ],
    },
  ];

  for (const productData of products) {
    const { variants, printAreas, ...productFields } = productData;
    const existing = await prisma.product.findUnique({ where: { slug: productFields.slug } });
    if (!existing) {
      await prisma.product.create({
        data: {
          ...productFields,
          variants: { create: variants },
          printAreas: { create: printAreas },
        },
      });
    }
  }
  console.log('✅ Products created');

  // Create sample coupons
  await prisma.coupon.upsert({
    where: { code: 'FIRST10' },
    update: {},
    create: {
      code: 'FIRST10',
      type: 'PERCENTAGE',
      value: 10,
      minOrderAmount: 299,
      maxDiscount: 200,
      usageLimit: 1000,
      isActive: true,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'FLAT100' },
    update: {},
    create: {
      code: 'FLAT100',
      type: 'FIXED',
      value: 100,
      minOrderAmount: 599,
      usageLimit: 500,
      isActive: true,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'FREESHIP' },
    update: {},
    create: {
      code: 'FREESHIP',
      type: 'FREE_SHIPPING',
      value: 99,
      minOrderAmount: 499,
      usageLimit: 2000,
      isActive: true,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  });
  console.log('✅ Coupons created');

  // Create sample templates
  await prisma.template.create({
    data: {
      name: 'Bold Typography',
      description: 'Simple bold text design',
      isPublic: true,
      category: 'Text',
      tags: ['bold', 'minimal', 'text'],
      canvasJson: {
        version: '5.3.0',
        objects: [
          {
            type: 'i-text',
            text: 'YOUR TEXT HERE',
            fontSize: 48,
            fontWeight: 'bold',
            fill: '#000000',
            left: 100,
            top: 200,
            fontFamily: 'Arial',
          },
        ],
        background: '#ffffff',
      },
    },
  });
  console.log('✅ Templates created');

  console.log('\n🎉 Database seeded successfully!');
  console.log('📧 Admin: admin@printshoppy.com / Admin@123');
  console.log('👤 Customer: customer@example.com / Customer@123');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
