const imageService = require('../services/imageService');

async function upload(req, res) {
  try {
    const response = await imageService.upload(req.file, req.body.type, req.auth.id);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getImage(req, res) {
  try {
    var fullUrl = req.protocol + '://' + req.get('host') + '/storage/';
    const response = await imageService.getImage(fullUrl, req.params.id, req.query.type, req.query.page, req.query.limit);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

module.exports = {
  upload,
  getImage
}