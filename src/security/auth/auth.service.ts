import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../../api/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { EmailService } from 'src/tools/email/email.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
    private readonly _emailService: EmailService,
  ) {}
  // # | ---------------------------------------------------------------------- | #
  // # | Authentication Service - Users
  // # | ---------------------------------------------------------------------- | #

  // # | ---------------------------------------------------------------------- | #
  // Validate user
  // # | ---------------------------------------------------------------------- | #
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this._usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
  }

  // # | ---------------------------------------------------------------------- | #
  // Register user
  // # | ---------------------------------------------------------------------- | #
  async register(registerDto: RegisterDto) {
    if (await this._usersService.findByEmail(registerDto.email)) {
      return { message: 'User with that email already exists' };
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    // Use the central create method that sets up all user relationships
    const user = await this._usersService.create({
      username: registerDto.username,
      email: registerDto.email,
      password: hashedPassword,
      isVerified: false,
    });
    await this._emailService.sendVerificationEmail(user);
    const { password, ...result } = user;
    return result;
  }

  // # | ---------------------------------------------------------------------- | #
  // Login user
  // # | ---------------------------------------------------------------------- | #
  async login(login: LoginDto) {
    const user = await this.validateUser(login.email, login.password);
    if (!user) {
      return { message: 'Invalid email or password' };
    }
    if (!user.isVerified) {
      return { message: 'Please verify your email before logging in' };
    }
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this._jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
  // # | ---------------------------------------------------------------------- | #
  // Generate token
  // # | ---------------------------------------------------------------------- | #
  async generateToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this._jwtService.sign(payload),
    };
  }

  // # | ---------------------------------------------------------------------- | #
  // Verify token
  // # | ---------------------------------------------------------------------- | #
  async verifyEmail(token: string) {
    // Find the user associated with the verification token
    const user = await this._usersService.findByVerification(token);
    if (!user || user.verifyToken !== token) {
      // Return a meaningful response instead of throwing an error
      return { message: 'Invalid or expired verification token' };
    }
    // Set the user's isVerified property to true, remove the verification token and save the user
    user.isVerified = true;
    user.verifyToken = null;
    await this._usersService.usersRepository.save(user);
    return { message: 'Email verified successfully', user };
  }

  // # | ---------------------------------------------------------------------- | #
  // Refresh token
  // # | ---------------------------------------------------------------------- | #
  async refreshToken(token: string) {
    const payload = this._jwtService.verify(token);
    return this._jwtService.sign(payload);
  }

  // # | ---------------------------------------------------------------------- | #
  // Forgot password
  // # | ---------------------------------------------------------------------- | #
  async forgotPassword(email: string) {
    // Generate token
    const token = this.generateToken(email);
    // Send email
    return this._emailService.sendForgotPasswordEmail(email, token);
  }

  // # | ---------------------------------------------------------------------- | #
  // Resend verification email
  // # | ---------------------------------------------------------------------- | #
  async resendVerification(email: string) {
    if (!email || email.trim() === '') {
      return { message: 'Email parameter is missing or empty' };
    }
    const user = await this._usersService.findByEmail(email);
    if (!user) {
      return { message: 'User not found' };
    }
    if (user.verifyToken && user.verifyToken.trim() !== '') {
      await this._emailService.sendVerificationEmail(user);
      return { message: 'Verification email sent successfully' };
    }
    return { message: 'User is already verified' };
  }

  // # | ---------------------------------------------------------------------- | #
  // Change password
  // # | ---------------------------------------------------------------------- | #
  async changePassword(
    currentPassword: string,
    newPassword: string,
    user: any,
  ) {
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      throw new HttpException(
        'Invalid current password',
        HttpStatus.BAD_REQUEST,
      );
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await this._usersService.usersRepository.save(user);
    return { message: 'Password changed successfully' };
  }
}
