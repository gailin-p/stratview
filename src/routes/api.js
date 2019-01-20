// dependencies
const express = require('express');

// models
const Feature = require('../models/feature');
const Grain = require('../models/grain');
const Bed = require('../models/bed');
const Column = require('../models/column');

// search 
const {computeIndex} = require('../search/compute_index');
const {search} = require('../search/search_query');

const router = express.Router();

// api endpoints

router.get('/search', function(req, res) {
    res.send(search(req.query.search_features)); 
});

router.get('/column', function(req, res) {
    Column.find({column_id: req.query.column_id}, function(err, col) {
        res.send(col);
    });
});

router.get('/columns', function(req, res) {
    Column.find({}, function(err, cols) {
        console.log(cols[0]);
        res.send(cols);
    });
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
    // return all features 
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
