// const mqtt = require('mqtt');
// const mongoose = require('mongoose'); 

// const DeviceData = require('./models/devicedata.model'); 
// const Device = require('./models/device.model'); 

// const host = process.env.HOST || 'localhost';
// const port = process.env.MQTTPORT || 1883;

// const client = mqtt.connect({
//     host: host,
//     port: port,
//     protocol: 'mqtt',
// });

// client.on('connect', () => {
//     console.log('MQTT Subscriber Connected');
//     client.subscribe('iot/data');
// });

// // 64d3b1e3f1a2c3b4d5e6f7a8: phong khach 1
// // 64d3b1e3f1a2c3b4d5e6f7a9: phong an

// client.on('message', async (topic, message) => {
//     const msgString = message.toString();
//     console.log(`Nhận tin: ${msgString}`);

//     try {
//         const data = JSON.parse(msgString);
//         let device = await Device.findOne({ deviceName: "DHT22 Sensor" });
//         let deviceId = device ? device._id : new mongoose.Types.ObjectId("64d3b1e3f1a2c3b4d5e6f7a8");

//         const newRecord = {
//             name: "DHT22_Sensor",
//             value: data, 
//             deviceId: deviceId,
//         };
//         await DeviceData.create(newRecord);
//         console.log('Đã lưu DeviceData:', newRecord);

//         if (device) {
//             await Device.findByIdAndUpdate(device._id, {
//                 value: data
//             });
//             console.log('Đã cập nhật Device value:', data);
//         }

//     } catch (error) {
//         console.error('Lỗi lưu DB:', error.message);
//     }
// });

// module.exports = client;

const mqtt = require('mqtt');
const mongoose = require('mongoose');
const DeviceData = require('./models/devicedata.model');
const Device = require('./models/device.model');
const host = process.env.HOST || '127.0.0.1';
const port = process.env.MQTTPORT || 1883;

const client = mqtt.connect({
    host: host,
    port: port,
    protocol: 'mqtt',
});

const ROOM_IDS = [
    "64d3b1e3f1a2c3b4d5e6f7a8", 
    "64d3b1e3f1a2c3b4d5e6f7a9"  
];

client.on('connect', () => {
    console.log('MQTT Subscriber Connected (Windows)');
    client.subscribe('iot/data');
});

client.on('message', async (topic, message) => {
    const msgString = message.toString();
    console.log(`Nhận tin: ${msgString}`);

    try {
        const data = JSON.parse(msgString);
        const randomIndex = Math.floor(Math.random() * ROOM_IDS.length);
        const selectedId = new mongoose.Types.ObjectId(ROOM_IDS[randomIndex]);
        
        const roomName = randomIndex === 0 ? "Phòng khách 1" : "Phòng ăn";
        console.log(`Gán dữ liệu cho: ${roomName} (${selectedId})`);

        const newRecord = {
            name: "DHT22_Sensor",
            value: data,
            deviceId: selectedId,
        };
        await DeviceData.create(newRecord);
        console.log('Đã lưu DeviceData thành công');

        await Device.findByIdAndUpdate(selectedId, {
            value: data,
            lastUpdated: new Date()
        }, { upsert: true }); 
        
        console.log(`Đã cập nhật trạng thái mới nhất cho ${roomName}`);

    } catch (error) {
        console.error('Lỗi xử lý dữ liệu:', error.message);
    }
});

module.exports = client;