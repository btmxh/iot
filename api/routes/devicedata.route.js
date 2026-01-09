const { getDeviceData, addData, getAllDeviceData, toggleDeviceStatus } = require('../controllers/devicedata.controller');

function create(mqtt) {

  const router = require('express').Router();
  router.get("/", getAllDeviceData);
  router.post("/", getDeviceData);
  router.post("/add", addData);
  router.post("/toggle/:deviceId", toggleDeviceStatus(mqtt));

  return router;
}

module.exports = create;
