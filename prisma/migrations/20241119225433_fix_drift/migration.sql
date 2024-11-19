/*
  Warnings:

  - You are about to drop the column `comapanyRepId` on the `Position` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `School` table. All the data in the column will be lost.
  - You are about to drop the `CompanyRep` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[adminId]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hostId` to the `Position` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminId` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `CompanyRep` DROP FOREIGN KEY `CompanyRep_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `CompanyRep` DROP FOREIGN KEY `CompanyRep_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Position` DROP FOREIGN KEY `Position_comapanyRepId_fkey`;

-- DropForeignKey
ALTER TABLE `School` DROP FOREIGN KEY `School_userId_fkey`;

-- DropIndex
DROP INDEX `School_userId_key` ON `School`;

-- AlterTable
ALTER TABLE `Company` ADD COLUMN `schoolId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Position` DROP COLUMN `comapanyRepId`,
    ADD COLUMN `hostId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `School` DROP COLUMN `userId`,
    ADD COLUMN `adminId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `CompanyRep`;

-- CreateTable
CREATE TABLE `Host` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Host_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `School_adminId_key` ON `School`(`adminId`);

-- AddForeignKey
ALTER TABLE `School` ADD CONSTRAINT `School_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Position` ADD CONSTRAINT `Position_hostId_fkey` FOREIGN KEY (`hostId`) REFERENCES `Host`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `School`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Host` ADD CONSTRAINT `Host_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Host` ADD CONSTRAINT `Host_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
