import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);

    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>
    ) { }

    async createOrder(orderData: Partial<Order>): Promise<Order> {
        try {
            const order = this.orderRepository.create(orderData);
            const savedOrder = await this.orderRepository.save(order);
            this.logger.log(`Order created in database: ${savedOrder.id}`);
            return savedOrder;
        } catch (error) {
            this.logger.error('Error creating order', error);
            throw error;
        }
    }

    async findAll(): Promise<Order[]> {
        return this.orderRepository.find();
    }

    async findOne(id: number): Promise<Order | null> {
        return this.orderRepository.findOne({ where: { id } });
    }

    async updateStatus(id: number, status: string): Promise<Order | null> {
        await this.orderRepository.update(id, { status });
        return this.findOne(id);
    }
}
