import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  BookingResponse,
  CreateBookingDto,
  UpdateBookingDto,
} from './dto/booking.dto';
import { UserResponse } from '../user/dto/user.dto';
import { Asset, Booking, BookingStatus } from '../../generated/prisma/client';

@Injectable()
export class BookingService {
  startOfDay: Date = new Date();
  constructor(private prismaService: PrismaService) {}

  async create(
    user: UserResponse,
    request: CreateBookingDto,
  ): Promise<BookingResponse> {
    const asset: Asset | null = await this.prismaService.asset.findUnique({
      where: { id: request.assetId },
    });
    if (!asset) throw new HttpException('Asset not found', 404);

    const conflict: Booking | null = await this.prismaService.booking.findFirst(
      {
        where: {
          assetId: request.assetId,
          status: BookingStatus.APPROVED,
          AND: [
            { startTime: { lt: request.endTime } },
            { endTime: { gt: request.startTime } },
          ],
        },
      },
    );
    if (conflict)
      throw new HttpException(
        'Schedule conflicts with an already approved booking',
        400,
      );

    return new BookingResponse(
      await this.prismaService.booking.create({
        data: { userId: user.id, ...request },
      }),
    );
  }

  async getHistory(userId: string): Promise<BookingResponse[]> {
    const booking: Booking[] | null = await this.prismaService.booking.findMany(
      {
        where: { userId: userId },
      },
    );
    if (!booking) throw new HttpException('Booking not found', 404);

    return booking.map((item: Booking) => new BookingResponse(item));
  }

  async getCalendar(): Promise<BookingResponse[]> {
    const booking: Booking[] | null = await this.prismaService.booking.findMany(
      {
        where: {
          status: BookingStatus.APPROVED,
          startTime: { gte: this.getTodayRange().startOfDay },
          endTime: { lte: this.getTodayRange().endOfDay },
        },
      },
    );
    if (!booking) throw new HttpException('Booking not found', 404);

    return booking.map((item: Booking) => new BookingResponse(item));
  }

  async getPending(): Promise<BookingResponse[]> {
    const booking: Booking[] | null = await this.prismaService.booking.findMany(
      {
        where: {
          status: BookingStatus.PENDING,
          startTime: { gte: this.getTodayRange().startOfDay },
          endTime: { lte: this.getTodayRange().endOfDay },
        },
      },
    );
    if (!booking) throw new HttpException('Booking not found', 404);

    return booking.map((item: Booking) => new BookingResponse(item));
  }

  async update(
    bookingId: string,
    request: UpdateBookingDto,
  ): Promise<BookingResponse> {
    const booking: Booking | null = await this.prismaService.booking.findFirst({
      where: { id: bookingId },
    });
    if (!booking) throw new HttpException('Booking not found', 404);
    if (request.status === BookingStatus.REJECTED && !request.rejectionReason)
      throw new HttpException('Asset not found', 404);
    return new BookingResponse(
      await this.prismaService.booking.update({
        where: { id: bookingId },
        data: request,
      }),
    );
  }

  private getTodayRange() {
    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setUTCHours(23, 59, 59, 999);

    return { startOfDay, endOfDay };
  }
}
