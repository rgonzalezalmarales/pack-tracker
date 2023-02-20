import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

import { Address } from '../entities/package.entity';

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
    example: 'Centro Principal ave 40. Los Pinos',
  })
  @IsString()
  address: string;
}
