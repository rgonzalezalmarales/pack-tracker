import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Auth, GetUser, RoleProtected } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';
// import {GetUser} from './'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Get('refresh-token')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
