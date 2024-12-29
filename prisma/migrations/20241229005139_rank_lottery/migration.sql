/*
  Warnings:

  - Added the required column `rank` to the `PositionsOnStudents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PositionsOnStudents` ADD COLUMN `rank` INTEGER NOT NULL;
