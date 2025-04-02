//นำเข้าเพื่อเรียกใช้งาน module ต่างๆ ที่ต้องใช้งาน
const multer = require("multer"); //จัดการการอัปโหลดไฟล์
const path = require("path"); //จัดการ path หรือตำแหน่งที่อยู่ของไฟล์
const fs = require("fs"); //จัดการไฟล์

//ใช้ Prisma ในการทำงานกับฐานข้อมูล CRUD
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

//ฟังก์ชันเพื่อการอัปโหลดไฟล์--------------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/travel");
    },
    filename: (req, file, cb) => {
        cb(null, 'travel_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
    }
})

exports.uploadTravel = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        if (mimeType && extname) {
            return cb(null, true);
        }
        cb("Error: Images Only");
    }
}).single("travelImage");
//----------------------------------------------

//ดึงข้อมูลการเดินทางทั้งหมด ของ Traveller หน่ึ่ง------
exports.getAllTravel = async (req, res) => {
    try {
        //---
        const result = await prisma.travel_tb.findMany({
            where: {
                travellerId: parseInt(req.params.travellerId)
            }
        })
        //---
        if (result) {
            res.status(200).json({
                message: "Travel get successfully",
                data: result
            });
        } else {
            res.status(404).json({
                message: "Travel get not successfully",
                data: null
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//-------------------------------------------------

//ลบข้อมูลการเดินทางหนึ่งๆ -----------------------------
exports.deleteTravel = async (req, res) => {
    try {
        //---
        const result = await prisma.travel_tb.delete({
            where: {
                travelId: parseInt(req.params.travelId)
            }
        })
        //---
        res.status(200).json({
            message: "Travel delete successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// ---------------------------------------------------


// เพื่อข้อมูลการเดินทางหนึ่งๆ (แต่อย่าลืมเพื่ิม travellerId ด้วย)
exports.createTravel = async (req, res) => {
    try {
        //---
        const result = await prisma.travel_tb.create({
            data: {
                travellerId: parseInt(req.body.travellerId),
                travelPlace: req.body.travelPlace,
                travelStartDate: req.body.travelStartDate,
                travelEndDate: req.body.travelEndDate,
                travelCostTotal: parseFloat(req.body.travelCostTotal),
                travelImage: req.file ? req.file.path.replace("images\\travel\\", "") : "",
            }
        })
        //---
        res.status(201).json({
            message: "Travel created successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// แก้ไขข้อมูลการเดินทางหนึ่งๆ (เงื่อนไขคือ travelId)
exports.editTravel = async (req, res) => {
    try {
        let result = {}

        //---
        //ตรววจสอบก่อนว่ามีการอัปโหลดรูปที่จะแก้ไขไหม
        if(req.file){
            //ค้นดูว่า Travel นั้นมีรูปไหม ถ้ามีรูปลบรูป ไม่มีก็ไม่ลบรูป
            //ไปค้นเพื่อเอาชื่อรูป
            const travel = await prisma.travel_tb.findFirst({
                where:{
                    travelId: parseInt(req.params.travelId)
                }
            })
            //คนแล้วตรวจสอบว่ามีไหมถ้ามีก็ลบไม่มีก็ไม่ลบ
            if(travel.travelImage){
                fs.unlink(path.join("images/travel", travel.travelImage))
            }

            //แก้ไขข้อมูล
            result = await prisma.travel_tb.update({
                where:{
                    travelId: parseInt(req.params.travelId)
                },
                data:{
                    travellerId: parseInt(req.body.travellerId),
                    travelPlace: req.body.travelPlace,
                    travelStartDate: req.body.travelStartDate,
                    travelEndDate: req.body.travelEndDate,
                    travelCostTotal: parseFloat(req.body.travelCostTotal),
                    travelImage: req.file.path.replace("images\\travel\\", ""),
                }
            })
        }else{
            //แก้ไขข้อมูล
            result = await prisma.travel_tb.update({
                where:{
                    travelId: parseInt(req.params.travelId)
                },
                data:{
                    travellerId: parseInt(req.body.travellerId),
                    travelPlace: req.body.travelPlace,
                    travelStartDate: req.body.travelStartDate,
                    travelEndDate: req.body.travelEndDate,
                    travelCostTotal: parseFloat(req.body.travelCostTotal),
                }
            })
        }
        
        //---
        res.status(200).json({
            message: "Travel updated successfully",
            data: result
        });        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// ดึงข้อมูลการเดินทางหนึ่งๆ   (เงื่อนไขคือ travelId)
exports.getTravel = async (req, res) => {
    try {
      
      const result = await prisma.travel_tb.findFirst({
        where: {
          travelId: parseInt(req.params.travelId),
        },
      });
  
      if (result) {
        res.status(200).json({
          message: "Travel get successfully",
          data: result,
        });
      } else {
        res.status(404).json({
          message: "Travel get failed",
          data: null,
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };