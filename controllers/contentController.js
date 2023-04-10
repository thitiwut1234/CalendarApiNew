const contentService = require('../services/contentService');

async function getContent(req, res) {
  try {
    const response = await contentService.getContent(req.params.id, req.query.page, req.query.limit);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getNews(req, res) {
  try {
    const response = await contentService.getNews(req.body.page, req.body.limit);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function getType(req, res) {
  try {
    const response = await contentService.getType(req.body.type);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function createContent(req, res) {
  try {
    const response = await contentService.createContent(req.body, req.auth.id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

async function editContent(req, res) {
  try {
    const response = await contentService.editContent(req.params.id, req.body, req.auth.id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid email or password' });
  }
}

async function deleteContent(req, res) {
  try {
    const response = await contentService.deleteContent(req.params.id, req.auth.id);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
}

module.exports = {
  getContent,
  createContent,
  editContent,
  getType,
  getNews,
  deleteContent
};
