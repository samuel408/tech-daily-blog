const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI ;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Remove the following deprecated options
  // useCreateIndex: true,
  // useFindAndModify: false,

});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;