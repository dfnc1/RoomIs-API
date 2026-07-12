import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { AssetCategory } from '../../../generated/prisma/enums';

export class CreateAssetDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsNotEmpty()
  @IsString()
  category: AssetCategory;
}

export class UpdateAssetDto extends PartialType(CreateAssetDto) {}

export class AssetResponse {
  id: string;
  name: string;
  description: string | null;
  category: AssetCategory;

  @Transform(({ value }) => value?.toISOString())
  createdAt: Date;

  @Transform(({ value }) => value?.toISOString())
  updatedAt: Date;

  constructor(partial: Partial<AssetResponse>) {
    Object.assign(this, partial);
  }
}
