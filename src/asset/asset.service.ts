import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssetResponse, CreateAssetDto, UpdateAssetDto } from './dto/asset.dto';
import { Asset } from '../../generated/prisma/client';

@Injectable()
export class AssetService {
  constructor(private prismaService: PrismaService) {}

  async create(request: CreateAssetDto): Promise<AssetResponse> {
    return new AssetResponse(
      await this.prismaService.asset.create({
        data: request,
      }),
    );
  }

  async get(id?: string): Promise<AssetResponse | AssetResponse[]> {
    if (!id) {
      const asset: Asset[] = await this.prismaService.asset.findMany();
      return asset.map((item: Asset) => new AssetResponse(item));
    }

    const asset: Asset | null = await this.prismaService.asset.findUnique({
      where: { id: id },
    });
    if (!asset) throw new HttpException('Asset not found', 404);

    return new AssetResponse(asset);
  }

  async update(id: string, request: UpdateAssetDto): Promise<AssetResponse> {
    const asset: Asset | null = await this.prismaService.asset.findUnique({
      where: { id: id },
    });
    if (!asset) throw new HttpException('Asset not found', 404);

    return new AssetResponse(
      await this.prismaService.asset.update({
        where: { id: id },
        data: request,
      }),
    );
  }

  async delete(id: string): Promise<{ message: string }> {
    const asset: Asset | null = await this.prismaService.asset.findUnique({
      where: { id: id },
    });
    if (!asset) throw new HttpException('Asset not found', 404);
    await this.prismaService.asset.delete({ where: { id: id } });

    return {
      message: 'Asset deleted successfully',
    };
  }
}
