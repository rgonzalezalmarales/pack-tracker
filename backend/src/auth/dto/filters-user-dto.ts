import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ValidRoles } from '../interfaces';

export class FiltersUserDto extends PartialType(PaginationDto) {
  @ApiProperty({
    example: 'angel@gmail.com',
    description: 'Email del usuario',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Angel García Salsegames',
    description: 'Nombre completo del usuario',
    required: false,
  })
  @IsOptional()
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'true',
    description: 'Buscar usuarios activos o no',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  active: boolean;

  @ApiProperty({
    example: ValidRoles.Admin,
    description: 'Buscar usuarios por rol',
    enum: ValidRoles,
    required: false,
  })
  @IsOptional()
  @IsString()
  role: string;
}
