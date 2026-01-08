
const mongoose = require('mongoose');
const User = require('./models/user.model'); 

const mongoURI = "mongodb://localhost:27017/iot_project_db"; 

mongoose.connect(mongoURI)
  .then(async () => {
    console.log("Đã kết nối DB!");

    const admin = new User({
      name: "admin",
      email: "admin@gmail.com",
      password: "123456" 
    });

    await admin.save();
    console.log("Đã tạo tài khoản thành công!");
    console.log("Email: admin@gmail.com | Pass: 123456");
    process.exit();
  })
  .catch((err) => {
    console.log("Lỗi rồi: ", err);
  });