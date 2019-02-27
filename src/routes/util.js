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
            col = columns[i];
            Bed.find({column_id: col.column_id}, function(err, beds){
                if(err) console.log(err); 
                if(beds.length < 1) console.log("ERROR: Column has no beds")
                // index
                console.log("column "+beds[0].column_id);
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

        //features = ['spr', 'al', '10 qtz sand', '20 qtz sand', 'icg', 'rip', '30 qtz sand', 'si', 'ss', 'vg']
        features = ['non', 'ewc', 'silt', 'icg', 'si nod', 'si', 'vg', 'red siltstone', 'oo', 'ecstm', 
        'Sandstone', 'pis', 'tfted lam', 'Tep', 'hcs', 'xbed', 'recry', 'al', 'vg al', 
         'alrose', '70qtzsand', 'brecciavg', 'vgal', 'rip', 'ripsi', 'vgrose', 
        'breccia', 'xbedcement', 'gypsumxstls', 'gp',  'sw', 
        '10 qtz sand', 'ss', 'wavy', 'rose', 'grded', '10 qtz nuclei', '30 vc qtz sand', 
        '50 vc qtz sand', 'tp', 'sparse oo', 'spr', '20 qtz sand', '30 qtz sand', 'dmstm', 
        '50 qtz sand', 'ss lenses', 'flaser', 'Oo', 'Si', 'tfa', 'onc', 
        'tufted', 'FP cements', '5 qtz sand', 'sii', 'sand', 'Xbed', 'nod', 'crl', 'mnod', 
        'Crl', 'ma', 'smstm', 'fl', 'crlmstm', 'ml', 'il', 'ilstm', 'ldmstm', 'mstm', 'ldstm', 
        'eldmstm', 'tstm', 'constm', 'isstm', 'smstm ml', 'md', 'cl', 'tftl', 'tl', 'mdstm', 
        'tb']

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

router.get('/deleteallbeds', function(req, res){
    col = "ST2"
    Bed.deleteMany({column_id:col}, function(err){
        if (err) {(console.log(err))}
        Column.deleteMany({column_id:col}, function(err){
            if(err) {console.log(err)}
            ChemData.deleteMany({column_id:col}, function(err){
                if(err) {console.log(err)};
                res.send("deleted everything for "+col);
            })
        })
    })
})

//For putting example columns into database. 
router.get('/omandat', function(req, res){
    // Fill in here with oman data from jupyter notebook 
    // bed_bottoms = 
    // bed_tops = 
    // grain = 
    // features = 

    // // chemistry is a list of lists of chem data entries {depth: , value: }
    // chemistry = 
    // // chem_types is a list of the chem types, same length as the outer list of chemistry 
    // chem_types = 
chem_types=[]
    chemistry = []

    bed_bottoms = [0.0, 4.0, 6.0, 8.0, 9.0, 11.0, 14.8, 16.0, 18.6, 25.4, 30.2, 30.9, 31.0, 32.0, 33.0]
bed_tops = [4.0, 6.0, 8.0, 9.0, 11.0, 14.8, 16.0, 18.6, 25.4, 30.2, 30.9, 31.0, 32.0, 33.0, 33.4]
grain = ['vf', 'vf', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f']
features = [['constm', 'dolomite'], ['constm', 'dolomite'], ['constm', 'dolomite'], ['constm', 'dolomite'], ['constm', 'dolomite'], ['constm', 'dolomite'], ['constm', 'dolomite'], ['constm', 'dolomite'], ['dmstm', 'mstm', 'dolomite'], ['ma', 'dolomite'], ['dolomite'], ['10 qtz sand', 'sand', 'dolomite'], ['rip', 'dolomite'], ['il', 'ilstm', 'dolomite'], ['il', 'dolomite']]
col_name="WS3"
    

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
            console.log("saved bed")
        });
    };

    for (i = 0; i<chemistry.length; i++){
        const newChem = new ChemData({
            column_id: col_name, 
            data_type: chem_types[i],
            comments: "Chemical data from Bergmann", 
            data: chemistry[i]
        })
        newChem.save(function(err,bed){
            if(err) console.log(err); 
            console.log("saved chem")
        })
    }

    const newCol = new Column({
        column_id: col_name, 
        creator_id: "Anon", 
        formation: formation, 
        description: description, 
        search_keys: [],
    });
    newCol.save(function(err, formation){
        if(err) console.log(err); 
        console.log("saved column")
    })
    
    res.send({});
})


module.exports = router;