const express = require("express");
const travellerController = require("../controllers/traveller.controller");

const router = express.Router();

//ในการกำหนดเส้นทางเป็นตามหลักการของ REST API
//เพิ่ม post(), แก้ไข put()/patch(), ลบ delete(), ค้นหา/ตรวจสอบ/ดึง/ดู get()
router.post("/", travellerController.uploadTraveller, travellerController.createTraveller);

router.get("/:travellerEmail/:travellerPassword", travellerController.checkLoginTraveller);

router.put("/:travellerId",  travellerController.uploadTraveller, travellerController.editTraveller)

module.exports = router;


