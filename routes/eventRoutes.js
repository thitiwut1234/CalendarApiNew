const express = require('express');
const authorizer = require('../middlewares/authorizer');
const eventController = require('../controllers/eventController');
const Joi = require('joi-oid');
const validateRequest = require('../middlewares/validate-request');

const router = express.Router();

module.exports = router;

router.get('/type/:id', authorizer(), eventController.getEventType);
router.post('/type/create', authorizer(['admin']), eventTypeSchema, eventController.createEventType);
router.put('/type/update/:id', authorizer(['admin']), eventTypeSchema, eventController.updateEventType);
router.delete('/type/delete/:id', authorizer(['admin']), eventController.deleteEventType);

//router.get('/annony', eventController.getEventAnnony);
router.get('/:id', eventController.getEvent);
router.post('/all/:id', eventSearchSchema, eventController.getEvent);
router.post('/calendar', authorizer(['researcher', 'admin']), eventCalendarSchema, eventController.getEventCalendar);
// router.post('/search', authorizer(), eventSearchSchema, eventController.getEventSearch);
router.post('/create', authorizer(['researcher', 'admin']), eventSchema, eventController.createEvent);
router.put('/edit/:id', authorizer(['researcher', 'admin']), eventController.editEvent);
router.delete('/delete/:id', authorizer(['admin']), eventController.deleteEvent);

router.get('/target/:id', authorizer(), eventController.getEventTarget);
router.get('/target/event/:id', authorizer(), eventController.getTargetByEventId);
router.post('/target/user/:id', authorizer(), eventSearchSchema, eventController.getEventtByTargetId);
router.post('/target/researcher', authorizer(), eventResearcherSchema, eventController.getEventtByResearcher);
router.put('/target/update/:id', authorizer(), eventTargetSchema, eventController.updateEventTarget);
router.delete('/target/delete/:id', authorizer(), eventController.deleteEventTarget);

router.get('/activity/:id', authorizer(), eventController.getEventActivity);
router.get('/activity/target/:id', authorizer(), eventController.getEventActivityByTargetId);
router.post('/activity/findTargetId', authorizer(), eventTargetIdSchema, eventController.getTargetIdByUserIdandEventId);
router.post('/activity/create', authorizer(), eventActivitySchema, eventController.createEventActivity);
router.put('/activity/update/:id', authorizer(), eventActivitySchema, eventController.updateEventActivity);
router.delete('/activity/delete/:id', authorizer(), eventController.deleteEventActivity);

function eventSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    quantity: Joi.string(),
    province: Joi.number(),
    district: Joi.number(),
    subdistrict: Joi.number(),
    zipcode: Joi.number(),
    startdate: Joi.date(),
    expectdate: Joi.number(),
    budget: Joi.number().optional().allow(null),
    expectquantity: Joi.number(),
    researcher: Joi.array().items(Joi.object({
      firstname: Joi.string(),
      lastname: Joi.string()
    })),
    target: Joi.array().items(Joi.object({
      user: Joi.objectId().required()
    }))
  });
  validateRequest(req, next, schema);
}

function eventCalendarSchema(req, res, next) {
  const schema = Joi.object({
    eventTypeId: Joi.objectId().optional().allow(0),
    province: Joi.number(),
    district: Joi.number(),
  });
  validateRequest(req, next, schema);
}

function eventSearchSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().optional().allow(''),
    eventTypeId: Joi.objectId().optional().allow(0),
  });
  validateRequest(req, next, schema);
}

function eventTargetSchema(req, res, next) {
  const schema = Joi.object({
    lat: Joi.string(),
    long: Joi.string(),
    expectdate: Joi.number(),
    expectamount: Joi.number(),
    expectincome: Joi.number(),
    actualdate: Joi.number(),
    actualamount: Joi.number(),
    actualincome: Joi.number(),
    receivedbudget: Joi.number()
  });
  validateRequest(req, next, schema);
}

function eventTargetIdSchema(req, res, next) {
  const schema = Joi.object({
    userId: Joi.string(),
    eventId: Joi.string(),
  });
  validateRequest(req, next, schema);
}

function eventResearcherSchema(req, res, next) {
  const schema = Joi.object({
    id: Joi.objectId().optional().allow(0),
    firstname: Joi.string(),
    lastname: Joi.string(),
    name: Joi.string().optional().allow(''),
    eventTypeId: Joi.objectId().optional().allow(0),
  });
  validateRequest(req, next, schema);
}

function eventTypeSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string(),
    startdate: Joi.date(),
    enddate: Joi.date(),
    colorEvent: Joi.string(),
    color: Joi.string(),
    padding: Joi.number()
  });
  validateRequest(req, next, schema);
}

function eventActivitySchema(req, res, next) {
  const schema = Joi.object({
    eventtarget: Joi.objectId().required(),
    name: Joi.string(),
    image: Joi.objectId().optional().allow(null),
    image2: Joi.objectId().optional().allow(null),
    image3: Joi.objectId().optional().allow(null),
    image4: Joi.objectId().optional().allow(null),
    image5: Joi.objectId().optional().allow(null),
    detail: Joi.string(),
    budget: Joi.number(),
    startdate: Joi.date(),
    enddate: Joi.date(),
    note: Joi.string().optional().allow(''),
  });
  validateRequest(req, next, schema);
}