const db = require('../utils/db');

async function getEventType(id, page, limit) {
  if (id == 'all') {
    const eventObj = await db.EventType.find({ deletedBy: { $exists: false } }).sort({ date: -1 }).limit(parseInt(limit)).skip(limit * page);
    return eventObj;
  }
  else {
    const eventObj = await db.EventType.findOne({ _id: id, deletedBy: { $exists: false } });
    return eventObj;
  }
}

async function createEventType(params, creatorid) {
  const { name, startdate, enddate, colorEvent, color, padding } = params;
  var newEventType = new db.EventType({ name, startdate, enddate, colorEvent, color, padding });
  newEventType.createdBy = creatorid;
  await newEventType.save();
  return newEventType;
}

async function updateEventType(params, id, editorid) {
  var eventTypeObj = await db.EventType.findById(id);
  if (!eventTypeObj) return { status: 1, message: 'เกิดข้อผิดพลาด ไม่พบข้อมูล' };

  eventTypeObj.name = params.name || eventTypeObj.name;
  eventTypeObj.startdate = params.startdate || eventTypeObj.startdate;
  eventTypeObj.enddate = params.enddate || eventTypeObj.enddate;
  eventTypeObj.colorEvent = params.colorEvent || eventTypeObj.colorEvent;
  eventTypeObj.color = params.color || eventTypeObj.color;
  eventTypeObj.padding = params.padding || eventTypeObj.padding;
  eventTypeObj.updatedBy = editorid;

  await eventTypeObj.save();
  return { eventTypeObj, message: 'แก้ไขข้อมูลสำเร็จ' };
}

async function deleteEventType(id, deleterid) {
  var eventType = await db.EventType.findById(id);
  eventType.deletedBy = deleterid;
  await eventType.save();
  return { message: 'ลบข้อมูลสำเร็จ' };
}

async function getEvent(id, page, limit, type, district, name, eventTypeId) {
  if (id == 'all') {
    if (type && district) {
      const eventObj = await db.Event.find({ type, district, deletedBy: { $exists: false } }).populate('type target researcher').sort({ date: -1 }).limit(parseInt(limit)).skip(limit * page);
      return eventObj;
    }
    if (type) {
      const eventObj = await db.Event.find({ type, deletedBy: { $exists: false } }).populate('type target researcher').sort({ date: -1 }).limit(parseInt(limit)).skip(limit * page);
      return eventObj;
    }
    if (district) {
      const eventObj = await db.Event.find({ district, deletedBy: { $exists: false } }).populate('type target researcher').sort({ date: -1 }).limit(parseInt(limit)).skip(limit * page);
      return eventObj;
    }
    let eventObj = await db.Event.find({ deletedBy: { $exists: false } }).populate('type target researcher').sort({ date: -1 }).limit(parseInt(limit)).skip(limit * page);
    if (name) {
      eventObj = eventObj.filter(event => event.name.includes(name))
    }
    if (eventTypeId) {
      eventObj = eventObj.filter(event => event.type._id == eventTypeId)
    }
    return eventObj;
  }
  else {
    const eventObj = await db.Event.findOne({ _id: id, deletedBy: { $exists: false } }).populate('type researcher').populate({ path: 'target', populate: { path: 'user' } });
    return eventObj;
  }
}

async function getEventCalendarCheck(type, province, district) {
  console.log("Check", type, province, district)
  let eventObj = await db.Event.find({ deletedBy: { $exists: false } }).populate('type target researcher')
  if (province) {
    eventObj = eventObj.filter(obj => obj.province == province)
  }
  if (district) {
    eventObj = eventObj.filter(obj => obj.district == district)
  }
  if (type) {
    eventObj = eventObj.filter(obj => obj.type._id == type)
  }
  return eventObj
}


// async function getEventAnnony() {
//   const eventObj = await db.Event.find().populate('type').sort({ date: -1 });
//   const mappedObj = eventObj.map(x => { return {'name': x.name, 'startdate': x.startdate, 'enddate': x.enddate, 'typename': x.type.name, 'colorEvent': x.type.colorEvent, 'color': x.type}})
//   return mappedObj;
// }

async function createEvent(params, creatorid) {
  const { name, type, quantity, province, district, subdistrict, zipcode, researcher, target, startdate, expectdate, expectquantity } = params;
  var typeObj = await db.EventType.findOne({ name: type });
  if (!typeObj) {
    typeObj = new db.EventType({ name: type });
    typeObj.createdBy = creatorid;
    await typeObj.save();
  }

  var newEvent = new db.Event({ name, type: typeObj._id, quantity, province, district, subdistrict, zipcode, startdate, expectdate, expectquantity });

  var researcherArrId = [];

  for (let key in researcher) {
    const { firstname, lastname } = researcher[key];
    var userObj = await db.EventResearcher.findOne({ firstname, lastname, event: newEvent._id });
    if (!userObj) {
      const researcherObj = new db.EventResearcher({ firstname, lastname, event: newEvent._id, createdBy: creatorid });
      await researcherObj.save();
      researcherArrId.push(researcherObj._id);
    }
    else
      researcherArrId.push(userObj._id);
  }

  const targetArrId = target.map(x => {
    const { user } = x;
    var eventTarget = new db.EventTarget({ user, event: newEvent._id });
    eventTarget.createdBy = creatorid;
    eventTarget.save();
    return eventTarget._id;
  });

  newEvent.researcher = researcherArrId;
  newEvent.target = targetArrId;
  newEvent.createdBy = creatorid;
  await newEvent.save();
  return newEvent;
}

