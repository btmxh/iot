const router = require('express').Router();

const { getDeviceData, addData, getAllDeviceData } = require('../controllers/devicedata.controller');

router.get("/", getAllDeviceData);
router.post("/", getDeviceData);
router.post("/add", addData);

module.exports = router;