-- DropForeignKey
ALTER TABLE `Attachment` DROP FOREIGN KEY `Attachment_positionId_fkey`;

-- DropIndex
DROP INDEX `Attachment_positionId_fkey` ON `Attachment`;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `Position`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
