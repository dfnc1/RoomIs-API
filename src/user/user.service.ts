import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  UserResponseDto,
} from './dto/user.dto';
import { User } from '../../generated/prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(request: RegisterDto): Promise<AuthResponseDto> {
    let user: UserResponseDto = await this.get({ email: request.email });
    if (user) throw new HttpException('Email already exist', 409);
    user = await this.create(user);
    return await this.generateToken(user);
  }

  async login(request: LoginDto): Promise<AuthResponseDto> {
    const user: UserResponseDto = await this.get({ email: request.email });
    const isMatch: boolean = await bcrypt.compare(
      request.password,
      user.password,
    );
    if (!user && !isMatch)
      throw new HttpException('Invalid email or password', 401);
    return this.generateToken(user);
  }

  async generateToken(user: UserResponseDto): Promise<AuthResponseDto> {
    return {
      token_type: 'Bearer',
      access_token: await this.jwtService.signAsync(user),
    };
  }

  async create(request: RegisterDto): Promise<UserResponseDto> {
    return await this.prismaService.user.create({
      data: { ...request, password: await bcrypt.hash(request.password, 10) },
    });
  }

  async get(condition: {
    id?: string;
    email?: string;
  }): Promise<UserResponseDto> {
    return await this.prismaService.user.findFirst({
      where: condition,
    });
  }

  async update(id: string, request: RegisterDto): Promise<UserResponseDto> {
    const user: UserResponseDto = await this.get({ email: request.email });
    if (user) throw new HttpException('Email already exist', 409);
    return await this.prismaService.user.update({
      where: { id: id },
      data: request,
    });
  }

  async delete(id: string): Promise<UserResponseDto> {
    const user: UserResponseDto = await this.get({ id: id });
    if (!user) throw new HttpException('User does not exist', 409);
    return await this.prismaService.user.delete({
      where: { id: id },
    });
  }
}
