// TODO consider splitting this file into one file to handle chemical data and one to handle stratigraphy

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

    window.location.href = "/" // go home
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
            chemElt.id = "option-"+chems[i].chem_id
            cSelect.appendChild(chemElt);
            $('#chem-select').selectpicker('refresh');
        }
    });
}

// Return a DOM object for chemical data entry 
function ChemDataEntryDOM(chemtype) {
    const card = document.createElement('div');
    card.className = 'card data-card';

    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header'; 
    cardHeader.innerHTML = chemtype; 
    card.appendChild(cardHeader);
  
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    const table = document.createElement('table'); 
    table.className = 'table table-bordered table-sm table-responsive-md table-striped text-center'
    //table.id = "table-" + chemtype;

    // table headers 
    const tableHead = document.createElement('tr'); 
    tableHead.className = "d-flex";
    const row1 = document.createElement('th'); 
    row1.innerHTML = "Height"
    row1.className = "col-5"
    const row2 = document.createElement('th'); 
    row2.innerHTML = "Value"
    row2.className = "col-5"
    const row3 = document.createElement('th');
    const trashGlyph = document.createElement('em'); 
    trashGlyph.className = "fas fa-trash-alt"
    row3.appendChild(trashGlyph);
    row3.className = "col-2"
    tableHead.appendChild(row1); tableHead.appendChild(row2); tableHead.appendChild(row3);
    table.appendChild(tableHead);

    cardBody.appendChild(table);

    // button for new table row 
    const buttonSpan = document.createElement('span'); 
    buttonSpan.className = "float-right";
    const button = document.createElement('button'); 
    button.className = "btn btn-outline-secondary";
    button.innerHTML = "Add row";
    button.addEventListener('click', () => {
        //console.log('hi i was clicked'+ chemtype);
        const row = document.createElement('tr'); 
        row.className ="d-flex";
        const col1 = document.createElement('td'); col1.className ="col-5";
        col1.setAttribute("contenteditable", "true"); 
        col1.innerHTML = "0.0";
        const col2 = document.createElement('td'); col2.className="col-5";
        col2.setAttribute("contenteditable", "true"); 
        col2.innerHTML = "0.0";
        const col3 = document.createElement('td'); col3.className="col-2";
        const button = document.createElement('button'); button.setAttribute('type', 'button');
        button.className = "table-remove btn btn-outline-danger btn-sm my-0";
        const trashGlyph = document.createElement('em'); 
        trashGlyph.className = "fas fa-trash-alt"
        button.appendChild(trashGlyph); col3.appendChild(button);
        row.appendChild(col1); row.appendChild(col2); row.appendChild(col3); 
        table.appendChild(row); 
        // Need to initialize click funciton for new table-remove button
        $('.table-remove').click(function () {
            $(this).parents('tr').detach();
        });
    });
    buttonSpan.appendChild(button);
    cardBody.appendChild(buttonSpan);

    card.appendChild(cardBody);
    return card;
}

function onNewChem() {
    const chemtype = $("#chem-select").val()
    $('#chem-dats').prepend(ChemDataEntryDOM(chemtype))

    // Find chemical data option and remove from selector 
    $('#option-'+chemtype).remove()
    $('#chem-select').selectpicker('refresh');
    $("#chem-add").attr('disabled', 'true');
}

getFeatureOptions(); // Initialize dropdowns 
tableSetUp(); // Initializes buttons for beds table only 
document.getElementById("chem-add").addEventListener('click', onNewChem);
document.getElementById("save-col").addEventListener('click', saveColumn);

// Button to add chemical data should be dissabled until something is selected
$( "#chem-select" ).change(function() {
    $("#chem-add").removeAttr('disabled');
});