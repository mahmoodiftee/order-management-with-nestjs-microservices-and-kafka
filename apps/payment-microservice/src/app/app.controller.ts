import { Controller, Get, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { PaymentService } from './payment.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService,
    private readonly paymentService: PaymentService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka
  ) { }

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.log('Payment Service initialized and connected to Kafka.');
  }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @EventPattern("process-payment")
  async handlePaymentProcess(@Payload() paymentData: any) {
    try {
      this.logger.log('Payment initiating for new order...');

      const savedPayment = await this.paymentService.createPayment({
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        status: 'completed',
      });

      this.kafkaClient.emit('payment-succeeded', {
        orderId: savedPayment.orderId,
        paymentId: savedPayment.id,
        amount: savedPayment.amount,
      });

      return { message: "Payment processed successfully", payment: savedPayment };
    } catch (error) {
      this.logger.error('Error processing payment', error);
      throw error;
    }
  }
}
