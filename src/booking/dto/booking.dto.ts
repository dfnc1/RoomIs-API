import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BookingStatus } from '../../../generated/prisma/enums';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endTime: Date;
}

export class UpdateBookingDto {
  @IsEnum(BookingStatus)
  @IsNotEmpty()
  status: BookingStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string | null;
}

export class BookingResponse {
  id: string;
  userId: string;
  assetId: string;

  @Transform(({ value }) => value?.toISOString())
  startTime: Date;

  @Transform(({ value }) => value?.toISOString())
  endTime: Date;

  status: BookingStatus;

  @Transform(({ value }) => value?.toISOString())
  createdAt: Date;

  @Transform(({ value }) => value?.toISOString())
  updatedAt: Date;

  constructor(partial: Partial<BookingResponse>) {
    Object.assign(this, partial);
  }
}
