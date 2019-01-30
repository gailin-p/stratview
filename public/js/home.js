// For now, just get all columns 
// TODO: get recent columns created by a user
function getColumns() {
    const storiesDiv = document.getElementById('my-columns');
    get('/api/columns', {}, function(cols) {
      for (let i = 0; i < cols.length; i++) {
        const currentStory = cols[i];
        storiesDiv.prepend(columnDOMObject(currentStory));
      }
    });
}

sessionStorage.setItem('mykey', "myvalue");
getColumns();