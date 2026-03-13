import {
  Controller, Post, Body, Param, Req, UseGuards,
  Headers, RawBodyRequest,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('razorpay/create/:orderId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Razorpay order' })
  createRazorpayOrder(@Req() req: any, @Param('orderId') orderId: string) {
    return this.paymentsService.createRazorpayOrder(orderId, req.user.id);
  }

  @Post('razorpay/verify')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify Razorpay payment' })
  verifyRazorpay(@Body() dto: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderId: string;
  }) {
    return this.paymentsService.verifyRazorpayPayment(dto);
  }

  @Post('stripe/create/:orderId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe payment intent' })
  createStripeIntent(@Req() req: any, @Param('orderId') orderId: string) {
    return this.paymentsService.createStripePaymentIntent(orderId, req.user.id);
  }

  @Post('stripe/webhook')
  @Public()
  @ApiOperation({ summary: 'Stripe webhook handler' })
  stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleStripeWebhook(req.rawBody as Buffer, signature);
  }
}
