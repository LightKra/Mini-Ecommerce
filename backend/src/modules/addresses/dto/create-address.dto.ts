import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name for delivery' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiProperty({ example: '123 Main St', description: 'Address line 1' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  addressLine1: string;

  @ApiProperty({ example: 'Apt 4B', description: 'Address line 2', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  addressLine2?: string;

  @ApiProperty({ example: 'New York', description: 'City' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'NY', description: 'Province/State', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  province?: string;

  @ApiProperty({ example: 'USA', description: 'Country' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  country: string;

  @ApiProperty({ example: '10001', description: 'Postal code', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;
}

