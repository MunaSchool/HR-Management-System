import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { SystemRole } from '../employee-profile/enums/employee-profile.enums';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.employeeNumber, loginDto.password);
  }

  @Post('register')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(SystemRole.SYSTEM_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // TEMPORARY: Remove this endpoint after creating first admin
  @Post('register-first-admin')
  @HttpCode(HttpStatus.CREATED)
  async registerFirstAdmin(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
