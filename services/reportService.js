const db = require('../utils/db');

async function getReport(query) {
  // return new Promise(async (resolve, reject) => {
  //   try {
  //     var types = await db.EventType.find({ deletedBy: { $exists: false } }).sort({ created_at: 'asc' }).limit(parseInt(query.limit)).skip(query.limit * query.page)
  //     types.forEach(async (type, index) => {
  //       var events = await db.Event.find({ type: type._id, deletedBy: { $exists: false } })
  //       types[index].data = events
  //       console.log(index, events)
  //     })

  //     setTimeout(() => {
  //       resolve(types)
  //     }, [1500])

  //   }
  //   catch (err) {
  //     reject(ErrorNotFound('Data not found'))
  //   }
  // })
  var report = await db.Event.find({ deletedBy: { $exists: false } }).populate('type target')
  console.log("Report", report)
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
    var sumreceivedbudget = 0
    var countTarget = 0;
    x.target.forEach((y) => {
      count++;
      var aa = y.actualamount;
      var ai = y.actualincome;
      var ad = y.actualdate;
      sumreceivedbudget += y.receivedbudget
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
      receivedbudget: x.receivedbudget,
      sumreceivedbudget: x.budget == null ? 0 : x.budget,
      target: x.target.length
    });
  })

  var groups = [];

  newReport.reduce((arr, item) => {
    let group = groups.find(x => x.type == item.type);
    if (group) {
      group.event.push(item);
      group.event.sumreceivedbudget += item.receivedbudget
      group.event.sumnetprofit += item.netprofit;
    }
    else {
      groups.push({ type: item.type, sumnetprofit: item.netprofit, event: [item] });
    }
  }, {});
  // return groups.splice(query.page * query.limit, query.limit);
  if (query.page == -1) {
    return groups
  }
  else if (query.type) {
    groups[0].event = groups[0].event.splice(query.page * query.limit, query.limit);
    return groups
  }
  else {
    return groups.splice(query.page * query.limit, query.limit);
  }
}

async function getReportTotal(query) {
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
    var sumreceivedbudget = 0
    var countTarget = 0;
    x.target.forEach((y) => {
      count++;
      var aa = y.actualamount;
      var ai = y.actualincome;
      var ad = y.actualdate;
      sumreceivedbudget += y.receivedbudget
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
      receivedbudget: x.receivedbudget,
      sumreceivedbudget: x.budget == null ? 0 : x.budget,
      target: x.target.length
    });
  })

  var groups = [];

  newReport.reduce((arr, item) => {
    let group = groups.find(x => x.type == item.type);
    if (group) {
      group.event.push(item);
      group.event.sumreceivedbudget += item.receivedbudget
      group.event.sumnetprofit += item.netprofit;
    }
    else {
      groups.push({ type: item.type, sumnetprofit: item.netprofit, event: [item] });
    }
  }, {});
  if (query.type) {
    return groups[0].event.length;
  }
  else {
    return groups.length;
  }
}

// async function getReportTarget(id) {
//   var report = await db.EventActivity.find({ deletedBy: { $exists: false } }).populate({ path: 'eventtarget', populate: { path: 'user' } });
//   console.log("Report ---> ", report.filter(x => x.eventtarget && x.eventtarget.event == id))

//   if (id)
//     report = report.filter(x => x.eventtarget && x.eventtarget.event == id);
//   // console.log("Report ---> ", report)
//   var groups = [];
//   var sumbudget = 0;
//   var sumreceivedbudget = 0;

//   report.forEach(x => {
//     let group = groups.find(y => y.eventtarget._id == x.eventtarget._id);
//     if(group) {
//       group.netbudget += x.budget;
//       group.netreceivedbudget += x.eventtarget.receivedbudget;
//     }
//     else {
//       groups.push({ netreceivedbudget: x.eventtarget.receivedbudget, netbudget: x.budget, eventtarget: x.eventtarget});
//     }
//   })

//   groups.forEach(x => {sumbudget += x.netbudget; sumreceivedbudget += x.netreceivedbudget});
//   return { sumreceivedbudget,sumbudget, groups };
// }

async function getReportTarget(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let reports = await db.EventTarget.find({ event: id, deletedBy: { $exists: false } }).populate('user event');
      sumbudget = 0
      sumreceivedbudget = 0
      let groups = []
      console.log("Report", reports)
      reports.forEach(async report => {
        let activitys = await db.EventActivity.find({ eventtarget: report._id, deletedBy: { $exists: false } })
        report.netbudget = 0
        activitys.forEach(activity => {
          report.netbudget += activity.budget
          sumbudget += activity.budget
        })
        sumreceivedbudget += report.receivedbudget
        groups.push({ netbudget: report.netbudget, report: report })
      })
      setTimeout(() => {
        resolve({ sumreceivedbudget, sumbudget, groups })
      }, [1000])

    }
    catch (err) {
      reject(ErrorNotFound('Data not found'))
    }

  })




  // if (id)
  //   report = report.filter(x => x.eventtarget && x.eventtarget.event == id);
  // console.log("Report ---> ", report)
  // var groups = [];
  // var sumbudget = 0;
  // var sumreceivedbudget = 0;

  // report.forEach(x => {
  //   let group = groups.find(y => y.eventtarget._id == x.eventtarget._id);
  //   if(group) {
  //     group.netbudget += x.budget;
  //     group.netreceivedbudget += x.eventtarget.receivedbudget;
  //   }
  //   else {
  //     groups.push({ netreceivedbudget: x.eventtarget.receivedbudget, netbudget: x.budget, eventtarget: x.eventtarget});
  //   }
  // })

  // groups.forEach(x => {sumbudget += x.netbudget; sumreceivedbudget += x.netreceivedbudget});


}


module.exports = {
  getReport,
  getReportTotal,
  getReportTarget
}