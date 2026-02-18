import { Body, Controller, Get, Inject, Logger, OnModuleInit, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateOrderDto, OrderDto } from '@shared';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';

@ApiTags('orders')
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
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is running' })
  getData() {
    return this.appService.getData();
  }

  @Post('order')
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order created and sent to Kafka',
    type: OrderDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      this.logger.log('Event emitted for order creation');

      const orderEvent = {
        ...createOrderDto,
        orderId: Date.now(),
        status: 'pending',
        createdAt: new Date(),
      };

      this.kafkaClient.emit('order-created', orderEvent);

      return {
        message: 'Order created and processing started',
        order: orderEvent,
      };
    } catch (error) {
      this.logger.error('Error creating order', error);
      throw new HttpException(
        'Failed to create order',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
