import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/security/decorators/public.decorator';

@ApiTags('User Management')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // # | ---------------------------------------------------------------------- | #
  // # | Public Routes
  // # | ---------------------------------------------------------------------- | #

  // # | ---------------------------------------------------------------------- | #
  // # | Get All Users
  // # | ---------------------------------------------------------------------- | #
  @Public()
  @Get('all')
  async findAllUsers() {
    return this.usersService.findAll();
  }

  // # | ---------------------------------------------------------------------- | #
  // # | Find User By Email
  // # | ---------------------------------------------------------------------- | #
  @Get('email/:email')
  async findOneUserByEmail(@Param('email') email: string) {
    try {
      return await this.usersService.findByEmail(email);
    } catch (error) {
      throw new InternalServerErrorException('Failed to find user by email');
    }
  }

  // # | ---------------------------------------------------------------------- | #
  // # | Private Routes
  // # | ---------------------------------------------------------------------- | #

  // # | ---------------------------------------------------------------------- | #
  // Get users profile
  // # | ---------------------------------------------------------------------- | #
  @Get('profile')
  getProfile(@Req() req) {
    return this.usersService.getProfile(req.user);
  }

  // # | ---------------------------------------------------------------------- | #
  // Update user
  // # | ---------------------------------------------------------------------- | #
}
