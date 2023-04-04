const db = require('../utils/db');
const bcrypt = require('bcrypt');

async function getAllRoleUsers(finderid, finderRole) {
  if (finderRole !== 'user') {
    const user = await db.User.find({ role: "user", deletedBy: { $exists: false } }).populate('deletedBy');
    const { _id, idnumber, email, firstname, lastname, birthdate, address, province, district, subdistrict, zipcode, role, createdBy, created_at, updatedBy, updated_at, deletedBy } = user;
    return user;
  }
  return;
}

async function getAllRoleResearcher(finderid, finderRole) {
  if (finderRole === 'admin') {
    const user = await db.User.find({ role: "researcher", deletedBy: { $exists: false } }).populate('deletedBy');
    const { _id, idnumber, email, firstname, lastname, birthdate, address, province, district, subdistrict, zipcode, role, createdBy, created_at, updatedBy, updated_at, deletedBy } = user;
    return user;
  }
  return;
}

async function getUser(userid, finderid, finderRole) {
  if (finderRole !== 'admin' && finderRole !== 'researcher')
    if (finderid !== userid) return;

  const user = await db.User.findById(userid);
  if (!user) return;
  const { _id, idnumber, email, firstname, lastname, birthdate, address, province, district, subdistrict, zipcode, role, createdBy, created_at, updatedBy, updated_at, deletedBy } = user;
  return { _id, idnumber, email, firstname, lastname, birthdate, address, province, district, subdistrict, zipcode, role, createdBy, created_at, updatedBy, updated_at, deletedBy };
}

async function updateProfile(params, userid, updaterid, updaterRole) {
  if (updaterRole !== 'admin' && updaterRole !== 'researcher')
    if (updaterid !== userid) return { status: 1, message: 'ไม่สามารถแก้ไขข้อมูลได้' };

  var user = await db.User.findById(userid);
  if (!user) return { status: 2, message: 'เกิดข้อผิดพลาด ไม่พบข้อมูล' };

  if (params) {
    if (updaterRole === 'admin') {
      user.email = params.email || user.email;
      user.idnumber = params.idnumber || user.idnumber;
      user.role = params.role || user.role;
    }
    user.password = (params.password && await bcrypt.hash(params.password, 10)) || user.password;
    user.firstname = params.firstname || user.firstname;
    user.lastname = params.lastname || user.lastname;
    user.birthdate = params.birthdate || user.birthdate;
    user.address = params.address || user.address;
    user.province = params.province || user.province;
    user.district = params.district || user.district;
    user.subdistrict = params.subdistrict || user.subdistrict;
    user.zipcode = params.zipcode || user.zipcode;
    user.updatedBy = updaterid;
  }
  await user.save();
  return { user, message: 'แก้ไขข้อมูลสำเร็จ' };
}

async function deleteUser(userid, deleterid) {
  var user = await db.User.findById(userid);
  user.deletedBy = deleterid;
  await user.save();
  return { message: 'ลบผู้ใช้งานสำเร็จ' };
}

module.exports = {
  getAllRoleUsers,
  getAllRoleResearcher,
  getUser,
  updateProfile,
  deleteUser
}