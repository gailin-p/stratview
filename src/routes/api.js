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

// TODO TEMPORARY - just for saving features to db 
// router.post('/feature', function(req, res){ 
//     const newFeature = new Feature({
//         'feature_id' : req.body.feature_id, 
//         'description' : req.body.description,
//     }); 

//     newFeature.save(function(err, feature) {
//         if (err) console.log(err); 
//     }); 

//     res.send({}); 
// });

// TODO this is just innards from catbook 
router.post('/column', function(req, res) {
    // CODE TGT: Create a new story with the "content" parameter
    // Question: Do we get content with req.body.content or req.query.content? 
    // req.body because this is a post request
    const newStory = new Story({
        'creator_id': 'anonid',
        'creator_name': 'Anonymous',
        'content': req.body.content
    });
    // Save the story
    newStory.save(function(err, story) {
        if (err) console.log(err);
    });
    // Send an empty response
    res.send({});
});

module.exports = router;
