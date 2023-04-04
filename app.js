require('dotenv').config({ path: `./env.${process.env.NODE_ENV}` });
const PORT = process.env.PORT;

// importing the dependencies
const express = require('express');
const { urlencoded, json } = require('body-parser');
const bodyParserErrorHandler = require('express-body-parser-error-handler');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const slugify = require('slugify');
const { imageWhitelist } = require('./utils/image-whitelist');

// define routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const imageRoutes = require('./routes/imageRoutes');
const utilityRoutes = require('./routes/utilityRoutes');
const contentRoutes = require('./routes/contentRoutes');
const eventRoutes = require('./routes/eventRoutes');
const reportRoutes = require('./routes/reportRoutes');

// defining the Express app
const app = express();

// defining an array to work as the database (temporary solution)
const ads = [
  {title: 'Calendar API Service'}
];

// defining multer properties
const multerMid = multer({
  storage: multer.diskStorage({
    destination: 'public/uploads/',
    filename: (req, file, cb) => {
      const name = slugify(file.originalname, { lower: true })
      cb(null, `${new Date().getTime()}-${name}`)
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!imageWhitelist.includes(file.mimetype)) {
      return cb(new Error('file is not allowed'))
    }
    cb(null, true)
  }
})

// adding Helmet to enhance your API's security
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// using bodyParser to parse JSON bodies into JS objects
// app.use(bodyParser.json());
app.use(urlencoded({extended: false, limit: '250kb'}));
app.use('/', json({limit: '250kb'}));
app.use(bodyParserErrorHandler());

// setting multer to store file
app.use(multerMid.single('file'));

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/', (req, res) => {
  res.send(ads);
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/image', imageRoutes);
app.use('/storage', express.static('public/uploads'));
app.use('/api/utility', utilityRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/report', reportRoutes);

// starting the server
app.listen(PORT, () => {
  console.log('service listening on port', PORT);
});