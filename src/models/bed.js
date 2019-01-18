// import node module
const mongoose = require('mongoose');

// define a schema
// For type safety, grain_size and features should really be Grain.schema, Features.schema
// But that's more work, so we just trust that the string will always be a grain or feature ID 
const BedModelSchema = new mongoose.Schema({
    column_id: String, 
    bed_start: Number, 
    bed_end: Number, 
    grain_size: String, 
    features: [String],
});

// compile model from schema
module.exports = mongoose.model('BedModel', BedModelSchema);