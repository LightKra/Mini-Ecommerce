import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Image URL' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  url: string;

  @ApiProperty({ example: 'iPhone 15 front view', description: 'Image alt text', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  alt?: string;
}

