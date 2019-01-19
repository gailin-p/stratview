
function columnDOMObject(columnJSON) {
    const card = document.createElement('div');
    card.setAttribute('id', columnJSON._id);
    card.className = 'card column';
  
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    card.appendChild(cardBody);
  
    const creatorSpan = document.createElement('a');
    creatorSpan.className = 'card-title';
    creatorSpan.innerHTML = columnJSON.column_id;
    // TODO Bill -- add link to column page 
    //creatorSpan.setAttribute('href', '/u/profile?' + columnJSON.creator_id);
    cardBody.appendChild(creatorSpan);
  
    const contentSpan = document.createElement('p');
    contentSpan.className = 'card-text';
    contentSpan.innerHTML = columnJSON.description;
    cardBody.appendChild(contentSpan);
  
    return card;
  }

// For now, just get all columns 
// TODO: get recent columns created by a user
function getColumns() {
    const storiesDiv = document.getElementById('my-columns');
    get('/api/columns', {}, function(cols) {
      for (let i = 0; i < cols.length; i++) {
        console.log(cols[i])
        const currentStory = cols[i];
        storiesDiv.prepend(columnDOMObject(currentStory));
      }
    });
}

getColumns();