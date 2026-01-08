const mongoose = require('mongoose');
const Room = require('./models/room.model'); 
const Device = require('./models/device.model');
const User = require('./models/user.model'); 
const DeviceType = require('./models/devicetype.model'); 
const mongoURI = "mongodb://localhost:27017/iot_project_db"; 

mongoose.connect(mongoURI).then(async () => {
    console.log("Đã kết nối DB!");

    const admin = await User.findOne({ email: 'admin@gmail.com' });
    if (!admin) {
        console.log("Lỗi: Không tìm thấy tài khoản admin@gmail.com.");
        process.exit();
    }

    const room = new Room({
        name: "Phòng ăn " + 2,
        description: "Phòng ăn tầng 2",
        userId: admin._id 
    });
    const savedRoom = await room.save();
    console.log("Đã tạo phòng:", savedRoom.name);

    let savedType;
    try {
        const type = new DeviceType({
            name: "Cảm biến nhiệt độ",
            description: "Dùng để đo thông số môi trường"
        });
        savedType = await type.save();
        console.log("Đã tạo loại thiết bị:", savedType.name);
    } catch (err) {
        savedType = await DeviceType.findOne();
        console.log("Dùng loại thiết bị cũ:", savedType.name);
    }

    const device = new Device({
        _id: "64d3b1e3f1a2c3b4d5e6f7a9", 
        deviceName: "DHT22 Sensor",      
        deviceType: savedType._id,       
        roomId: savedRoom._id,
        status: "ON"                     
    });
    
    try {
        await device.save();
        console.log("📡 Đã tạo thiết bị:", device.deviceName);
    } catch (e) {
        if (e.code === 11000) {
            console.log("Thiết bị ID này đã có rồi, không cần tạo lại.");
        } else {
            console.log("Lỗi tạo thiết bị:", e.message);
        }
    }
    
    console.log("Xong! Giờ F5 trang web là thấy liền!");
    process.exit();
}).catch(err => {
    console.log("Lỗi Chung:", err);
});