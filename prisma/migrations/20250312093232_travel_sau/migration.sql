/*
  Warnings:

  - You are about to drop the column `traveLPlace` on the `travel_tb` table. All the data in the column will be lost.
  - Added the required column `travelPlace` to the `travel_tb` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `travel_tb` DROP COLUMN `traveLPlace`,
    ADD COLUMN `travelPlace` VARCHAR(200) NOT NULL;
