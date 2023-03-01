// import { ApiProperty, PartialType } from '@nestjs/swagger';
// import { IsDate, IsOptional } from 'class-validator';

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PackStatus } from '../entities/package.entity';

// import { PaginationDto } from 'src/common/dto/pagination.dto';

// export class PackFiltersDto extends PartialType(PaginationDto) {
//   @ApiProperty({
//     example: new Date(Date.now()),
//     description: 'Filtrar por fecha',
//     required: false,
//   })
//   @IsOptional()
//   @IsDate()
//   date: Date;

//   @ApiProperty({
//     example: new Date(Date.now()),
//     description: 'Fecha mayor o igual',
//     required: false,
//   })
//   @IsOptional()
//   @IsDate()
//   dateGte: Date;

//   @ApiProperty({
//     example: new Date(Date.now()),
//     description: 'Fecha menor o igual',
//     required: false,
//   })
//   @IsOptional()
//   @IsDate()
//   dateLte: Date;

//   // @ApiProperty({
//   //   example: new Date(Date.now()),
//   //   description: 'Fecha menor o igual',
//   //   required: false,
//   // })
//   // @IsOptional()
//   // @IsDate()
//   // status: PackStatus;
// }

export class FiltersPackageDto extends PartialType(PaginationDto) {
  // // @ApiProperty({
  // //   example: new Date(Date.now()),
  // //   description: 'Filtrar por fecha',
  // //   required: false,
  // // })
  // // @IsOptional()
  // // @IsDate()
  // date: Date;

  @ApiProperty({
    example: new Date(Date.now()),
    description: 'Fecha mayor o igual',
    required: false,
  })
  @IsOptional()
  @IsDate()
  dateGte: Date;

  @ApiProperty({
    example: new Date(Date.now()),
    description: 'Fecha menor o igual',
    required: false,
  })
  @IsOptional()
  @IsDate()
  dateLte: Date;

  @ApiProperty({
    example: PackStatus.Transit,
    description: 'Estatus del paquete',
    required: false,
    enum: PackStatus,
  })
  @IsOptional()
  @IsString()
  status: PackStatus;

  @ApiProperty({
    example: 'Libro: El Señor De Los Cielos',
    description: 'Descripción del paquete',
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;
}
