// Modeled off https://mdbootstrap.com/docs/jquery/tables/editable/#! 
// Makes the add bed button clone a hidden row, makes the remove button remove a row
function tableSetUp() {
    var $TABLE = $('#table');

    $('#add-row').click(function () {
        var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide d-none');
        $clone.find('select').selectpicker(); // turn a normal select into searchable, multiselect
        $clone.addClass("d-flex")
        $TABLE.find('table').append($clone);
    });

    $('.table-remove').click(function () {
        $(this).parents('tr').detach();
    });
}

// Table reading code modeled off https://mdbootstrap.com/docs/jquery/tables/editable/#! 
function saveColumn() {
    // FIRST: create column 
    const newCol = {
        formation: document.getElementById('formation-name').value, 
        column_id: document.getElementById('column-name').value,
        description: document.getElementById('description').value,
    }

    // NEXT: gather beds 
    var $TABLE = $('#table');
    var $rows = $TABLE.find('tr').not('.hide');
    jQuery.fn.shift = [].shift; // to shift first row (headers) off $rows
    $rows.shift(); 
    var data = [];

    // Turn all existing rows into a loopable array
    $rows.each(function () {
        var $num = $(this).find('.number');
        var $select = $(this).find('select');
        var bed = {};

        bed["bed_start"] = $num.eq(0).text(); 
        bed["bed_end"] = $num.eq(1).text(); 
        bed["grain_size"] = $select.eq(0).val(); 
        bed["features"] = $select.eq(1).val(); 
        bed["column_id"] = newCol.column_id;

        data.push(bed);
    });

    newCol.beds = data;
    post('/api/column', newCol); 

    window.location.href = "/" // go to user home
}

// Can't condense these calls into a function because return types are different 
function getFeatureOptions() {
    // add features to dropdowns 
    const fSelect = document.getElementsByClassName("feature-select")[0];
    get('/api/feature', {}, function (features) {
        for (let i = 0; i < features.length; i++) {
            const featureElt = document.createElement('option'); 
            featureElt.innerHTML = features[i].feature_id;
            fSelect.appendChild(featureElt);
        }
    });

    // add grains to grain size dropdown 
    const gSelect = document.getElementsByClassName("grain-select")[0];
    get('/api/grain', {}, function (grains) {
        for (let i = 0; i < grains.length; i++) {
            const grainElt = document.createElement('option'); 
            grainElt.innerHTML = grains[i].grain_size_id;
            gSelect.appendChild(grainElt);
        }
    });

    // add chem types to chem type dropdown 
    const cSelect = document.getElementById("chem-select");
    get('/api/chemtype', {}, function(chems){
        for (let i=0; i<chems.length; i++){
            const chemElt = document.createElement('option'); 
            chemElt.innerHTML = chems[i].chem_id;
            console.log(chemElt)
            cSelect.appendChild(chemElt);
        }
    });
    //$('#chem-select').selectpicker();
}

// Return a DOM object for chemical data entry 
function ChemDataEntryDOM(chemtype) {
    const card = document.createElement('div');
    card.setAttribute('id', chemtype);
    card.className = 'card column';
  
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    cardBody.innerHTML = chemtype;
    card.appendChild(cardBody);


    // TODO  data entry here 
  
    return card;
}

function onNewChem() {
    $('#chem-collapse').append(ChemDataEntryDOM($('#chem-select').val()))
}

getFeatureOptions();
tableSetUp();
document.getElementById("chem-add").addEventListener('click', onNewChem);
document.getElementById("save-col").addEventListener('click', saveColumn);