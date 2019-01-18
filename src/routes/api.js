// dependencies
const express = require('express');

console.log("api")

// models
const Feature = require('../models/feature');
const Grain = require('../models/grain');
const Bed = require('../models/bed');
const Column = require('../models/column');

const router = express.Router();

// api endpoints

// TODO: eventually will want to search for a tag here. 
router.get('/column', function(req, res) {
    Column.find({}, function(err, col) {
        res.send(col);
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
    };

    const newCol = new Column({
        column_id: req.body.column_id, 
        creator_id: "Anon", 
        formation: req.body.formation, 
        description: req.body.description, 
        search_keys: [],
    });
    newCol.save(function(err, formation){
        if(err) console.log(err); 
    })
    
    res.send({});
});

module.exports = router;
