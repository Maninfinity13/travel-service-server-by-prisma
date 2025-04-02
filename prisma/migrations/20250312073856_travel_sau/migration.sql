/*
  Warnings:

  - Added the required column `travellerImagexxx` to the `traveller_tb` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `traveller_tb` ADD COLUMN `travellerImagexxx` VARCHAR(150) NOT NULL;
