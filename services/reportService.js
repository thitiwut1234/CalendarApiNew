const db = require('../utils/db');

async function getReport(query) {
  var report = await db.Event.find({ deletedBy: { $exists: false } }).populate('type target');
  if (query.type && query.type != 'all') report = report.filter(x => x.type._id == query.type);
  if (query.province) report = report.filter(x => x.province == query.province);
  if (query.district) report = report.filter(x => x.district == query.district);
  if (query.subdistrict) report = report.filter(x => x.subdistrict == query.subdistrict);
  if (query.startdate && query.enddate)
    report = report.filter(x => x.startdate >= new Date(query.startdate) && x.startdate <= new Date(query.enddate))

  var newReport = [];
  report.forEach((x) => {
    var netprofit = 0;
    var avgAD = 0;
    var count = 0;
    var maxactualdate = 0;
    var sumactualamount = 0;
    var countTarget = 0;
    x.target.forEach((y) => {
      count++;
      var aa = y.actualamount;
      var ai = y.actualincome;
      var ad = y.actualdate;
      
      sumactualamount += aa
      if (ai && aa) 
        netprofit += (aa * ai);
      if (ad) {
        avgAD += ad;
        if (ad > maxactualdate) {
          maxactualdate = ad;
        }
      }
    });
    newReport.push({
      _id: x._id,
      name: x.name,
      type: x.type.name,
      quantity: x.quantity,
      expectquantity: x.expectquantity,
      startdate: x.startdate,
      enddate: x.enddate,
      expectdate: x.expectdate,
      province: x.province,
      district: x.district,
      subdistrict: x.subdistrict,
      netprofit: netprofit,
      maxactualdate: maxactualdate,
      averageactualdate: avgAD / count,
      sumactualamount: sumactualamount,
      target : x.target.length
    });
  })

  var groups = [];

  newReport.reduce((arr, item) => {
    let group = groups.find(x => x.type == item.type);
    if (group) {
      group.event.push(item);
      group.event.sumnetprofit += item.netprofit;
    }
    else {
      groups.push({ type: item.type, sumnetprofit: item.netprofit, event: [item] });
    }
  }, {});
  return groups;
}

async function getReportTarget(id) {
  var report = await db.EventActivity.find({ deletedBy: { $exists: false } }).populate({ path: 'eventtarget', populate: { path: 'user' } });

  if (id)
    report = report.filter(x => x.eventtarget && x.eventtarget.event == id);

  var groups = [];
  var sumbudget = 0;

  report.forEach(x => {
    let group = groups.find(y => y.eventtarget._id == x.eventtarget._id);
    if(group) {
      group.netbudget += x.budget;
    }
    else {
      groups.push({ netbudget: x.budget, eventtarget: x.eventtarget});
    }
  })

  groups.forEach(x => sumbudget += x.netbudget);
  return { sumbudget, groups };
}

module.exports = {
  getReport,
  getReportTarget
}