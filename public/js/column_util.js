// Contains DOM objects used to sumarize columns in several places in the UI


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

  