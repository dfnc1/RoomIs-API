import { ReflectableDecorator, Reflector } from '@nestjs/core';

export enum ROLE {
  ADMIN = 'ADMIN',
  MAHASISWA = 'MAHASISWA',
}

export const Roles: ReflectableDecorator<ROLE[]> =
  Reflector.createDecorator<ROLE[]>();
