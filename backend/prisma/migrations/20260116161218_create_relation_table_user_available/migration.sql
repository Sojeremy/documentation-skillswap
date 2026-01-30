/*
  Warnings:

  - You are about to drop the column `end` on the `available` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `available` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `available` table. All the data in the column will be lost.
  - Added the required column `time_slot` to the `available` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Time" AS ENUM ('Morning', 'Afternoon');

-- DropForeignKey
ALTER TABLE "available" DROP CONSTRAINT "available_user_id_fkey";

-- AlterTable
ALTER TABLE "available" DROP COLUMN "end",
DROP COLUMN "start",
DROP COLUMN "user_id",
ADD COLUMN     "time_slot" "Time" NOT NULL;

-- CreateTable
CREATE TABLE "user_has_available" (
    "user_id" INTEGER NOT NULL,
    "available_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_has_available_pkey" PRIMARY KEY ("user_id","available_id")
);

-- AddForeignKey
ALTER TABLE "user_has_available" ADD CONSTRAINT "user_has_available_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_has_available" ADD CONSTRAINT "user_has_available_available_id_fkey" FOREIGN KEY ("available_id") REFERENCES "available"("id") ON DELETE CASCADE ON UPDATE CASCADE;
