-- CreateTable
CREATE TABLE `traveller_tb` (
    `travellerId` INTEGER NOT NULL AUTO_INCREMENT,
    `travellerFullname` VARCHAR(100) NOT NULL,
    `travellerEmail` VARCHAR(50) NOT NULL,
    `travellerPassword` VARCHAR(50) NOT NULL,
    `travellerImage` VARCHAR(150) NOT NULL,

    PRIMARY KEY (`travellerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `travel_tb` (
    `travelId` INTEGER NOT NULL AUTO_INCREMENT,
    `travellerId` INTEGER NOT NULL,
    `traveLPlace` VARCHAR(200) NOT NULL,
    `travelStartDate` VARCHAR(30) NOT NULL,
    `travelEndDate` VARCHAR(30) NOT NULL,
    `travelCostTotal` DOUBLE NOT NULL,
    `travelImage` VARCHAR(150) NOT NULL,

    PRIMARY KEY (`travelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