async function editEvent(id, params, editorid, editorrole) {
  var eventObj = await db.Event.findById(id).populate('target researcher');
  if (!eventObj) return { status: 1, message: 'เกิดข้อผิดพลาด ไม่พบข้อมูล' };
  if (editorrole == 'researcher') {
    if (eventObj.createdBy != editorid) return { status: 2, message: 'ไม่มีสิทธิ์แก้ไขข้อมูล' };
  }

  eventObj.name = params.name || eventObj.name;

  var typeObj = await db.EventType.findOne({ name: params.type });
  if (!typeObj) {
    typeObj = new db.EventType({ name: params.type });
    typeObj.createBy = editorid;
    await typeObj.save();
  }

  eventObj.type = typeObj._id || eventObj.type;
  eventObj.quantity = params.quantity || eventObj.quantity,
    eventObj.province = params.province || eventObj.province,
    eventObj.district = params.district || eventObj.district,
    eventObj.subdistrict = params.subdistrict || eventObj.subdistrict,
    eventObj.zipcode = params.zipcode || eventObj.zipcode
  eventObj.startdate = params.startdate || eventObj.startdate;
  eventObj.expectdate = params.expectdate || eventObj.expectdate;
  eventObj.expectquantity = params.expectquantity || eventObj.expectquantity;

  const unmatchedResearcher = eventObj.researcher.filter(item => !params.researcher.some(_item => _item.firstname == item.firstname && _item.lastname == item.lastname));

  if (unmatchedResearcher.length > 0) {
    for (let key in unmatchedResearcher) {
      await db.EventResearcher.deleteOne({ firstname: unmatchedResearcher[key].firstname, lastname: unmatchedResearcher[key].lastname, event: eventObj._id });
    }
  }

  var newResearchId = [];
  for (let key in params.researcher) {
    var researchObj = await db.EventResearcher.findOne({ firstname: params.researcher[key].firstname, lastname: params.researcher[key].lastname, event: eventObj._id });
    if (!researchObj) {
      const newResearch = new db.EventResearcher({ firstname: params.researcher[key].firstname, lastname: params.researcher[key].lastname, event: eventObj._id, createdBy: editorid });
      await newResearch.save();
      newResearchId.push(newResearch._id);
    }
    else {
      newResearchId.push(researchObj._id);
    }
  }

  const unmatchedTarget = eventObj.target.filter(item => !params.target.some(_item => _item.user == item.user));

  if (unmatchedTarget.length > 0) {
    for (let key in unmatchedTarget) {
      await db.EventTarget.deleteOne({ user: unmatchedTarget[key].user, event: eventObj._id });
    }
  }

  var newTargetId = [];
  for (let key in params.target) {
    const targetObj = await db.EventTarget.findOne({ user: params.target[key].user, event: eventObj._id });
    if (!targetObj) {
      const newTarget = new db.EventTarget({ user: params.target[key].user, startdate: params.target[key].startdate, expectdate: params.target[key].expectdate, expectquantity: params.target[key].expectquantity, event: eventObj._id, createdBy: editorid });
      await newTarget.save();
      newTargetId.push(newTarget._id);
    }
    else newTargetId.push(targetObj._id);
  }

  eventObj.researcher = newResearchId;
  eventObj.target = newTargetId;

  eventObj.updatedBy = editorid;
  await eventObj.save();
  return { eventObj, message: 'แก้ไขข้อมูลสำเร็จ' };
}

async function deleteEvent(id, deleterid) {
  await db.Event.findOneAndUpdate({ _id: id }, { deletedBy: deleterid });
  await db.EventResearcher.updateMany({ event: id }, { deletedBy: deleterid });
  await db.EventTarget.updateMany({ event: id }, { deletedBy: deleterid });
  return { message: 'ลบข้อมูลสำเร็จ' };
}

async function getEventTarget(id, page, limit) {
  if (id == 'all') {
    const eventObj = await db.EventTarget.find({ deletedBy: { $exists: false } }).populate('user').sort({ date: -1 }).limit(parseInt(limit)).skip(limit * page);
    return eventObj;
  }
  else {
    const eventObj = await db.EventTarget.findOne({ _id: id, deletedBy: { $exists: false } }).populate('user event').populate({ path: 'event', populate: { path: 'type' } });;
    return eventObj;
  }
}

async function getTargetIdById(userId, eventId) {
  const eventObj = await db.EventTarget.findOne({ event: eventId, user: userId, deletedBy: { $exists: false } });
  return eventObj;
}

async function getTargetById(id, page, limit) {
  const eventObj = await db.EventTarget.find({ event: id, deletedBy: { $exists: false } }).populate('user event');
  return eventObj;
}

