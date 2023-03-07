import { Controller, Post, Body, Get, Param } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './services/auth.service';
import { LoginUserDto, JwtTokenDto } from './dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';

// @ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':id/logout')
  logout(@Param('id', ParseMongoIdPipe) id: string) {
    return this.authService.logout(id);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('refresh-token')
  checkAuthStatus(@Body() jwt: JwtTokenDto) {
    return this.authService.checkAuthStatus(jwt);
  }
}
