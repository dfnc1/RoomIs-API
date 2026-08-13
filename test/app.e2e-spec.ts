import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('RoomIs API (e2e)', () => {
  let app: INestApplication;
  let mahasiswaToken: string;
  let adminToken: string;
  let bookingId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    await app.init();

    const prisma = app.get(PrismaService);

    const user = await prisma.user.findUnique({
      where: { email: 'mahasiswa@test.com' },
    });
    if (user) {
      await prisma.booking.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Register', () => {
    it('POST /api/users/register ', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'mahasiswa@test.com',
          password: '12345678',
          name: 'Test Mahasiswa',
        });

      expect(res.status).toBe(201);
      expect(res.body.access_token).toBeDefined();
      mahasiswaToken = res.body.access_token;
    });

    it('POST /api/users/', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'mahasiswa@test.com',
          password: '12345678',
          name: 'Test Mahasiswa',
        });

      expect(res.status).toBe(409);
    });
  });

  describe('Login', () => {
    it('POST /api/users/login → 200 mahasiswa', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({ email: 'mahasiswa@test.com', password: '12345678' });

      expect(res.status).toBe(200);
      expect(res.body.access_token).toBeDefined();
    });

    it('POST /api/users/login → 200 admin', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({ email: 'admin@roomis.com', password: '12345678' });

      expect(res.status).toBe(200);
      expect(res.body.access_token).toBeDefined();
      adminToken = res.body.access_token;
    });

    it('POST /api/users/login → 401 password salah', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({ email: 'mahasiswa@test.com', password: 'salah' });

      expect(res.status).toBe(400);
    });
  });

  describe('Get Profile', () => {
    it('GET /api/users/me → 200', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users/me')
        .set('Authorization', `Bearer ${mahasiswaToken}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('mahasiswa@test.com');
      expect(res.body.password).toBeUndefined();
    });

    it('GET /api/users/me → 401 tanpa token', async () => {
      const res = await request(app.getHttpServer()).get('/api/users/me');

      expect(res.status).toBe(401);
    });
  });

  // ========================
  // BOOKINGS
  // ========================
  describe('Create Booking', () => {
    it('POST /api/bookings → 201 berhasil', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/bookings')
        .set('Authorization', `Bearer ${mahasiswaToken}`)
        .send({
          assetId: 'asset-test-001',
          startTime: '2026-08-01T08:00:00Z',
          endTime: '2026-08-01T10:00:00Z',
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('PENDING');
      bookingId = res.body.id;
    });

    it('POST /api/bookings → 401 tanpa token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/bookings')
        .send({
          assetId: 'asset-test-001',
          startTime: '2026-08-01T08:00:00Z',
          endTime: '2026-08-01T10:00:00Z',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('Update Booking Status', () => {
    it('PATCH /api/bookings/:id/status → 200 approve', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/bookings/${bookingId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'APPROVED' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('APPROVED');
    });

    it('POST /api/bookings → 400 bentrok setelah approve', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/bookings')
        .set('Authorization', `Bearer ${mahasiswaToken}`)
        .send({
          assetId: 'asset-test-001',
          startTime: '2026-08-01T08:00:00Z', // sama → bentrok
          endTime: '2026-08-01T10:00:00Z',
        });

      expect(res.status).toBe(400);
    });

    it('PATCH /api/bookings/:id/status → 400 reject tanpa reason', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/bookings/${bookingId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'REJECTED' });

      expect(res.status).toBe(400);
    });

    it('PATCH /api/bookings/:id/status → 403 mahasiswa tidak bisa approve', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/bookings/${bookingId}/status`)
        .set('Authorization', `Bearer ${mahasiswaToken}`)
        .send({ status: 'APPROVED' });

      expect(res.status).toBe(403);
    });
  });
});
