import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, JwtTokenDto } from './dto';
// import { Auth, GetUser } from './decorators';
// import { User } from './entities/user.entity';
// import {GetUser} from './'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':id/logout')
  logout(@Param('id') id: string) {
    return this.authService.logout(id);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('refresh-token')
  checkAuthStatus(@Body() jwt: JwtTokenDto) {
    return this.authService.checkAuthStatus(jwt);
  }
}
