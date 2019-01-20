// Mongoose model for search indices 

// Feature = {column_id -> frequency}

const mongoose = require('mongoose');

const IndexModelSchema = new mongoose.Schema({
    feature_id: {type: String , unique: true, index: true}, 
    frequency: {
        type: Map,
        of: Number // values are numbers. keys are always strings 
    }
});

// compile model from schema
module.exports = mongoose.model('IndexModel', IndexModelSchema);

