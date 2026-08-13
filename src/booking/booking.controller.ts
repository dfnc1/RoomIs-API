import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import {
  BookingResponse,
  CreateBookingDto,
  UpdateBookingDto,
} from './dto/booking.dto';
import { UserResponse } from '../user/dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ROLE, Roles } from '../auth/decorators/roles.decorator';

@Controller('/api/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: UserResponse,
    @Body() request: CreateBookingDto,
  ): Promise<BookingResponse> {
    return await this.bookingService.create(user, request);
  }

  @Get('/history')
  @HttpCode(HttpStatus.OK)
  async getHistory(
    @CurrentUser() user: UserResponse,
  ): Promise<BookingResponse[]> {
    return await this.bookingService.getHistory(user);
  }

  @Get('/calendar')
  @HttpCode(HttpStatus.OK)
  async getCalendar(): Promise<BookingResponse[]> {
    return await this.bookingService.getCalendar();
  }

  @Get('/pending')
  @HttpCode(HttpStatus.OK)
  async getPending(): Promise<BookingResponse[]> {
    return await this.bookingService.getPending();
  }

  @Patch('/:id/status')
  @HttpCode(HttpStatus.OK)
  @Roles([ROLE.ADMIN])
  async update(
    @Param('id') bookingId: string,
    @Body() request: UpdateBookingDto,
  ): Promise<BookingResponse> {
    return await this.bookingService.update(bookingId, request);
  }
}
