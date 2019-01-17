// import node module
const mongoose = require('mongoose');

// define a schema
const FeatureModelSchema = new mongoose.Schema({
    feature_id: String, 
    description: String,
});

// compile model from schema
module.exports = mongoose.model('FeatureModel', FeatureModelSchema);