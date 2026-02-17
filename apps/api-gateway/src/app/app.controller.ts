import { Body, Controller, Get, Inject, Logger, OnModuleInit, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';

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

  @Post("order")
  createOrder(@Body() order: any) {
    this.logger.log('Event emitted for order creation');
    this.kafkaClient.emit("order-created", order);
    return { message: "Order set to kafka", order };
  }
}
