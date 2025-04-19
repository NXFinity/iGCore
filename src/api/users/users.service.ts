import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) public usersRepository: Repository<User>,
  ) {}
  // # | ---------------------------------------------------------------------- | #
  // # | User Management
  // # | ---------------------------------------------------------------------- | #
  // Get all users
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // # | ---------------------------------------------------------------------- | #
  // Get user by ID
  // # | ---------------------------------------------------------------------- | #
  async findOne(id: string) {
    return this.usersRepository.findOneBy({ id });
  }

  // # | ---------------------------------------------------------------------- | #
  // Create a new user
  // # | ---------------------------------------------------------------------- | #
  async create(user: {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
  }) {
    return await this.usersRepository.save(user);
  }

  // # | ---------------------------------------------------------------------- | #
  // Find user by verification token
  // # | ---------------------------------------------------------------------- | #
  async findByVerification(verificationToken: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { verifyToken: verificationToken },
      });
      if (!user) {
        throw new InternalServerErrorException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to find user by verification token',
      );
    }
  }

  // # | ---------------------------------------------------------------------- | #
  // Get user profile
  // # | ---------------------------------------------------------------------- | #
  async getProfile(user: User) {
    return this.usersRepository.findOne({
      where: { id: user.id },
    });
  }

  // Update user
  async update(id: string, user: User) {
    return this.usersRepository.update(id, user);
  }
  // Delete user
  async remove(id: string) {
    return this.usersRepository.delete(id);
  }
  // Find user by email
  async findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }
  // Find user by username
  async findByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }
}
