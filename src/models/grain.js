// import node module
const mongoose = require('mongoose');

// define a schema
const GrainModelSchema = new mongoose.Schema({
    grain_size_id: {type: String , unique: true, index: true}, 
    description: String,
    size_class: Number, 
});

// compile model from schema
module.exports = mongoose.model('GrainModel', GrainModelSchema);