// async function getEventSearch(id, name, type) {
//   let eventObj = await db.Event.find({ name: { $regex: '.*' + name + '.*' }, deletedBy: { $exists: false } })
// if (type) {
//   eventObj = eventObj.filter(obj => obj.type._id == type)
// }
//   return eventObj
// }

async function getEventByUserId(id, page, limit, name, type) {
  let eventObj = await db.EventTarget.find({ user: id, deletedBy: { $exists: false } }).populate('user event').populate({ path: 'event', populate: { path: 'type' } })
  eventObj = eventObj.filter(event => !event.event.deletedBy)
  if (name) {
    eventObj = eventObj.filter(event => event.event.name.includes(name))
  }
  if (type) {
    eventObj = eventObj.filter(event => event.event.type._id == type)
  }
  return eventObj;
}

async function getEventByResearcher(firstname, lastname, page, limit, name, type) {
  let eventObj = await db.EventResearcher.find({ firstname: firstname, lastname: lastname, deletedBy: { $exists: false } }).populate('event').populate({ path: 'event', populate: { path: 'type' } }).find({});
  eventObj.filter(event => !event.event.deletedBy)
  if (name) {
    eventObj = eventObj.filter(event => event.event.name.includes(name))
  }
  if (type) {
    eventObj = eventObj.filter(event => event.event.type._id == type)
  }
  return eventObj;
}

async function updateEventTarget(params, id, editorid) {
  var eventTarget = await db.EventTarget.findById(id);
  if (!eventTarget) return { status: 1, message: 'เกิดข้อผิดพลาด ไม่พบข้อมูล' };

  eventTarget.expectdate = params.expectdate || eventTarget.expectdate;
  eventTarget.expectamount = params.expectamount || eventTarget.expectamount;
  eventTarget.expectincome = params.expectincome || eventTarget.expectincome;
  eventTarget.actualdate = params.actualdate || eventTarget.actualdate;
  eventTarget.actualamount = params.actualamount || eventTarget.actualamount;
  eventTarget.actualincome = params.actualincome || eventTarget.actualincome;
  eventTarget.updatedBy = editorid;

  await eventTarget.save();
  return { eventTarget, message: 'แก้ไขข้อมูลสำเร็จ' };
}

async function deleteEventTarget(id, deleterid) {
  var event = await db.EventTarget.findById(id);
  event.deletedBy = deleterid;
  await event.save();
  return { message: 'ลบข้อมูลสำเร็จ' };
}

async function getEventActivity(id, page, limit) {
  if (id == 'all') {
    const eventObj = await db.EventActivity.find({ deletedBy: { $exists: false } }).populate('eventtarget image').sort({ date: -1 }).limit(parseInt(limit)).skip(limit * page);
    return eventObj;
  }
  else {
    const eventObj = await db.EventActivity.findOne({ _id: id, deletedBy: { $exists: false } }).populate('eventtarget image');
    return eventObj;
  }
}

async function getEventActivityByEventTargetId(id, page, limit) {
  const eventObj = await db.EventActivity.find({ eventtarget: id, deletedBy: { $exists: false } }).populate('eventtarget image').sort({ date: -1 }).limit(parseInt(limit)).skip(limit * page);
  return eventObj;
}

async function createEventActivity(params, creatorid) {
  const { eventtarget, image, event, detail, budget, startdate, enddate, note } = params;
  var activity = new db.EventActivity({ eventtarget, image, event, detail, budget, startdate, enddate, note });
  activity.createdBy = creatorid;
  await activity.save();
  return activity;
}

async function updateEventActivity(params, editorid) {
  var activityObj = await db.EventActivity.findById(editorid);
  if (!activityObj) return { status: 1, message: 'เกิดข้อผิดพลาด ไม่พบข้อมูล' };

  activityObj.image = params.image || activityObj.image;
  activityObj.detail = params.detail || activityObj.detail;
  activityObj.budget = params.budget || activityObj.budget;
  activityObj.startdate = params.startdate || activityObj.startdate;
  activityObj.enddate = params.enddate || activityObj.enddate;
  activityObj.note = params.note || activityObj.note;
  activityObj.updatedBy = editorid;
  await activityObj.save();
  return { activityObj, message: 'แก้ไขข้อมูลสำเร็จ' };
}

async function deleteEventActivity(id, deleterid) {
  var event = await db.EventActivity.findById(id);
  event.deletedBy = deleterid;
  await event.save();
  return { message: 'ลบข้อมูลสำเร็จ' };
}

module.exports = {
  getEventType,
  createEventType,
  updateEventType,
  deleteEventType,
  getEvent,
  getEventCalendarCheck,
  // getEventSearch,
  //getEventAnnony,
  createEvent,
  editEvent,
  deleteEvent,
  getEventTarget,
  getTargetIdById,
  getTargetById,
  getEventByUserId,
  getEventByResearcher,
  updateEventTarget,
  deleteEventTarget,
  getEventActivity,
  getEventActivityByEventTargetId,
  createEventActivity,
  updateEventActivity,
  deleteEventActivity
}