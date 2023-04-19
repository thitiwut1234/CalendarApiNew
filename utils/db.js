const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../models/User'),
    Content: require('../models/Content'),
    Image: require('../models/Image'),
    Event: require('../models/Event'),
    EventActivity: require('../models/EventActivity'),
    EventTarget: require('../models/EventTarget'),
    EventOtherList: require('../models/EventOtherList'),
    EventType: require('../models/EventType'),
    EventResearcher: require('../models/EventResearcher'),
    isValidId
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}