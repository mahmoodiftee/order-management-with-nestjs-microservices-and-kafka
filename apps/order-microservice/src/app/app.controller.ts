import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getData() {
    return this.appService.getData();
  }
  @EventPattern("order-created")
  handleOrderCreated(@Payload() order: any) {
    console.log('[Order-Service]: Received new order:', order);

    // return { message: "Order created successfully", order };
  }
}
