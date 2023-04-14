const express = require('express');
const utilityController = require('../controllers/utilityController');
const authorizer = require('../middlewares/authorizer');

const router = express.Router();

module.exports = router;

router.get('/province', utilityController.getProvince);
router.get('/district/:id', utilityController.getDistrict);
router.get('/subdistrict/:id', utilityController.getSubDistrict);
router.get('/zipcode/:id', utilityController.getZipCode);

router.get('/rank', utilityController.getRankName);
