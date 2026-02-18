import { ApiProperty } from '@nestjs/swagger';

export class PaymentDto {
    @ApiProperty({
        description: 'Unique payment identifier',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Associated order ID',
        example: 1,
    })
    orderId: number;

    @ApiProperty({
        description: 'Payment amount in USD',
        example: 99.99,
    })
    amount: number;

    @ApiProperty({
        description: 'Payment status',
        example: 'completed',
    })
    status: string;

    @ApiProperty({
        description: 'Created timestamp',
        example: '2026-02-17T23:30:00Z',
    })
    createdAt: Date;
}
