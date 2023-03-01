import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { PackStatus } from 'src/package/entities/package.entity';

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
}
