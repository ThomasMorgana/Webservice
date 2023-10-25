/*
  Warnings:

  - You are about to drop the column `size` on the `Garage` table. All the data in the column will be lost.
  - Added the required column `spaces` to the `Garage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Garage` DROP COLUMN `size`,
    ADD COLUMN `spaces` INTEGER NOT NULL;
