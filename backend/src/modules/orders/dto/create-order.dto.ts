import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'Address ID for delivery' })
  @IsNotEmpty()
  @IsNumber()
  addressId: number;
}

