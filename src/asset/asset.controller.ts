import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetResponse, CreateAssetDto, UpdateAssetDto } from './dto/asset.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ROLE, Roles } from '../auth/decorators/roles.decorator';

@Controller('/api/assets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles([ROLE.ADMIN])
  async create(@Body() request: CreateAssetDto): Promise<AssetResponse> {
    return await this.assetService.create(request);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<AssetResponse[] | AssetResponse> {
    return await this.assetService.get();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getById(
    @Param('id') id: string,
  ): Promise<AssetResponse | AssetResponse[]> {
    return await this.assetService.get(id);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles([ROLE.ADMIN])
  async update(
    @Param('id') id: string,
    request: UpdateAssetDto,
  ): Promise<AssetResponse> {
    return await this.assetService.update(id, request);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles([ROLE.ADMIN])
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return await this.assetService.delete(id);
  }
}
