const mongoose = require('mongoose');

const ChemModelSchema = new mongoose.Schema({
    column_id: {type:String, index:true, unique:false},
    data_type: String, 
    comments: String,
    data: [{depth: Number, value: Number}],
});

// compile model from schema
module.exports = mongoose.model('ChemModel', ChemModelSchema);