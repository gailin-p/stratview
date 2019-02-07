// Hardcoded API bits - these are UTILITIES, should not be run by users.  
// In general should not be enabled. 
// Uses: 
// -- adding example columns (eg Oman columns) to database
// -- adding features and grain sizes to database 
// -- updating indices 

// DISABLED IN APP.JS
// IRL this should be a set of upgrade scripts. 

// dependencies
const express = require('express');

// models
const Feature = require('../models/feature');
const Grain = require('../models/grain');
const Bed = require('../models/bed');
const Column = require('../models/column');
const ChemType = require('../models/chem_type');
const ChemData = require('../models/chem');

// search 
const {computeIndex} = require('../search/compute_index');
const Index = require('../search/index');

const router = express.Router();

// api endpoints

// Recreate index: delete all existing indices, create new empty map for each feature in db
router.get('/recreateindex', function(req,res){
    Index.deleteMany({}, function(err){
        if (err) console.log(err);
        Feature.find({}, function(err, features){
            for (i = 0; i < features.length; i++){
                const fIndex = new Index({
                    feature_id: features[i].feature_id,
                    frequency: {},
                })
                fIndex.save()
            }
        });
    });
    res.send('deleting existing and creating blank indices');
});

// Rebuild index: for every column in database, run computeIndex 
// If you're doing this, probably do it after /recreateindex
router.get('/buildindex', function(req,res){
    Column.find({}, function(err, columns){
        for (i=0; i<columns.length; i++){
            console.log("column "+columns[i].column_id);
            col = columns[i];
            Bed.find({column_id: col.column_id}, function(err, beds){
                if(err) console.log(err); 
                if(beds.length < 1) console.log("ERROR: Column has no beds")
                // index
                computeIndex(beds[0].column_id, beds); 
            });
        }
        res.send("Index creation begun for all columns");
    })
}) ;

// For putting grains into database. 
router.get('/putgrain', function (req, res) {
    // Delete current grains 
    Grain.deleteMany({}, function (err) {
        if (err) console.log(err);

        // cov, c, mi
        grains = ['vf', 'f', 'm', 'cov', 'c', 'mi']
        sizes = [2, 3, 1, 0, 0, 4]
        descriptions = ['very fine', 'fine', 'mud?', 'unknown', 'unknown', 'mid?']

        for (i = 0; i < grains.length; i++) {
            grain = new Grain({
                grain_size_id: grains[i],
                description: descriptions[i],
                size_class: sizes[i],
            })

            grain.save(function (err, formation) {
                if (err) console.log(err);
            })
        }
    });

    res.send({});
})

// For putting features into database. 
router.get('/putfeature', function (req, res) {
    // Delete current grains 
    Feature.deleteMany({}, function (err) {
        if (err) console.log(err);

        features = ['spr', 'al', '10 qtz sand', '20 qtz sand', 'icg', 'rip', '30 qtz sand', 'si', 'ss', 'vg']

        for (i = 0; i < features.length; i++) {
            feature = new Feature({
                feature_id: features[i],
                description: 'temp ' + features[i] + ' description',
            })

            feature.save(function (err, formation) {
                if (err) console.log(err);
            });
        }

        res.send('Deleted feature types, replacing...');
    });
});

// For putting chemical data types into database. 
router.get('/putchemtype', function (req, res) {

    // Delete current grains 
    ChemType.deleteMany({}, function (err) {
        if (err) console.log(err);

        chem = ['13C', '18O', '34S', '34P', 'S']

        for (i = 0; i < chem.length; i++) {
            console.log('saving '+chem[i]);
            new_chem = new ChemType({
                chem_id: chem[i],
                description: 'temporary ' + chem[i] + ' description',
            })

            new_chem.save(function (err, c) {
                if (err) console.log(err);
            });
        }

        res.send('Deleted chemical data types, now saving');
    });
});

//For putting example columns into database. 
router.get('/omandat', function(req, res){
    // Fill in here with oman data from jupyter notebook 
    bed_bottoms = 
    bed_tops = 
    grain = 
    features = 

    col_name = ""
    formation = "oman"
    description = "Data from Kristin Bergmann"

    for (i=0; i<bed_bottoms.length; i++) {
        const newBed = new Bed({
            bed_start: bed_bottoms[i], 
            bed_end: bed_tops[i], 
            grain_size: grain[i], 
            features : features[i], 
            column_id: col_name, 
        });
        newBed.save(function(err, bed){
            if(err) console.log(err);
        });
    };

    const newCol = new Column({
        column_id: col_name, 
        creator_id: "Anon", 
        formation: formation, 
        description: description, 
        search_keys: [],
    });
    newCol.save(function(err, formation){
        if(err) console.log(err); 
    })
    
    res.send({});
})


module.exports = router;