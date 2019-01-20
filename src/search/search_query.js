// on search query (call from api handler) : 
// - Get index for each feature in search 
// - Combine frequencies for each column_id 
// - Sort based on combined frequencies 
// - Return list of column_id 

// How to combine features: 

// return a search result: [{column_id: , feature1: , ...}...]
function search(features){
    console.log(features);
    return {}
}

module.exports = {search};