import { Controller, Get, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService,
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
  handlePaymentProcess(@Payload() order: any) {
    this.logger.log('Payment initiating for new order...');
    this.kafkaClient.emit('payment-succeeded', order);
    return { message: "Payment processed successfully", order };
  }
}
