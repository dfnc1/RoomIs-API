import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  UpdateUserDto,
  UserResponse,
} from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../generated/prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(request: RegisterDto): Promise<AuthResponse> {
    const user: User | null = await this.prismaService.user.findUnique({
      where: { email: request.email },
    });
    if (user) throw new HttpException('Email already exist', 409);
    return await this.generateToken(await this.create(request));
  }

  async login(request: LoginDto): Promise<AuthResponse> {
    const user: User | null = await this.prismaService.user.findUnique({
      where: { email: request.email },
    });
    if (!user) throw new HttpException('Invalid email or password', 401);
    const isMatch: boolean = await bcrypt.compare(
      request.password,
      user.password,
    );
    if (!isMatch) throw new HttpException('Invalid email or password', 401);
    return this.generateToken(user);
  }

  async generateToken(user: User): Promise<AuthResponse> {
    return {
      token_type: 'Bearer',
      access_token: await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }

  async create(request: RegisterDto): Promise<User> {
    return this.prismaService.user.create({
      data: { ...request, password: await bcrypt.hash(request.password, 10) },
    });
  }

  async get(id: string): Promise<UserResponse> {
    const user: User | null = await this.prismaService.user.findFirst({
      where: { id: id },
    });
    if (!user) throw new HttpException('User does not exist', 404);
    return new UserResponse(user);
  }

  async update(id: string, request: UpdateUserDto): Promise<UserResponse> {
    if (request.email) {
      const existing: User | null = await this.prismaService.user.findFirst({
        where: { email: request.email },
      });
      if (existing && existing.id !== id)
        throw new HttpException('Email already exist', 409);
    }
    if (request.password)
      request.password = await bcrypt.hash(request.password, 10);
    return new UserResponse(
      await this.prismaService.user.update({
        where: { id: id },
        data: request,
      }),
    );
  }

  async delete(id: string): Promise<{ message: string }> {
    await this.get(id);
    await this.prismaService.user.delete({
      where: { id: id },
    });
    return {
      message: 'Account deleted successfully',
    };
  }
}
