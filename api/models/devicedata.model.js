const mongoose = require('mongoose');

const DeviceDataSchema = mongoose.Schema({
    name: {
        type: String
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    deviceId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Device'
    }
});

module.exports = mongoose.model('DeviceData', DeviceDataSchema);