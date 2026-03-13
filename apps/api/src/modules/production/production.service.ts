import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadsService } from '../uploads/uploads.service';
import * as puppeteer from 'puppeteer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Injectable()
export class ProductionService {
  constructor(
    private prisma: PrismaService,
    private uploadsService: UploadsService,
  ) {}

  async getPrintQueue(page = 1, limit = 20, status?: string) {
    const where: any = {};
    if (status) where.status = status;

    const [total, jobs] = await Promise.all([
      this.prisma.printJob.count({ where }),
      this.prisma.printJob.findMany({
        where,
        include: {
          order: {
            include: {
              items: {
                include: {
                  product: { select: { id: true, name: true } },
                  design: true,
                },
              },
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
        orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return { jobs, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async assignJob(jobId: string, staffId: string) {
    const job = await this.prisma.printJob.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Print job not found');

    return this.prisma.printJob.update({
      where: { id: jobId },
      data: {
        status: 'ASSIGNED',
        assignedTo: staffId,
        startedAt: new Date(),
      },
    });
  }

  async updateJobStatus(jobId: string, status: string, notes?: string) {
    const job = await this.prisma.printJob.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Print job not found');

    const updateData: any = { status, notes };
    if (status === 'COMPLETED') updateData.completedAt = new Date();

    const [updatedJob] = await Promise.all([
      this.prisma.printJob.update({
        where: { id: jobId },
        data: updateData,
      }),
      // Update order status based on print job status
      status === 'COMPLETED'
        ? this.prisma.order.update({
            where: { id: job.orderId },
            data: { status: 'DISPATCHED' },
          })
        : null,
    ]);

    return updatedJob;
  }

  async generatePrintFile(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: { include: { printAreas: true } },
            design: true,
          },
        },
        user: { select: { name: true, email: true } },
        address: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    // Generate PDF with print specifications
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Cover page
    const coverPage = pdfDoc.addPage([595, 842]);
    coverPage.drawText('PRINT JOB SHEET', {
      x: 50, y: 800, size: 24, font: boldFont, color: rgb(0.1, 0.1, 0.1),
    });
    coverPage.drawText(`Order: ${order.orderNumber}`, {
      x: 50, y: 760, size: 14, font, color: rgb(0.3, 0.3, 0.3),
    });
    coverPage.drawText(`Customer: ${order.user.name}`, {
      x: 50, y: 740, size: 12, font,
    });
    coverPage.drawText(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, {
      x: 50, y: 720, size: 12, font,
    });
    coverPage.drawText(`Items: ${order.items.length}`, {
      x: 50, y: 700, size: 12, font,
    });

    // Item pages
    let yPos = 680;
    for (const item of order.items) {
      if (yPos < 100) {
        const newPage = pdfDoc.addPage([595, 842]);
        yPos = 800;
      }

      coverPage.drawText(`Product: ${item.product.name}`, {
        x: 50, y: yPos, size: 11, font: boldFont,
      });
      coverPage.drawText(`Quantity: ${item.quantity}`, {
        x: 50, y: yPos - 20, size: 10, font,
      });
      if (item.design) {
        coverPage.drawText(`Design: ${item.design.name}`, {
          x: 50, y: yPos - 40, size: 10, font,
        });
      }
      yPos -= 80;
    }

    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes);

    // Upload to R2
    const key = `print-files/${orderId}/print-sheet.pdf`;
    await this.uploadsService.uploadBase64(
      `data:application/pdf;base64,${buffer.toString('base64')}`,
      key,
      'application/pdf',
    );

    const printFileUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    // Update print job
    await this.prisma.printJob.upsert({
      where: { orderId },
      create: {
        orderId,
        status: 'QUEUED',
        priority: 5,
        printFiles: { url: printFileUrl },
      },
      update: {
        printFiles: { url: printFileUrl },
      },
    });

    return { printFileUrl };
  }

  async getStats() {
    const [queued, printing, completed, failed] = await Promise.all([
      this.prisma.printJob.count({ where: { status: 'QUEUED' } }),
      this.prisma.printJob.count({ where: { status: 'PRINTING' } }),
      this.prisma.printJob.count({ where: { status: 'COMPLETED' } }),
      this.prisma.printJob.count({ where: { status: 'FAILED' } }),
    ]);

    return { queued, printing, completed, failed };
  }
}
