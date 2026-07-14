import {
  Body,
  Controller,
  Get,
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

@Controller('/api/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(
    @CurrentUser() user: UserResponse,
    @Body() request: CreateBookingDto,
  ): Promise<BookingResponse> {
    return await this.bookingService.create(user, request);
  }

  @Get('/history')
  async getHistory(
    @CurrentUser() user: UserResponse,
  ): Promise<BookingResponse[]> {
    return await this.bookingService.getHistory(user);
  }

  @Get('/calendar')
  async getCalendar(): Promise<BookingResponse[]> {
    return await this.bookingService.getCalendar();
  }

  @Get('/pending')
  async getPending(): Promise<BookingResponse[]> {
    return await this.bookingService.getPending();
  }

  @Patch('/:id')
  async update(
    @Param('id') bookingId: string,
    @Body() request: UpdateBookingDto,
  ): Promise<BookingResponse> {
    return await this.bookingService.update(bookingId, request);
  }
}
