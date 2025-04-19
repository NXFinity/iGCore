import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { UsersModule } from '../../api/users/users.module';
import { Verification } from './templates/verification';

@Module({
  imports: [UsersModule],
  controllers: [EmailController],
  providers: [EmailService, Verification],
  exports: [EmailService],
})
export class EmailModule {}
