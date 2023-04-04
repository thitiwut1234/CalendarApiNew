const express = require('express');
const reportController = require('../controllers/reportController');
const authorizer = require('../middlewares/authorizer');
const Joi = require('joi');
const validateRequest = require('../middlewares/validate-request');

const router = express.Router();

module.exports = router;

router.get('/', authorizer(), reportController.getReport);
router.get('/:id', authorizer(), reportController.getReportTarget);