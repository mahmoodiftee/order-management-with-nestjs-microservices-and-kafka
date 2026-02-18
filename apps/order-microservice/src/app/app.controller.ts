import { Controller, Get, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { OrderService } from './order.service';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {
  private readonly logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    private readonly orderService: OrderService,
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
  async handleOrderCreated(@Payload() order: any) {
    try {
      this.logger.log(`Received new order: ${JSON.stringify(order)}`);

      const savedOrder = await this.orderService.createOrder({
        customerId: order.customerId,
        productId: order.productId,
        quantity: order.quantity,
        amount: order.amount,
        status: 'processing',
      });

      this.kafkaClient.emit('process-payment', {
        orderId: savedOrder.id,
        amount: savedOrder.amount,
      });

      return { message: 'Order created successfully', order: savedOrder };
    } catch (error) {
      this.logger.error('Error handling order', error);
      throw error;
    }
  }
}
