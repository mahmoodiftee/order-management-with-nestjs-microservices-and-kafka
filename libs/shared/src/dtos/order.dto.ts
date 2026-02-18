import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
    @ApiProperty({
        description: 'Unique order identifier',
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: 'Customer identifier',
        example: 'cust-12345',
    })
    customerId: string;

    @ApiProperty({
        description: 'Product identifier',
        example: 'prod-abc-123',
    })
    productId: string;

    @ApiProperty({
        description: 'Quantity ordered',
        example: 2,
    })
    quantity: number;

    @ApiProperty({
        description: 'Total amount in USD',
        example: 99.99,
    })
    amount: number;

    @ApiProperty({
        description: 'Order status',
        example: 'pending',
    })
    status: string;

    @ApiProperty({
        description: 'Created timestamp',
        example: '2026-02-17T23:30:00Z',
    })
    createdAt: Date;
}
