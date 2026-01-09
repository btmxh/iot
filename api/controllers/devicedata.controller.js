const DeviceData = require('../models/devicedata.model');
const Device = require('../models/device.model');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');

const getDeviceData = async (req, res) => {
  try {
    const deviceId = req.body.deviceId;

    const resultx = await DeviceData.find({
      deviceId: deviceId
    }).sort({ timestamp: -1 }).limit(10);
    const result = [];
    for (let i = resultx.length - 1; i >= 0; i--) {
      result.push(resultx[i]);
    }
    const returnedResult = [];
    if (result.length > 0) {
      for (data of result) {
        const date = data["timestamp"];
        const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        data = data.toObject();
        data.time = dateString;
        returnedResult.push(data);
      }
    }
    return res.status(StatusCodes.OK).json({ result: returnedResult });
  } catch (err) {
    return res.status(400).json({ "err": err.toString() });
  }
}

const getAllDeviceData = async (req, res) => {
  try {
    const data = await DeviceData.find()
      .sort({ timestamp: -1 })
      .limit(100)
      .populate('deviceId');

    return res.status(StatusCodes.OK).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.toString() });
  }
};

const addData = async (req, res) => {
  try {
    const name = req.body.name;
    if (!name) {
      throw new BadRequestError("Name of data is missing");
    }

    let value = req.body.value;
    if (value == undefined) {
      throw new BadRequestError("Value of data is missing");
    }

    const result = await DeviceData.create(req.body);

    if (name == "status" && (value == "ON" || value == "OFF")) {
      await Device.findByIdAndUpdate(req.body.deviceId, {
        status: value
      });
    }

    return res.status(StatusCodes.CREATED).json({ result });
  } catch (err) {
    return res.status(400).json({ "err": err.toString() });
  }
}

const toggleDeviceStatus = (mqtt) => {
  return async (req, res) => {
  try {
    const id = req.params.deviceId;
    if (!id) {
      throw new BadRequestError("ID of device is missing");
    }

    let value = req.body.status;
    if (value == undefined) {
      throw new BadRequestError("Device status is missing");
    }

    mqtt.publish(`iot/led`, value);
    await Device.findByIdAndUpdate(id, {
      status: value
    });
    return res.status(StatusCodes.OK).json({ value });
  } catch (err) {
    return res.status(400).json({ "err": err.toString() });
  }
}};

module.exports = {
  getDeviceData,
  addData,
  getAllDeviceData,
  toggleDeviceStatus
}
