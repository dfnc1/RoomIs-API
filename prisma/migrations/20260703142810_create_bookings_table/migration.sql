/*
  Warnings:

  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- AlterTable
ALTER TABLE "assets" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "start_time" TIMESTAMP NOT NULL,
    "end_time" TIMESTAMP NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "rejection" TEXT,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
