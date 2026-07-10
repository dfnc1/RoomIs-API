import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  UpdateUserDto,
  UserResponse,
} from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('/api/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() request: RegisterDto): Promise<AuthResponse> {
    return await this.usersService.register(request);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() request: LoginDto): Promise<AuthResponse> {
    return await this.usersService.login(request);
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async get(@CurrentUser() user: UserResponse): Promise<UserResponse> {
    return await this.usersService.get(user.id);
  }

  @Patch('/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: UserResponse,
    @Body() request: UpdateUserDto,
  ): Promise<UserResponse> {
    return await this.usersService.update(user.id, request);
  }

  @Delete('/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async delete(
    @CurrentUser() user: UserResponse,
  ): Promise<{ message: string }> {
    return await this.usersService.delete(user.id);
  }
}
