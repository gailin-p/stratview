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
    // Get search features 
    const search_features = $('#search-select').val(); 

    get('/api/search', {search_features: search_features}, function(results){
        console.log(results);
    })
}

getSearchOptions();
document.getElementById("go-search").addEventListener('click', searchResults);