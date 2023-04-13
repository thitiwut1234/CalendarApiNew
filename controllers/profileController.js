const profileService = require('../services/profileService');

async function getAllUser(req, res) {
  try {
    const { id, role } = req.auth;
    const response = await profileService.getAllRoleUsers(id, role)
    res.json(response)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getAllResearcher(req, res) {
  try {
    const { id, role } = req.auth;
    const response = await profileService.getAllRoleResearcher(id, role)
    res.json(response)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getUser(req, res) {
  try {
    const { userid } = req.params;
    const { id, role } = req.auth;
    const response = await profileService.getUser(userid, id, role);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function updateProfile(req, res) {
  try {
    const { userid } = req.params;
    const { id, role } = req.auth;
    const response = await profileService.updateProfile(req.body, userid, id, role);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function deleteUser(req, res) {
  try {
    const { userid } = req.params;
    const { id } = req.auth;
    const response = await profileService.deleteUser(userid, id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

module.exports = {
  getAllUser,
  getAllResearcher,
  getUser,
  updateProfile,
  deleteUser
}