//นำเข้าเพื่อเรียกใช้งาน module ต่างๆ ที่ต้องใช้งาน
const multer = require("multer"); //จัดการการอัปโหลดไฟล์
const path = require("path"); //จัดการ path หรือตำแหน่งที่อยู่ของไฟล์
const fs = require("fs"); //จัดการไฟล์

//ใช้งาน Cloudinary
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//ใช้ Prisma ในการทำงานกับฐานข้อมูล CRUD
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()


// Configuration
cloudinary.config({ 
    cloud_name: 'dh6erziqy', 
    api_key: '369138945583319', 
    api_secret: 'ieSxjSt41rXWC-ChafTyC7EI_c0' // Click 'View API Keys' above to copy your API secret
});


//ฟังก์ชันเพื่อการอัปโหลดไฟล์--------------------------
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "images/traveller");
//     } ,
//     filename: (req, file, cb) => {
//         cb(null, 'traveller_'+ Math.floor(Math.random()* Date.now()) + path.extname(file.originalname));
//     }
//  })
 
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        //ชื่อไฟล์
        const newFile = 'traveller_'+ Math.floor(Math.random()* Date.now());

        return{
            folder: 'images/treaveller',
            allowed_formats: ['jpg', 'png', 'jpeg'],
            public_id: newFile
        }
        
    }

})



 exports.uploadTraveller = multer({
     storage: storage,
     limits: {
         fileSize: 1000000
     },
     fileFilter: (req, file, cb) => {
         const fileTypes = /jpeg|jpg|png/;
         const mimeType = fileTypes.test(file.mimetype);
         const extname = fileTypes.test(path.extname(file.originalname));
         if(mimeType && extname) {
             return cb(null, true);
         }
         cb("Error: Images Only");
     }
 }).single("travellerImage");
//----------------------------------------------

//เพิ่มข้อมมูล Traveller ---------------------------
exports.createTraveller = async (req, res) => {
    try {
        //---
        const result = await prisma.traveller_tb.create({
            data:{
                travellerFullname: req.body.travellerFullname,
                travellerEmail: req.body.travellerEmail,
                travellerPassword: req.body.travellerPassword,
                travellerImage: req.file ? req.file.path.replace("images\\traveller\\", ""): ""
            }
        })
        //---
        res.status(201).json({
            message: "Traveller created successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//----------------------------------------------

//ตรวจสอบการเข้าใช้งานของ Traveller ------------------
exports.checkLoginTraveller = async (req, res) => {
    try {
        //---
        const result = await prisma.traveller_tb.findFirst({
            where:{
                travellerEmail: req.params.travellerEmail,
                travellerPassword: req.params.travellerPassword
            }
        })
        //---
        if (result) {
            res.status(200).json({
            message: "Traveller login successfully",
            data: result,
            });
        } else {
            res.status(404).json({
            message: "Traveller login failed",
            data: null,
            });
        }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}
//----------------------------------------------

//แก้ไขTraveller ------------------
exports.editTraveller = async (req, res) => {
    try {
        let result = {}

        //---
        //ตรววจสอบก่อนว่ามีการอัปโหลดรูปที่จะแก้ไขไห
        if(req.file){
            //ค้นดูว่า Traveller นั้นมีรูปไหม ถ้ามีรูปลบรูป ไม่มีก็ไม่ลบรูป
            //ไปค้นเพื่อเอาชื่อรูป
            const traveller = await prisma.traveller_tb.findFirst({
                where:{
                    travellerId: parseInt(req.params.travellerId)
                }
            })
            //คนแล้วตรวจสอบว่ามีไหมถ้ามีก็ลบไม่มีก็ไม่ลบ
            if(traveller.travellerImage){
                fs.unlink(path.join("images/traveller", traveller.travellerImage))
            }

            //แก้ไขข้อมูล
            result = await prisma.traveller_tb.update({
                where:{
                    travellerId: parseInt(req.params.travellerId)
                },
                data:{
                    travellerFullname: req.body.travellerFullname,
                    travellerEmail: req.body.travellerEmail,
                    travellerPassword: req.body.travellerPassword,
                    travellerImage: req.file.path.replace("images\\traveller\\", "")
                }
            })
        }else{
            //แก้ไขข้อมูล
            result = await prisma.traveller_tb.update({
                where:{
                    travellerId: parseInt(req.params.travellerId)
                },
                data:{
                    travellerFullname: req.body.travellerFullname,
                    travellerEmail: req.body.travellerEmail,
                    travellerPassword: req.body.travellerPassword
                }
            })
        }
        
        //---
        res.status(200).json({
            message: "Traveller updated successfully",
            data: result
        });        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//----------------------------------------------