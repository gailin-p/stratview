// import node module
const mongoose = require('mongoose');

// local dependency
const Feature = require('./feature');

// define a schema
const ColumnModelSchema = new mongoose.Schema({
    column_id: {type: String , unique: true, index: true}, 
    creator_id: String, // currently unused
    formation: String, 
    description: String
});

// compile model from schema
module.exports = mongoose.model('ColumnModel', ColumnModelSchema);
