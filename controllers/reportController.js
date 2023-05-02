const reportService = require('../services/reportService');

async function getReport(req, res) {
  try {
    const response = await reportService.getReport(req.query);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getReportTotal(req, res) {
  try {
    const response = await reportService.getReportTotal(req.query);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getReportTarget(req, res) {
  try {
    const response = await reportService.getReportTarget(req.params.id)
      .then(response => { console.log(response), res.json(response) });
    ;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

module.exports = {
  getReport,
  getReportTotal,
  getReportTarget
}