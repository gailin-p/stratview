const mongoose = require('mongoose');

// define a schema
const ChemTypeModelSchema = new mongoose.Schema({
    chem_id: {type: String , unique: true, index: true}, 
    description: String,
});

// compile model from schema
module.exports = mongoose.model('ChemTypeModel', ChemTypeModelSchema);