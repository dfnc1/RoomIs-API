import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BookingService', () => {
  let service: BookingService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: PrismaService,
          useValue: {
            booking: {
              findFirst: jest.fn(),
              create: jest.fn(),
            },
            asset: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  describe('create booking', () => {
    const mockUser = { id: 'user-1', role: 'MAHASISWA' };
    const mockRequest = {
      assetId: 'asset-1',
      startTime: new Date('2026-07-01T08:00:00Z'),
      endTime: new Date('2026-07-01T10:00:00Z'),
    };

    it('harus tolak kalau ada bentrok jadwal', async () => {
      // asset ditemukan
      jest
        .spyOn(prisma.asset, 'findUnique')
        .mockResolvedValue({ id: 'asset-1' } as any);

      jest
        .spyOn(prisma.booking, 'findFirst')
        .mockResolvedValue({ id: 'booking-1' } as any);

      await expect(
        service.create(mockUser as any, mockRequest),
      ).rejects.toThrow('Schedule conflicts with an already approved booking');
    });

    it('harus berhasil kalau tidak ada bentrok', async () => {
      jest
        .spyOn(prisma.asset, 'findUnique')
        .mockResolvedValue({ id: 'asset-1' } as any);

      jest.spyOn(prisma.booking, 'findFirst').mockResolvedValue(null);

      jest.spyOn(prisma.booking, 'create').mockResolvedValue({
        id: 'booking-1',
        userId: 'user-1',
        assetId: 'asset-1',
        startTime: mockRequest.startTime,
        endTime: mockRequest.endTime,
        status: 'PENDING',
      } as any);

      const result = await service.create(mockUser as any, mockRequest);
      expect(result.status).toBe('PENDING');
    });
  });
});
