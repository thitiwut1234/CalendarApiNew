const utilityService = require('../services/utilityService');

async function getProvince(req, res) {
  try {
    const response = await utilityService.getProvince();
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getDistrict(req, res) {
  try {
    const response = await utilityService.getDistrict(req.params.id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getSubDistrict(req, res) {
  try {
    const response = await utilityService.getSubDistrict(req.params.id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getZipCode(req, res) {
  try {
    const response = await utilityService.getZipCode(req.params.id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getRankName(req, res) {
  try {
    const response = await utilityService.getRankName();
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

module.exports = {
  getProvince,
  getDistrict,
  getSubDistrict,
  getZipCode,
  getRankName
}