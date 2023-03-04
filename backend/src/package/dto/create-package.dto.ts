import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreatePackageDto {
  @ApiProperty({
    description: 'Descripción del producto',
    example: 'rgonzalezalmarales@gmail.com',
  })
  @IsString()
  addresseeEmail: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Telefono Samsung J7',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Peso en kg',
    example: '2',
  })
  @IsNumber()
  @IsPositive()
  weight: number;

  @ApiProperty({
    example: 'Centro Principal ave 40. Los Pinos',
  })
  @IsString()
  address: string;
}
