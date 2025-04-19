import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { Request } from 'express';
import { Public } from '../decorators/public.decorator';

@ApiTags('Authentication Management')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // # | ---------------------------------------------------------------------- | #
  // # | Public Routes
  // # | ---------------------------------------------------------------------- | #

  // # | ---------------------------------------------------------------------- | #
  // Register user
  // # | ---------------------------------------------------------------------- | #
  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // # | ---------------------------------------------------------------------- | #
  // Login user
  // # | ---------------------------------------------------------------------- | #
  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // # | ---------------------------------------------------------------------- | #
  // Verify Users Account
  // # | ---------------------------------------------------------------------- | #
  @Public()
  @Get('verify/:token')
  async verifyEmail(@Param('token') token: string) {
    const user = await this.authService.verifyEmail(token);
    return { message: 'Email verified successfully', user };
  }

  // # | ---------------------------------------------------------------------- | #
  // Forgot Password
  // # | ---------------------------------------------------------------------- | #
  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() email: string) {
    return this.authService.forgotPassword(email);
  }

  // # | ---------------------------------------------------------------------- | #
  // Resend Verification Email
  // # | ---------------------------------------------------------------------- | #
  @Public()
  @Post('resend-email')
  async resendEmail(@Body('email') email: string) {
    return this.authService.resendVerification(email);
  }

  // # | ---------------------------------------------------------------------- | #
  // # | Private Routes
  // # | ---------------------------------------------------------------------- | #

  // # | ---------------------------------------------------------------------- | #
  // Refresh Token
  // # | ---------------------------------------------------------------------- | #
  @Post('refresh-token')
  async refreshToken(@Body('token') token: string) {
    try {
      const newToken = await this.authService.refreshToken(token);
      return { accessToken: newToken };
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  // # | ---------------------------------------------------------------------- | #
  // Change Password
  // # | ---------------------------------------------------------------------- | #
  @Post('change-password')
  async changePassword(
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
    @Req() request: Request,
  ) {
    if (!request.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.changePassword(
      currentPassword,
      newPassword,
      request.user,
    );
  }
}
