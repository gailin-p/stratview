
function showBeds(column_id){ 
    bedsDiv = document.getElementById("beds");
    get('/api/beds', {column_id: column_id}, function(beds) {
        console.log(beds);
      });
}

const column_id = window.location.search.substring(1);
showBeds(column_id)