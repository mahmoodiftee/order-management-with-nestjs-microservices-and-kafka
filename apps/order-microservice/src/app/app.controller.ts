import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {
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
    console.log('[Order-Service]: Received new order:', order);
    this.kafkaClient.emit('payment-process', order);
    return { message: "Order created successfully", order };
  }
}
