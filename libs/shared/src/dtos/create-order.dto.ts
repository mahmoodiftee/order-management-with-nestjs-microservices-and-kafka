import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
    @ApiProperty({
        description: 'Unique identifier for the customer',
        example: 'cust-12345',
    })
    @IsString()
    @IsNotEmpty()
    customerId: string;

    @ApiProperty({
        description: 'Product identifier',
        example: 'prod-abc-123',
    })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({
        description: 'Quantity of items to order',
        example: 2,
        minimum: 1,
    })
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty({
        description: 'Total amount in USD',
        example: 99.99,
        minimum: 0.01,
    })
    @IsNumber()
    @Min(0.01)
    amount: number;
}
