import { Controller, Post, UseGuards, Body, Headers, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {

  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Body() dto: CreateUserDto) {
    return this.authService.login(dto);
  }

  @Post('auth/registration')
  async register(@Body() dto: CreateUserDto) {
    const {username, password} = dto
    return this.authService.registerUser(username, password);
  }

  @Get('auth')
  async verifyToken(@Headers() headers) {
    return this.authService.verifyToken(headers.authorization);
  }
}