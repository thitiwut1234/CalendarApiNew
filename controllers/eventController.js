const eventService = require('../services/eventService');

async function getEventType(req, res) {
  try {
    const response = await eventService.getEventType(req.params.id, req.query.page, req.query.limit);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function createEventType(req, res) {
  try {
    const response = await eventService.createEventType(req.body, req.auth.id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function updateEventType(req, res) {
  try {
    const response = await eventService.updateEventType(req.body, req.params.id, req.auth.id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function deleteEventType(req, res) {
  try {
    const response = await eventService.deleteEventType(req.params.id, req.auth.id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getEvent(req, res) {
  try {
    const response = await eventService.getEvent(req.params.id, req.query.page, req.query.limit, req.query.type, req.query.district , req.body.name , req.body.eventTypeId);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getEventCalendar(req, res) {
  try {
    console.log("Req ," , req)
    const response = await eventService.getEventCalendarCheck(req.body.eventTypeId, req.body.province, req.body.district);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getEventSearch(req, res) {
  try {
    const response = await eventService.getEventSearch(req.body.id, req.body.name, req.body.eventTypeId);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}


// async function getEventAnnony(req, res) {
//   try {
//     const response = await eventService.getEventAnnony();
//     res.json(response);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
//   }
// }

async function createEvent(req, res) {
  try {
    const response = await eventService.createEvent(req.body, req.auth.id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function editEvent(req, res) {
  try {
    const response = await eventService.editEvent(req.params.id, req.body, req.auth.id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function deleteEvent(req, res) {
  try {
    const response = await eventService.deleteEvent(req.params.id, req.auth.id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getEventTarget(req, res) {
  try {
    const response = await eventService.getEventTarget(req.params.id, req.query.page, req.query.limit);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getTargetIdByUserIdandEventId(req, res) {
  try {
    const response = await eventService.getTargetIdById(req.body.userId, req.body.eventId);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getTargetByEventId(req, res) {
  try {
    const response = await eventService.getTargetById(req.params.id, req.query.page, req.query.limit);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getEventtByTargetId(req, res) {
  try {
    const response = await eventService.getEventByUserId(req.params.id, req.query.page, req.query.limit , req.body.name , req.body.eventTypeId);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}


async function getEventtByResearcher(req, res) {
  try {
    const response = await eventService.getEventByResearcher(req.body.firstname, req.body.lastname, req.query.page, req.query.limit , req.body.name , req.body.eventTypeId);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function updateEventTarget(req, res) {
  try {
    const response = await eventService.updateEventTarget(req.body, req.params.id, req.auth.id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function deleteEventTarget(req, res) {
  try {
    const response = await eventService.deleteEventTarget(req.params.id, req.auth.id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getEventActivity(req, res) {
  try {
    const response = await eventService.getEventActivity(req.params.id, req.query.page, req.query.limit);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getEventActivityByTargetId(req, res) {
  try {
    const response = await eventService.getEventActivityByEventTargetId(req.params.id, req.query.page, req.query.limit);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function createEventActivity(req, res) {
  try {
    const response = await eventService.createEventActivity(req.body, req.auth.id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function updateEventActivity(req, res) {
  try {
    const response = await eventService.updateEventActivity(req.body, req.params.id, req.auth.id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function deleteEventActivity(req, res) {
  try {
    const response = await eventService.deleteEventActivity(req.params.id, req.auth.id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

module.exports = {
  getEventType,
  createEventType,
  updateEventType,
  deleteEventType,
  getEvent,
  getEventCalendar,
  getEventSearch,
  //getEventAnnony,
  createEvent,
  editEvent,
  deleteEvent,
  getEventTarget,
  getTargetIdByUserIdandEventId,
  getTargetByEventId,
  getEventtByTargetId,
  getEventtByResearcher,
  updateEventTarget,
  deleteEventTarget,
  getEventActivity,
  getEventActivityByTargetId,
  createEventActivity,
  updateEventActivity,
  deleteEventActivity
}