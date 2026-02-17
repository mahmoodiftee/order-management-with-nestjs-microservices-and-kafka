import { Controller, Get, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka
  ) { }

  async onModuleInit() {
    await this.kafkaClient.connect();
  }


  @Get()
  getData() {
    return this.appService.getData();
  }

  @EventPattern("order-created")
  handleOrderCreated(@Payload() order: any) {
    this.logger.log(`Notification: Order received and being processed: ${JSON.stringify(order)}`);
  }

  @EventPattern("payment-succeeded")
  handlePaymentSucceeded(@Payload() order: any) {
    this.logger.log(`Notification: Payment succeeded for order: ${JSON.stringify(order)}`);
  }

}
