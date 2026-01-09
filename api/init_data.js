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

  let dhtType;
  try {
    const type = new DeviceType({
      name: "Cảm biến nhiệt độ",
      description: "Dùng để đo thông số môi trường"
    });
    dhtType = await type.save();
    console.log("Đã tạo loại thiết bị:", dhtType.name);
  } catch (err) {
    dhtType = await DeviceType.findOne();
    console.log("Dùng loại thiết bị cũ:", dhtType.name);
  }

  try {
    const type = new DeviceType({
      name: "LED",
      description: "Đèn LED điều khiển từ xa"
    });
    ledType = await type.save();
  } catch (err) {
    ledType = await DeviceType.findOne({ name: "LED" });
    console.log("Loại thiết bị LED đã tồn tại, không tạo lại.");
  }

  const device = new Device({
    _id: "64d3b1e3f1a2c3b4d5e6f7a9",
    deviceName: "DHT22 Sensor",
    deviceType: dhtType._id,
    roomId: savedRoom._id,
    status: "ON"
  });

  const device2 = new Device({
    _id: "64d3b1e3f1a2c3b4d5e6f7b0",
    deviceName: "LED Light",
    deviceType: ledType._id,
    roomId: savedRoom._id,
    status: "OFF"
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

  try {
    await device2.save();
    console.log("📡 Đã tạo thiết bị:", device2.deviceName);
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
