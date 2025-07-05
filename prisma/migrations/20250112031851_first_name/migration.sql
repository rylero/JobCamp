-- CreateTable
CREATE TABLE `PermissionSlipSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `parentName` VARCHAR(191) NOT NULL,
    `phoenNumber` VARCHAR(191) NOT NULL,
    `studentFirstName` VARCHAR(191) NOT NULL,
    `studentLastName` VARCHAR(191) NOT NULL,
    `physicalRestrictions` VARCHAR(191) NULL,
    `dietaryRestrictions` VARCHAR(191) NULL,
    `liability` VARCHAR(191) NOT NULL,
    `liabilityDate` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PermissionSlipSubmission_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
