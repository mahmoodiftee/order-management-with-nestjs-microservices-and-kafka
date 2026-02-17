import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {
  constructor(private readonly appService: AppService) { }

  async onModuleInit() {
    console.log('[Payment-Service]: Initialized and ready.');
  }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @EventPattern("payment-process")
  handlePaymentProcess(@Payload() order: any) {
    console.log("[Payment-Service]: Received new order:", order);
    // return {message: "Order confirmed successfully", order};
  }
}
