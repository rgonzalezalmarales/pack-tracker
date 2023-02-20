import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePackageDto {
  @ApiProperty({
    description: 'Adicionar direción a la rutade producto',
    example: 'Centro Principal ave 40. Los Pinos',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Producto entregado',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  finished?: boolean;
}
