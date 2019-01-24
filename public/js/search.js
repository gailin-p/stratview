function getSearchOptions() {
    // add features to dropdowns 
    const fSelect = document.getElementById("feature-opt");
    get('/api/feature', {}, function (features) {
        for (let i = 0; i < features.length; i++) {
            const featureElt = document.createElement('option'); 
            featureElt.setAttribute("data-subtext", features[i].description);
            featureElt.innerHTML = features[i].feature_id;
            fSelect.appendChild(featureElt);
        }
    });

    // TODO allow searching for grain size
    // const gSelect = document.getElementById("grain-opt");
    // get('/api/grain', {}, function (grains) {
    //     for (let i = 0; i < grains.length; i++) {
    //         const grainElt = document.createElement('option'); 
    //         grainElt.setAttribute("data-subtext", grains[i].description);
    //         grainElt.innerHTML = grains[i].grain_size_id;
    //         gSelect.appendChild(grainElt);
    //     }
    // });
}

function searchResults() {
    // Clear old search results. snippet from https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript 
    const resultsDOM = document.getElementById("search-results");
    while (resultsDOM.firstChild) {
        resultsDOM.removeChild(resultsDOM.firstChild);
    }

    // Get search features 
    const search_features = $('#search-select').val(); 

    get('/api/search', {search_features: search_features}, function(results_list){
        // Get map column_id -> column object for each 
        get('/api/columns_by_ids', {column_ids: results_list}, function(columns){
            // Map so we can look up each column in the search results 
            var cols = new Map; 
            for (i=0; i<columns.length; i++){
                cols.set(columns[i].column_id, columns[i]); 
            }

            // Create dom object in order of search results
            const resultsDOM = document.getElementById("search-results"); 
            for (i=0; i<results_list.length; i++){
                resultsDOM.append(columnDOMObject(cols.get(results_list[i]))); 
            }
        });
    });
}

getSearchOptions();
document.getElementById("go-search").addEventListener('click', searchResults);