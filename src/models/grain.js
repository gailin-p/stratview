// import node module
const mongoose = require('mongoose');

// define a schema
const GrainModelSchema = new mongoose.Schema({
    grain_size_id: String, 
    description: String,
});

// compile model from schema
module.exports = mongoose.model('GrainModel', GrainModelSchema);