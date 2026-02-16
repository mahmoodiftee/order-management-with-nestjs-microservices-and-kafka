import { Body, Controller, Get, Inject, OnModuleInit, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';

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

  @Post("order")
  createOrder(@Body() order: any) {
    this.kafkaClient.emit("order-created", order);
    return { message: "Order set to kafka", order };
  }
}
