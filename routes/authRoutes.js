const express = require('express');
const Joi = require('joi');
const authController = require('../controllers/authController');
const authorizer = require('../middlewares/authorizer');
const validateRequest = require('../middlewares/validate-request');

const router = express.Router();

module.exports = router;

router.post('/login/idnumber', loginIdNumberSchema, authController.loginByIdNumber);
router.post('/login/email', loginEmailSchema, authController.loginByEmail);
router.post('/login/admin', loginEmailSchema, authController.loginByEmailAdmin);

router.post('/create/user', authorizer(['researcher', 'admin']), createUserSchema, authController.createUser);
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password', authController.resetPassword);

function createUserSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string(),
    idnumber: Joi.string(),
    password: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    birthdate: Joi.date().required(),
    address: Joi.string().required(),
    province: Joi.number().required(),
    district: Joi.number().required(),
    subdistrict: Joi.number().required(),
    zipcode: Joi.number().required(),
    role: Joi.string(),
  }).or('email', 'idnumber');
  validateRequest(req, next, schema);
}

function loginIdNumberSchema(req, res, next) {
  const schema = Joi.object({
    idnumber: Joi.string().required(),
    password: Joi.string().required()
  });
  validateRequest(req, next, schema);
}

function loginEmailSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  });
  validateRequest(req, next, schema);
}