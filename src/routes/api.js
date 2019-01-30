// dependencies
const express = require('express');

// models
const Feature = require('../models/feature');
const Grain = require('../models/grain');
const Bed = require('../models/bed');
const Column = require('../models/column');
const SIndex = require('../search/index');

// search 
const {computeIndex} = require('../search/compute_index');

const router = express.Router();

// api endpoints

// on search query : 
// - Get index for each feature in search 
// - Combine frequencies for each column_id 
// - Sort based on combined frequencies 
// - Return list of {column_id: , feature1: feature2: ...}
router.get('/search', function(req, res) {
    const featuresStr = req.query.search_features;
    const features = featuresStr.split(',');

    SIndex.find({ feature_id: { $in : features }  }, function(err, indices){
        if (err) console.log(err);
        
        var values = new Map(); // map from column name -> measure of match quality
        for (i=0; i< indices.length; i++){
            const index = indices[i].frequency; 
            index.forEach(function(value, key, map){
                quality = values.has(key) ? values.get(key) + value : value
                values.set(key, quality); 
            });            
        }

        var result = Array.from(values.keys());
        result.sort(function (a, b) {
            return values.get(b) - values.get(a);
        })

        console.log(result); 
        res.send(result); 
    });
});

router.get('/column', function(req, res) {
    Column.find({column_id: req.query.column_id}, function(err, col) {
        res.send(col);
    });
});

router.get('/columns', function(req, res) {
    Column.find({}, function(err, cols) {
        res.send(cols);
    });
});

router.get('/columns_by_ids', function(req, res){
    const idsStr = req.query.column_ids; 
    const ids = idsStr.split(','); 
    Column.find({column_id: {$in: ids}}, function(err, cols){
        res.send(cols); 
    })
});

router.get('/beds', function(req, res) {
    Bed.find({ column_id: req.query.column_id}, function(err, beds) {
        res.send(beds);
    });
});

router.get('/feature', function(req,res){
    // return all features 
    Feature.find({}, function (err, features){
        res.send(features);
    }); 
});

router.get('/grain', function(req,res){
    // return all grains 
    Grain.find({}, function (err, grains){
        res.send(grains);
    }); 
});

router.post('/column', function(req, res) { 
    // req.body because this is a post request
    beds = []
    for (i=0; i<req.body.beds.length; i++) {
        const b = req.body.beds[i];
        const newBed = new Bed({
            bed_start: b.bed_start, 
            bed_end: b.bed_end, 
            grain_size: b.grain_size, 
            features : b.features, 
            column_id: b.column_id, 
        });
        newBed.save(function(err, bed){
            if(err) console.log(err);
        });
        beds.push(newBed); 
    };

    const newCol = new Column({
        column_id: req.body.column_id, 
        creator_id: "Anon", 
        formation: req.body.formation, 
        description: req.body.description, 
        search_keys: [],
    });
    newCol.save(function(err){
        if(err) {console.log(err); }
    })

    // Computing index using beds that are NOT the saved version of the beds
    // This is ok iff two people are not trying to create a column with the same column_id
    // at the same time. Ok for now at this scale, would need locks / safety at larger scale
    computeIndex(req.body.column_id, beds);
    
    res.send({});
});

module.exports = router;
