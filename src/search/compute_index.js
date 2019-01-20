// For a new column: 
// - for each feature in the column, compute frequency of that feature 
// - save each frequency into the index for that feature 
// This should be called once per column, on creation. 
// If we add column editing, it would need to be called after column edit. 
// If new features are added, this needs to be run for all columns. 


const SIndex = require('./index');
const Column = require('../models/column');
const Bed = require('../models/bed');

// Column, list of beds 
function computeIndex(column_id, beds) {
    const allBeds = beds.length; // for computing frequency
    var count = new Map(); // map from feature name -> total 
    for (i = 0; i< beds.length; i++) {
        const bed = beds[i]; 
        for (f = 0; f<bed.features.length; f++){
            const feature = bed.features[f];
            newCount = count.has(feature) ? count.get(feature) + 1 : 1; 
            count.set(feature, newCount); 
        }
    }

    // Save to index 
    count.forEach(function(value, key, map){
        // Index.find({feature_id: key}, function(err, indices){
        //     if(err) console.log(err); 
        //     if(indices.length != 1) console.log("ERROR: multiple indices for feature");
            
        //     index = indices[0] 
        //     index.frequency.set(column.column_id, value/allBeds); 
        //     index.save(); 
        //     console.log('saved index for feature '+key + ', col '+column.column_id);
        // }); 
        SIndex.update({ feature_id: key }, { $set: { ['frequency.'+column_id]: value/allBeds }}, function(err, raw){
            if (err) console.log(err);
        });
    });

}

module.exports = { computeIndex}; 