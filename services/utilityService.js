const db = require('../utils/db');
const utility = require('../helpers/addressConverter');

async function getProvince() {
  return utility.getProvince();
}

async function getDistrict(id) {
  return utility.getDistrict(id);
}

async function getSubDistrict(id) {
  return utility.getSubDistrict(id);
}

async function getZipCode(id) {
  return utility.getZipCode(id);
}

module.exports = {
  getProvince,
  getDistrict,
  getSubDistrict,
  getZipCode
}