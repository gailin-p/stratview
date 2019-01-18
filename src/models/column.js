// import node module
const mongoose = require('mongoose');

// local dependency
const Feature = require('./feature');

// define a schema
const ColumnModelSchema = new mongoose.Schema({
    column_id: String, 
    creator_id: String,
    formation: String, 
    description: String, 
    search_keys: [String]
});

// compile model from schema
module.exports = mongoose.model('ColumnModel', ColumnModelSchema);
