const express = require("express");
const travelController = require("../controllers/travel.controller");

const router = express.Router();

//ในการกำหนดเส้นทางเป็นตามหลักการของ REST API
//เพิ่ม post(), แก้ไข put()/patch(), ลบ delete(), ค้นหา/ตรวจสอบ/ดึง/ดู get()
router.post("/", travelController.uploadTravel, travelController.createTravel);
router.delete("/:travelId", travelController.deleteTravel);
router.get("/:travellerId", travelController.getAllTravel);
router.put("/:travelId", travelController.uploadTravel, travelController.editTravel);
router.get("/one/:travelId", travelController.getTravel);

module.exports = router;