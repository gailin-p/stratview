// Contains DOM objects used to sumarize columns in several places in the UI


function columnDOMObject(columnJSON) {
    const card = document.createElement('div');
    card.setAttribute('id', columnJSON.column_id);
    card.className = 'card my-3';
  
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    card.appendChild(cardBody);

    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer';
    const checkBox = document.createElement('small');
    checkBox.className ='form-check pad-left';
    const check = document.createElement('input');
    check.className ='form-check-input';
    check.setAttribute('type', 'checkbox'); 
    check.setAttribute('value', ''); 
    check.setAttribute('id', 'check-'+columnJSON.column_id);
    const label = document.createElement('label'); 
    label.className ='form-check-label text-muted'; 
    label.setAttribute('for', 'check-'+columnJSON.column_id);
    label.innerHTML ='Visualize';
    checkBox.appendChild(check); 
    checkBox.appendChild(label);
    cardFooter.appendChild(checkBox);
    card.appendChild(cardFooter);
  
    const creatorSpan = document.createElement('a');
    creatorSpan.className = 'card-title';
    creatorSpan.innerHTML = columnJSON.column_id;
    creatorSpan.setAttribute('href', '/column?' + columnJSON.column_id);
    cardBody.appendChild(creatorSpan);
  
    const contentSpan = document.createElement('p');
    contentSpan.className = 'card-text';
    contentSpan.innerHTML = columnJSON.description;
    cardBody.appendChild(contentSpan);
  
    return card;
  }