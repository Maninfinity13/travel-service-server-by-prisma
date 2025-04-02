const express = require("express");
const cors = require("cors");
const travellerRoute = require("./routes/traveller.route")
const travelRoute = require("./routes/travel.route")

//เรียกใช้งานไฟล์ .env เพื่อใช้งานค่าที่กำหนดอยู่ในไฟล์ .env
require("dotenv").config();

//สร้าง web server
const app = express();

// จะใช้ค่า default แทน ในนี้คือ 5000
const PORT = process.env.PORT || 5000;

//ใช้ middleware ในการจัดการต่างๆ
app.use(cors()) //จัดการเรื่องการเรียกใช้งานข้ามโดเมน
app.use(express.json()) //จัดรูปแบบข้อมูลในการรับส่งที่เป็น JSON
app.use('/traveller', travellerRoute)
app.use('/travel', travelRoute)
//กำหนดการเข้าถึง path ที่เก็บรูป
app.use('/images/traveller', express.static('images/traveller'))
app.use('/images/travel', express.static('images/travel'))

//เทสการเรียกใช้งาน web server จาก client/user/ระบบอื่นๆ
app.get("/", (req, res) => {
    res.json({ message: "Hello from Back-end server!.." });
});
  

//สร้างช่องทางในการติดต่อ web server นี้จาก client/user
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT + "...");
});
  