// import node module
const mongoose = require('mongoose');

// define a schema
const FeatureModelSchema = new mongoose.Schema({
    feature_id: {type: String , unique: true, index: true}, 
    description: String,
});

// compile model from schema
module.exports = mongoose.model('FeatureModel', FeatureModelSchema);