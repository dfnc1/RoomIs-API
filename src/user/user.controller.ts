import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  UpdateUserDto,
  UserResponseDto,
} from './dto/user.dto';
import request from 'supertest';

@Controller('/api/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(request: RegisterDto): Promise<AuthResponseDto> {
    return await this.usersService.register(request);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(request: LoginDto): Promise<AuthResponseDto> {
    return await this.usersService.login(request);
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async get(request: any): Promise<UserResponseDto> {
    return await this.usersService.get({ id: request.id });
  }

  @Patch('/me')
  @HttpCode(HttpStatus.OK)
  async update(id: string, request: UpdateUserDto): Promise<UserResponseDto> {
    return await this.usersService.update(id, request);
  }

  @Delete('/me')
  @HttpCode(HttpStatus.OK)
  async delete(id: string): Promise<{ message: string }> {
    return await this.usersService.delete(id);
  }
}
