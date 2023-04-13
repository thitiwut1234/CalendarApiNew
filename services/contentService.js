const db = require('../utils/db');

async function getContent(id, page = 0, limit = 8000) {
  if (id == 'all') {
    const contentObj = await db.Content.find({ deletedBy: { $exists: false } }).populate('image').sort({ date: -1 }).limit(parseInt(limit)).skip(limit * page);
    return contentObj;
  }
  else {
    const contentObj = await db.Content.findOne({ _id: id, deletedBy: { $exists: false } }).populate('image');
    return contentObj;
  }
}

async function getNews(page = 0, limit = 8000) {
  const contentObj = await db.Content.find({ type: "news" , deletedBy: { $exists: false } }).populate('image').sort({ created_at: 'desc' }).limit(parseInt(limit)).skip(limit * page);
  const total = (await db.Content.find({ type: "news" , deletedBy: { $exists: false } })).length
  const allpage = Math.ceil(total/limit)
  const content = {contentObj , total , allpage } 
  return content;

}

async function getType(typeInput) {
  const contents = await db.Content.find({ type: typeInput, deletedBy: { $exists: false } }).lean().populate('image', 'filename');

  // contents.forEach(async (content, index) => {
  //   const image = await db.Image.find({ _id: content.image })
  //   content.imagePath = image.imageUrl
  //   // console.log("Data " , image , content)
  // })
  console.log("contents ", contents)

  const { _id, type, header, title, content, image } = contents;

  return contents;
}

async function createContent(params, creatorid) {
  const { type, name, header, title, content, image } = params;
  var contentObj = new db.Content({ type, name, header, title, content, image });
  contentObj.createdBy = creatorid;
  await contentObj.save();
  return contentObj;
}

async function editContent(id, params, editorid) {
  var contentObj = await db.Content.findById(id);
  if (!contentObj) return { status: 1, message: 'เกิดข้อผิดพลาด ไม่พบข้อมูล' };

  contentObj.name = params.name || contentObj.name;
  contentObj.header = params.header || contentObj.header;
  contentObj.title = params.title || contentObj.title;
  contentObj.content = params.content || contentObj.content;
  contentObj.image = params.image || contentObj.image;
  contentObj.updatedBy = editorid;

  await contentObj.save();
  return { contentObj, message: 'แก้ไขข้อมูลสำเร็จ' };
}

async function deleteContent(id, deleterid) {
  var content = await db.Content.findById(id);
  content.deletedBy = deleterid;
  await content.save();
  return { message: 'ลบข้อมูลสำเร็จ' };
}

module.exports = {
  getContent,
  getType,
  createContent,
  editContent,
  getNews,
  deleteContent
};
