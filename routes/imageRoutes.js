const express = require('express');
const imageController = require('../controllers/imageController');
const authorizer = require('../middlewares/authorizer');
const Joi = require('joi');
const validateRequest = require('../middlewares/validate-request');

const router = express.Router();

module.exports = router;

router.post('/upload', authorizer(), imageSchema, imageController.upload);
router.get('/:id', imageController.getImage);

function imageSchema(req, res, next) {
  const schema = Joi.object({ 
    type: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}