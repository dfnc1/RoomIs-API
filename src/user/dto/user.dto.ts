import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import { PartialType, PickType } from '@nestjs/mapped-types';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class LoginDto extends PickType(RegisterDto, [
  'email',
  'password',
] as const) {}

export class UpdateUserDto extends PartialType(RegisterDto) {}

export class AuthResponse {
  token_type: 'Bearer';
  access_token: string;
}

export class UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;

  @Transform(({ value }) => value?.toISOString())
  createdAt: Date;

  @Transform(({ value }) => value?.toISOString())
  updatedAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
