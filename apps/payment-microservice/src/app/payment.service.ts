import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);

    constructor(
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>
    ) { }

    async createPayment(paymentData: Partial<Payment>): Promise<Payment> {
        try {
            const payment = this.paymentRepository.create(paymentData);
            const savedPayment = await this.paymentRepository.save(payment);
            this.logger.log(`Payment created in database: ${savedPayment.id}`);
            return savedPayment;
        } catch (error) {
            this.logger.error('Error creating payment', error);
            throw error;
        }
    }

    async findAll(): Promise<Payment[]> {
        return this.paymentRepository.find();
    }

    async findOne(id: number): Promise<Payment | null> {
        return this.paymentRepository.findOne({ where: { id } });
    }

    async updateStatus(id: number, status: string): Promise<Payment | null> {
        await this.paymentRepository.update(id, { status });
        return this.findOne(id);
    }
}
