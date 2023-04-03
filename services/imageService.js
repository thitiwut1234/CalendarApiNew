const db = require('../utils/db');

async function upload(file, type, userid) {
  const { filename, mimetype, destination, path, size } = file;
  var image = new db.Image({ type, filename, mimetype, destination, path, size });
  image.createdBy = userid;
  await image.save();
  return image;
}

async function getImage(url, imageId, type, page, limit) {
  if(imageId == 'all') {
    var imageObj = await db.Image.find({ type }).sort({ date: -1 }).limit(parseInt(limit)).skip( limit * page );
    imageObj.forEach((x) => { x.imageUrl = url + x.filename });
    return imageObj;
  }
  else {
    var imageObj = await db.Image.findById(imageId);
    if(imageObj) {
      var imageUrl = url + imageObj.filename;
      const { _id, filename, mimetype, destination, path, size, createdBy, created_at, updated_at } = imageObj;
      return { _id, filename, mimetype, destination, path, size, createdBy, created_at, updated_at, imageUrl };
    }
    return imageObj;
  }
}

module.exports = {
  upload,
  getImage
}