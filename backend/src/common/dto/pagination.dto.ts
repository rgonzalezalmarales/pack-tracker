import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    default: 0,
    description: '¿Cuántas filas quieres saltar?',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  offset: number;

  @ApiProperty({
    default: 10,
    description: '¿Cuántas filas necesitas?',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Min(1)
  limit: number;

  @ApiProperty({
    example: '-createdAt',
    description: 'Campo para orden, el signo (-) significa es ASC',
    required: false,
  })
  @IsOptional()
  @IsString()
  sort: string;
}
