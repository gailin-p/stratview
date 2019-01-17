// import node module
const mongoose = require('mongoose');

// local dependency
const Feature = require('./feature');
const Grain = require('./grain')

// define a schema
const BedModelSchema = new mongoose.Schema({
    column_id: String, 
    bed_start: Number, 
    bed_end: Number, 
    grain_size: Grain, 
    features: [Feature],
});

// compile model from schema
module.exports = mongoose.model('BedModel', BedModelSchema);