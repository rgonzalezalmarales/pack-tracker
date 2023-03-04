import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from 'src/auth/services/auth.service';
import { Auth } from 'src/auth/decorators';
import { CreateUserDto } from 'src/auth/dto';
import { FiltersUserDto } from 'src/auth/dto/filters-user-dto';
import { User } from 'src/auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@ApiBearerAuth()
@Auth(ValidRoles.Admin)
@ApiTags('Usuarios')
@Controller('user')
export class UserController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: [User],
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  findAll(@Query() filters: FiltersUserDto) {
    return this.authService.findAll(filters);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(id, updateUserDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Delete(':id')
  delete(@Param('id', ParseMongoIdPipe) id: string) {
    return this.authService.deleteById(id);
  }
}
