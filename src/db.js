const mongoose = require('mongoose');

// setup mongoDB connection
// TODO saving the srv with username/pw in plaintext is maybe not the best idea long term
const mongoURL = "mongodb+srv://user:user@cluster0-iaei2.mongodb.net/test?retryWrites=true";
const options = {
    useNewUrlParser: true,
    autoIndex: false // set this to true if creating or updating indices in schemas
};
mongoose.connect(mongoURL, options);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

// db error handling
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function() { console.log('database connected'); });
module.exports = db;
