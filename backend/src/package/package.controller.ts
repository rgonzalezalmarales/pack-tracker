import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Query,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { Package } from './entities/package.entity';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from 'src/auth/decorators';
import { UpdatePackageDto } from './dto';
import { FiltersPackageDto } from './dto/filters-package.dto';

@ApiBearerAuth()
@Auth(ValidRoles.DeliviryMan, ValidRoles.OperationsManager, ValidRoles.Admin)
@ApiTags('Paquetes')
@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Package,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packageService.create(createPackageDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: Package,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  findAll(@Query() filters: FiltersPackageDto) {
    console.log(filters);
    return this.packageService.findAll(filters);
  }

  @Get(':identifier/status')
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Este endpoint se utiliza para consultar el estus de paquete por parte del receptor',
    type: Package,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiParam({
    name: 'identifier',
    example: '097497c8-3443-4547-b931-52e8897d2098',
    description: 'Identificador único del paquete',
  })
  @Get(':identifier/status')
  getStatus(@Param('identifier') identifier: string) {
    return this.packageService.getSatusByIdent(identifier);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packageService.update(id, updatePackageDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.packageService.remove(+id);
  // }
}
