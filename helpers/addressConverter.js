const districts = require('./addressConverter/districts.json');
const geography = require('./addressConverter/geography.json');
const provinces = require('./addressConverter/provinces.json');
const subdistricts = require('./addressConverter/subDistricts.json');
const zipcodes = require('./addressConverter/zipcodes.json');

function getProvince() {
    return provinces.map(x => { return {'value': x.PROVINCE_ID, 'label': x.PROVINCE_NAME }});
}

function getDistrict(province_id) {
    return districts.filter(x => x.PROVINCE_ID == province_id).map(x => { return {'value': x.DISTRICT_ID, 'label': x.DISTRICT_NAME}});
}

function getSubDistrict(district_id) {
    return subdistricts.filter(x => x.DISTRICT_ID == district_id).map(x => { return {'value': x.SUB_DISTRICT_ID, 'label': x.SUB_DISTRICT_NAME}});
}

function getZipCode(subdistrict_id) {
    return zipcodes.filter(x => x.SUB_DISTRICT_ID == subdistrict_id).map(x => { return {'value': x.ZIPCODE_ID, 'label': x.ZIPCODE}})
}

function convertProvince(provinceId){
    return (provinceId && provinces.find(province => province.PROVINCE_ID === parseInt(provinceId)).PROVINCE_NAME) || null;
}

function convertDistrict(districtId){
    return (districtId && districts.find(district => district.DISTRICT_ID === parseInt(districtId)).DISTRICT_NAME) || null;
}

function convertSubDistrict(subDistrictId){
    return (subDistrictId && subdistricts.find(subdistrict => subdistrict.SUB_DISTRICT_ID === parseInt(subDistrictId)).SUB_DISTRICT_NAME) || null;
}

function convertZipCode(zipCode){
    return (zipCode && zipcodes.find(zipcode => zipcode.ZIPCODE_ID === zipCode).ZIPCODE) || null;
}

module.exports = {
    getProvince,
    getDistrict,
    getSubDistrict,
    getZipCode,
    convertProvince,
    convertDistrict,
    convertSubDistrict,
    convertZipCode
};