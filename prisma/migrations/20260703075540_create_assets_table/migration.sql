-- CreateEnum
CREATE TYPE "AssetCategory" AS ENUM ('ROOM', 'ITEM');

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "category" "AssetCategory" NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);
