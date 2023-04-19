const db = require('../utils/db');

async function getEventType(id, page = 0, limit = 8000) {
  if (id == 'all') {
    // const eventObj = await db.EventType.find({ deletedBy: { $exists: false } }).sort({ created_at: -1 }).limit(parseInt(limit)).skip(limit * page);
    const eventObj = await db.Event.find({ deletedBy: { $exists: false } }).populate('type')
    let obj = []
    for (let i = 0; i < eventObj.length; i++) {
      if (!(obj.find(x => x._id == eventObj[i].type._id))) {
        obj.push(eventObj[i].type)
      }
    }
    return obj;
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

async function getPageEvent(id, page = 0, limit = 8000, type, district, name, eventTypeId) {
  if (id == 'all') {
    if (type && district) {
      const eventObj = await db.Event.find({ type, district, deletedBy: { $exists: false } }).populate('type target researcher')
      return eventObj.length;
    }
    else if (type) {
      const eventObj = await db.Event.find({ type, deletedBy: { $exists: false } }).populate('type target researcher')
      return eventObj.length;
    }
    else if (district) {
      const eventObj = await db.Event.find({ district, deletedBy: { $exists: false } }).populate('type target researcher')
      return eventObj.length;
    }
    let eventObj = await db.Event.find({ deletedBy: { $exists: false } }).populate('type target researcher')
    if (name) {
      eventObj = eventObj.filter(event => event.name.includes(name))
    }
    if (eventTypeId) {
      eventObj = eventObj.filter(event => event.type._id == eventTypeId)
    }
    return eventObj.length;
  }
  else {
    const eventObj = await db.Event.findOne({ _id: id, deletedBy: { $exists: false } }).populate('type researcher').populate({ path: 'target', populate: { path: 'user' } });
    return eventObj.length;
  }
}

async function getEvent(id, page = 0, limit = 8000, type, district, name, eventTypeId) {
  if (id == 'all') {
    if (type && district) {
      const eventObj = await db.Event.find({ type, district, deletedBy: { $exists: false } }).populate('type target researcher').sort({ created_at: -1 }).limit(parseInt(limit)).skip(limit * page);
      return eventObj;
    }
    else if (type) {
      const eventObj = await db.Event.find({ type, deletedBy: { $exists: false } }).populate('type target researcher').sort({ created_at: -1 }).limit(parseInt(limit)).skip(limit * page);
      return eventObj;
    }
    else if (district) {
      const eventObj = await db.Event.find({ district, deletedBy: { $exists: false } }).populate('type target researcher').sort({ created_at: -1 }).limit(parseInt(limit)).skip(limit * page);
      return eventObj;
    }
    if (eventTypeId !== 0) {
      let eventObj = await db.Event.find({ name: { '$regex': name }, type: eventTypeId, deletedBy: { $exists: false } }).populate('type target researcher').sort({ created_at: -1 }).limit(parseInt(limit)).skip(limit * page);
      return eventObj;

    }
    else {
      let eventObj = await db.Event.find({ name: { '$regex': name }, deletedBy: { $exists: false } }).populate('type target researcher').sort({ created_at: -1 }).limit(parseInt(limit)).skip(limit * page);
      return eventObj;

    }

  }
  else {
    const eventObj = await db.Event.findOne({ _id: id, deletedBy: { $exists: false } }).populate('type researcher').populate({ path: 'target', populate: { path: 'user' } });
    return eventObj;
  }
}

async function getEventCalendarCheck(type, province, district) {
  // console.log("Check", type, province, district)
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
//   const eventObj = await db.Event.find().populate('type').sort({ created_at: -1 });
//   const mappedObj = eventObj.map(x => { return {'name': x.name, 'startdate': x.startdate, 'enddate': x.enddate, 'typename': x.type.name, 'colorEvent': x.type.colorEvent, 'color': x.type}})
//   return mappedObj;
// }

async function createEvent(params, creatorid) {
  const { name, type, quantity, province, district, subdistrict, zipcode, researcher, target, otherList, startdate, expectdate, expectquantity, budget } = params;
  var typeObj = await db.EventType.findOne({ name: type });
  if (!typeObj) {
    typeObj = new db.EventType({ name: type });
    typeObj.createdBy = creatorid;
    await typeObj.save();
  }

  var newEvent = new db.Event({ name, type: typeObj._id, quantity, province, district, subdistrict, zipcode, startdate, expectdate, expectquantity, budget });

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

  const otherListArrId = otherList.map(x => {
    var eventOtherList = new db.EventOtherList({ list: x.list, amount: x.amount, unit: x.unit, costPerAmount: x.costPerAmount, totalCost: x.amount * x.costPerAmount, createdBy: creatorid, event: newEvent._id });
    eventOtherList.createdBy = creatorid;
    eventOtherList.save();
    return eventOtherList._id;
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
  eventObj.budget = params.budget || eventObj.budget;
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

async function getEventTarget(id, page = 0, limit = 8000) {
  if (id == 'all') {
    const eventObj = await db.EventTarget.find({ deletedBy: { $exists: false } }).populate('user').sort({ created_at: -1 }).limit(parseInt(limit)).skip(limit * page);
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

async function getTargetById(id, page = 0, limit = 8000) {
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

async function getEventByUserId(id, page = 0, limit = 8000, name, type) {
  if (type != 0) {
    let eventObj = await db.Event.find({ type: type, name: { '$regex': name }, deletedBy: { $exists: false } }).populate({ path: 'target', select: { user: 1 } })
      .sort({ created_at: -1 })
    // .limit(parseInt(limit)).skip(limit * page);
    eventObj = eventObj.filter(x => x.target.find(uid => uid.user == id))
    return eventObj.splice(page * limit, limit);
  }
  else {
    let eventObj = await db.Event.find({ name: { '$regex': name }, deletedBy: { $exists: false } }).populate({ path: 'target', select: { user: 1 } })
      .sort({ created_at: -1 })
    // .limit(parseInt(limit)).skip(limit * page);
    eventObj = eventObj.filter(x => x.target.find(uid => uid.user == id))
    return eventObj.splice(page * limit, limit);
  }
}

async function getEventReseacherNameandLastName(firstname, lastname, page = 0, limit = 8000, id) {
  // if (type != 0) {
  let eventObj = await db.Event.find({ deletedBy: { $exists: false } }).populate({ path: 'researcher', select: { firstname: 1, lastname: 1 } })
    .sort({ created_at: -1 })
  console.log("Evemt", eventObj)
  // .limit(parseInt(limit)).skip(limit * page);
  eventObj = eventObj.filter(x => x.researcher.find(uid => uid.firstname == firstname && uid.lastname == lastname))
  return eventObj.splice(page * limit, limit);
  // }
  // else {
  // let eventObj = await db.Event.find({ deletedBy: { $exists: false } }).populate({ path: 'researcher', select: { firstname: 1, lastname: 1 } })
  //   .sort({ created_at: -1 })
  // // .limit(parseInt(limit)).skip(limit * page);
  // eventObj = eventObj.filter(x => (x.target.find(uid => uid.firstname == firstname && uid.lastname == lastname) || x.createdBy == id))
  // return eventObj.splice(page * limit, limit);
  // }
}

async function getEventByResearcher(firstname, lastname, page = 0, limit, name, type, id) {
  let eventObj = await db.EventResearcher.find({ $or: [{ firstname: firstname, lastname: lastname, deletedBy: { $exists: false } }, { createdBy: id, deletedBy: { $exists: false } }] }).populate('event').populate({ path: 'event', populate: { path: 'type' } }).find({});
  console.log("EEE->", eventObj)
  eventObj.filter(event => !event.event?.deletedBy)
  if (name) {
    eventObj = eventObj.filter(event => event.event.name.includes(name))
  }
  if (type) {
    eventObj = eventObj.filter(event => event.event.type._id == type)
  }
  return eventObj.filter(event => event.event != null);
}

async function updateEventTarget(params, id, editorid) {
  var eventTarget = await db.EventTarget.findById(id);
  if (!eventTarget) return { status: 1, message: 'เกิดข้อผิดพลาด ไม่พบข้อมูล' };

  eventTarget.receivedbudget = params.receivedbudget || eventTarget.receivedbudget;
  eventTarget.expectdate = params.expectdate || eventTarget.expectdate;
  eventTarget.expectamount = params.expectamount || eventTarget.expectamount;
  eventTarget.expectincome = params.expectincome || eventTarget.expectincome;
  eventTarget.actualdate = params.actualdate || eventTarget.actualdate;
  eventTarget.actualamount = params.actualamount || eventTarget.actualamount;
  eventTarget.actualincome = params.actualincome || eventTarget.actualincome;
  eventTarget.lat = params.lat || eventTarget.lat;
  eventTarget.long = params.long || eventTarget.long;
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

async function getEventActivity(id, page = 0, limit = 8000) {
  if (id == 'all') {
    const eventObj = await db.EventActivity.find({ deletedBy: { $exists: false } }).populate('eventtarget image image2 image3 image4 image5').sort({ created_at: -1 }).limit(parseInt(limit)).skip(limit * page);
    return eventObj;
  }
  else {
    const eventObj = await db.EventActivity.findOne({ _id: id, deletedBy: { $exists: false } }).populate('eventtarget image image2 image3 image4 image5');
    return eventObj;
  }
}

async function getEventActivityByEventTargetId(id, page = 0, limit = 8000) {
  const eventObj = await db.EventActivity.find({ eventtarget: id, deletedBy: { $exists: false } }).populate('eventtarget image image2 image3 image4 image5').sort({ created_at: -1 }).limit(parseInt(limit)).skip(limit * page);
  return eventObj;
}

async function createEventActivity(params, creatorid) {
  const { eventtarget, image, image2, image3, image4, image5, event, detail, budget, startdate, enddate, note } = params;
  var activity = new db.EventActivity({ eventtarget, image, image2, image3, image4, image5, event, detail, budget, startdate, enddate, note });
  activity.createdBy = creatorid;
  await activity.save();
  return activity;
}

async function updateEventActivity(params, editorid) {
  var activityObj = await db.EventActivity.findById(editorid);
  if (!activityObj) return { status: 1, message: 'เกิดข้อผิดพลาด ไม่พบข้อมูล' };

  activityObj.image = params.image || activityObj.image;
  activityObj.image2 = params.image2 || activityObj.image2;
  activityObj.image3 = params.image3 || activityObj.image3;
  activityObj.image4 = params.image4 || activityObj.image4;
  activityObj.image5 = params.image5 || activityObj.image5;
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

async function getEventOtherList(id, page = 0, limit = 8000) {
  if (id == 'all') {
    const eventObj = await db.EventOtherList.find({ deletedBy: { $exists: false } }).sort({ created_at: 'desc' }).limit(parseInt(limit)).skip(limit * page);
    return eventObj;
  }
  else {
    const eventObj = await db.EventOtherList.find({ event: id, deletedBy: { $exists: false } })
    if (eventObj)
      return eventObj;
    else
      return []
  }
}

async function updateEventOtherList(params, eventId, editorid) {
  // Delete
  const otherListAllObj = await db.EventOtherList.find({ event: eventId })
  for (let key of otherListAllObj) {
    // console.log("Data ->", params.find(x => x._id == key._id))
    if (params.find(x => x._id == key._id)) {
      // console.log("keyt --<>", key)
      await key.save();
    }
    else {
      key.deletedBy = editorid
      await key.save();
    }
  }
  // Update
  for (let key of params) {
    if (key._id != 0) {
      var otherListObj = await db.EventOtherList.findById({ _id: key._id })
      otherListObj.list = key.list || otherListObj.list
      otherListObj.amount = key.amount || otherListObj.amount
      otherListObj.unit = key.unit || otherListObj.unit
      otherListObj.costPerAmount = key.costPerAmount || otherListObj.costPerAmount
      otherListObj.totalCost = key.totalCost || otherListObj.totalCost
      otherListObj.updatedBy = key.updatedBy || otherListObj.updatedBy
      await otherListObj.save();
    }
    else {
      var eventOtherList = new db.EventOtherList({ list: key.list, amount: key.amount, unit: key.unit, costPerAmount: key.costPerAmount, totalCost: key.totalCost, createdBy: editorid, event: eventId });
      // eventOtherList.createdBy = editorid;
      eventOtherList.save();
    }
  }

  return { message: 'แก้ไขข้อมูลสำเร็จ' };
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
  deleteEventActivity,
  getEventOtherList,
  updateEventOtherList,
  getPageEvent,
  getEventReseacherNameandLastName
}