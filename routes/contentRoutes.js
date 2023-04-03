const express = require('express');
const authorizer = require('../middlewares/authorizer');
const contentController = require('../controllers/contentController');
const Joi = require('joi-oid');
const validateRequest = require('../middlewares/validate-request');

const router = express.Router();

module.exports = router;

router.get('/:id', contentController.getContent);
router.post('/create', authorizer(['admin']), contentSchema, contentController.createContent);
router.put('/edit/:id', authorizer(['admin']), contentSchema, contentController.editContent);
router.delete('/delete/:id', authorizer(['admin']), contentController.deleteContent);
router.post('/type', contentgetType, contentController.getType);

function contentSchema(req, res, next) {
  const schema = Joi.object({
    type: Joi.string().required(),
    header: Joi.string().optional().allow(''),
    title: Joi.string().optional().allow(''),
    content: Joi.string().optional().allow(''),
    image: Joi.objectId()
  });
  validateRequest(req, next, schema);
}

function contentgetType(req, res, next) {
  const schema = Joi.object({
    type: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}