import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  // # | ---------------------------------------------------------------------- | #
  // # | Basic User Information - Defaults
  // # | ---------------------------------------------------------------------- | #
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // # | ---------------------------------------------------------------------- | #
  // # | Basic User Information - Defaults
  // # | ---------------------------------------------------------------------- | #
  @ApiProperty()
  @IsString()
  username?: string;
  @ApiProperty()
  @IsString()
  email?: string;
  @ApiProperty()
  @IsString()
  password?: string;
}
