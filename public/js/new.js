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
// TODO Data validation!!!!
/**
 * - is this column name already being used? 
 * - do the beds overlap? 
 * - does the sum of the bed widths = the top of the final bed? (doesn't need to, but good check)
 */
function saveColumn() {
    // FIRST: create column 
    const newCol = {
        formation: document.getElementById('formation-name').value, 
        column_id: document.getElementById('column-name').value.trim(),
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

    var chem = []; // object for each chem data 
    // Create a chem object for each chemical data 
    var $chem = $('.chemdata');
    $chem.each(function () {
        var cdata = {}; 
        cdata["data_type"] = $(this).find('.card-header').text();
        cdata["column_id"] = newCol.column_id;
        cdata["data"] = []; 
        $(this).find('.data-row').each(function() {
            datum = {} 
            datum["depth"] = $(this).find('.chem-height').eq(0).text();
            datum["value"] = $(this).find('.chem-value').eq(0).text();
            cdata.data.push(datum); 
        });
        chem.push(cdata);
    })
    newCol.chem = chem; 
    newCol.edited = edited; 

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
    card.className = 'card data-card chemdata'; // chemdata class is just for finding these 

    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header'; 
    cardHeader.innerHTML = chemtype; 
    card.appendChild(cardHeader);
  
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    const table = document.createElement('table'); 
    table.className = 'table table-bordered table-sm table-responsive-md table-striped text-center';

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
        const row = document.createElement('tr'); 
        row.className ="d-flex data-row"; // data-row is for getting rows (when saving)
        const col1 = document.createElement('td'); col1.className ="col-5";
        col1.setAttribute("contenteditable", "true"); 
        col1.innerHTML = "0.0";
        col1.classList.add("chem-height");// for finding this cell (when saving)
        col1.classList.add('number'); 
        const col2 = document.createElement('td'); col2.className="col-5";
        col2.setAttribute("contenteditable", "true"); 
        col2.innerHTML = "0.0";
        col2.classList.add("chem-value"); // for finding this cell (when saving)
        col2.classList.add('number'); 
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

// Add a lithology. Add new lith object to list, Update lithology dropdowns 
function addLith(){
    $('#lithologies').append('<li class="list-group-item"><span class="lith-name">'+$("#lith-input").val().trim()+
    '</span><button type="button" class="lith-remove btn float-right btn-outline-danger btn-sm my-0">' +
    '<em class="fas fa-trash-alt"></em></button></li>');
    $('.lith-remove').on('click', function() {
        const lithID = $(this).parent('li').find('.lith-name').text().trim().replace(/\s+/g, '-');
        // remove from list of lithologies 
        $(this).parent('li').remove();
        // de-select this lithology 
        $('tr').not('.hide').find('select.lith-select[value="'+lithID+'"]').val([])
        // remove from dropdown 
        $('.lith-select').find('[value='+lithID+']').remove();
        $('tr').not(".hide").find('.lith-select').selectpicker('refresh'); 
    });
    
    // update dropdowns
    const lithID = $("#lith-input").val().trim().replace(/\s+/g, '-');
    $('select.lith-select').append("<option value='" + lithID + "'>"+$("#lith-input").val().trim()+"</option>");
    // refresh dropdowns in non-hidden rows
    $('tr').not(".hide").find('.lith-select').selectpicker('refresh'); 
    
    // clear data entry
    $('#lith-input').val('');
}


// If an existing column is specified, load its beds and chemical data
function loadData(column_id) {
    if (column_id.length == 0){
        return false; 
    }
    // loading spinners 
    $('#show-beds').attr("disabled", true);
    $('#show-beds').text("Loading beds...");
    //TODO: figure out why I can't get a spinner here (see https://getbootstrap.com/docs/4.3/components/spinners/ )
    //$('#show-beds').append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
    get('/api/column', {column_id: column_id }, function(columns){
        // Set formation, description 
        const column = columns[0];
        $('#formation-name').val(column.formation); 
        $('#column-name').val(column.column_id); 
        $('#description').val(column.description);
    }); 
    get('/api/beds', {column_id: column_id }, function (data) {
        // data is a list of beds. sort by bed start
        data.sort(function(a,b){return a.bed_start - b.bed_start;})
        console.log(data);
        // This is the same code used to add a row to the table. 
        // There may (probably is...) a better/more efficient way to do this
        for (var i=0; i<data.length; i++){
            var $TABLE = $('#table');
            var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide d-none');
            $clone.find('select').selectpicker(); // turn a normal select into searchable, multiselect
            $clone.addClass("d-flex")
            $TABLE.find('table').append($clone); 

            var $num = $clone.find('.number');
            var $select = $clone.find('select');

            $num.eq(0).text(data[i].bed_start); 
            $num.eq(1).text(data[i].bed_end); 
            $select.eq(0).val(data[i].grain_size).change(); 
            $select.eq(1).val(data[i].features).change(); 
        }
        // loading complete
        $('#show-beds').removeAttr("disabled");
        $('#show-beds').text("Show beds")
    }); 

    get('/api/chem', {column_id: column_id}, function(chemData){

    });  

    return true; 

}

// Initialize data 
getFeatureOptions(); // Initialize dropdowns 
tableSetUp(); // Initializes buttons for beds table only 
const column_id = decodeURI(window.location.search.substring(1));
const edited = loadData(column_id); // returns boolean 

// Set up event listeners 
document.getElementById("chem-add").addEventListener('click', onNewChem);
document.getElementById("save-col").addEventListener('click', saveColumn);
document.getElementById("add-lith").addEventListener('click', addLith); 

// Button to add chemical data should be dissabled until something is selected
$( "#chem-select" ).change(function() {
    $("#chem-add").removeAttr('disabled');
});