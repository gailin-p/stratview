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

    // $('.table-remove').click(function () {
    //     $(this).parents('tr').detach();
    // });
}

// Table reading code modeled off https://mdbootstrap.com/docs/jquery/tables/editable/#! 
// TODO Data validation!!!!
/**
 * - is this column name already being used? 
 * - do the beds overlap? 
 * - does the sum of the bed widths = the top of the final bed? (doesn't need to, but good check)
 */
function getCol() {
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

        bed["bed_start"] = $num.eq(0).val(); 
        bed["bed_end"] = $num.eq(1).val(); 
        bed["grain_size"] = $select.eq(0).val(); 
        bed["features"] = $select.eq(1).val(); 
        bed["lithology"] = $select.eq(2).val(); 
        bed["column_id"] = newCol.column_id;

        data.push(bed);
    });
    newCol.beds = data;

    // GET LITHOLOGIES 
    const liths = $(".lith-name").map(function() {
        return $(this).text();
    }).get();
    newCol.lithologies = liths; 

    // GET CHEMICAL DATA 
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

    return newCol; 
}

function saveColumn() {
    const newCol = getCol(); 
    
    post('/api/column', newCol, function(){
        console.log("column sent to server")
        window.location.href = "/" // go home
    }, function(){
        // TODO: get message from backend, inform user that save failed 
        console.log('Save failed')
        //window.location.href = "/" // go home
    }); 
}

function exportCsv() {
    
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

function addChemRow(){
    console.log(height);
    $(this).parents('.card').find('table').append(
    '<tr class="d-flex data-row">'+
        '<td class="col-5 chem-height number" contenteditable="true">0.0' +
        '</td><td class="col-5 chem-value number" contenteditable="true">0.0'  +
        '</td><td class="col-2"><button type="button" class="table-remove btn btn-outline-danger btn-sm my-0">'+
        '<em class="fas fa-trash-alt"></em></button></td></tr>');
    
        // Need to initialize click funciton for new table-remove button
    // $('.table-remove').click(function () {
    //     $(this).parents('tr').detach();
    // });
}

function onNewChem(chemtype) {
    $('#chem-dats').append('<div class="card data-card chemdata">'+
        '<div class="card-header">'+ chemtype +
        '</div><div class="card-body">'+
        '<table class="table table-bordered table-sm table-responsive-md text-center">'+
        '<tr class="d-flex"><th class="col-5">Height</th><th class="col-5">Value</th>'+
        '<th class="col-2"><em class="fas fa-trash-alt"></em></th></tr></table>'+
        '<span class="float-right">'+
        '<button class="btn btn-outline-secondary add-chem-row">Add row</button>'+
        '</span></div></div>')

    // Find chemical data option and remove from selector 
    $('#option-'+chemtype).remove()
    $('#chem-select').selectpicker('refresh');
    $("#chem-add").attr('disabled', 'true');
}

// Add a lithology. Add new lith object to list, Update lithology dropdowns 
function addLith(newLith){
    $('#lithologies').append('<li class="list-group-item"><span class="lith-name">'+newLith+
    '</span><button type="button" class="lith-remove btn float-right btn-outline-danger btn-sm my-0">' +
    '<em class="fas fa-trash-alt"></em></button></li>');
    $('.lith-remove').on('click', function() {
        const lithID = $(this).parent('li').find('.lith-name').text().trim();
        // remove from list of lithologies 
        $(this).parent('li').remove();
        // de-select this lithology 
        $('tr').not('.hide').find('select.lith-select[value="'+lithID+'"]').val([])
        // remove from dropdown 
        $('.lith-select').find('[value="'+lithID+'"]').remove();
        $('tr').not(".hide").find('.lith-select').selectpicker('refresh'); 
    });
    
    // update dropdowns
    //const lithID = $("#lith-input").val().trim();
    $('select.lith-select').append("<option value='" + newLith + "'>"+newLith+"</option>");
    // refresh dropdowns in non-hidden rows
    $('tr').not(".hide").find('.lith-select').selectpicker('refresh'); 
}


// If an existing column is specified, load its beds and chemical data
function loadData(column_id) {
    if (column_id.length == 0){
        return false; 
    }
    // loading spinners 
    $('#show-beds').attr("disabled", true);
    $('#show-beds').text("Loading beds...");
    $('#show-chem').attr("disabled", true);
    $('#show-chem').text("Loading chem data...", true);
    //TODO: figure out why I can't get a spinner here (see https://getbootstrap.com/docs/4.3/components/spinners/ )
    //$('#show-beds').append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
    get('/api/column', {column_id: column_id }, function(columns){
        // Set formation, description 
        const column = columns[0];
        $('#formation-name').val(column.formation); 
        $('#column-name').val(column.column_id); 
        $('#description').val(column.description);

        for (var i=0; i<column.lithologies.length; i++){
            const lithID = column.lithologies[i];
            addLith(lithID);
        }

        // Beds have to happen after we load lithologies 
        get('/api/beds', {column_id: column_id }, function (data) {
            // data is a list of beds. sort by bed start
            data.sort(function(a,b){return a.bed_start - b.bed_start;})
            // This is the same code used to add a row to the table. TODO: refactor to a function for both
            // TODO: maybe a more efficient way to add many rows; this is slow
            for (var i=0; i<data.length; i++){
                var $TABLE = $('#table');
                var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide d-none');
                $clone.find('select').selectpicker(); // turn a normal select into searchable, multiselect
                $clone.addClass("d-flex")
                $TABLE.find('table').append($clone); 

                var $num = $clone.find('.number');
                var $select = $clone.find('select');

                $num.eq(0).val(data[i].bed_start); 
                $num.eq(1).val(data[i].bed_end); 
                $select.eq(0).val(data[i].grain_size).change(); 
                $select.eq(1).val(data[i].features).change(); 
                $select.eq(2).val(data[i].lithology).change();
            }
            // loading complete
            $('#show-beds').removeAttr("disabled");
            $('#show-beds').text("Show beds")
        }); 
    }); 

    // TODO load chem data 
    get('/api/chem', {column_id: column_id}, function(chemData){
        for (var i=0; i<chemData.length; i++){
            var chemtype = chemData[i].data_type;
            onNewChem(chemtype);
            for (var j=0; j<chemData[i].data.length; j++){
                $('.card-header:contains("'+chemtype+'")').parents('.card').find('table').append(
                    '<tr class="d-flex data-row">'+
                        '<td class="col-5 chem-height number" contenteditable="true">' + chemData[i].data[j].depth +
                        '</td><td class="col-5 chem-value number" contenteditable="true">'  + chemData[i].data[j].value +
                        '</td><td class="col-2"><button type="button" class="table-remove btn btn-outline-danger btn-sm my-0">'+
                        '<em class="fas fa-trash-alt"></em></button></td></tr>');
            }
        }
        $('#show-chem').removeAttr("disabled");
        $('#show-chem').text("Show chemical data")
    });  

    return true; 

}

// Initialize data 
getFeatureOptions(); // Initialize dropdowns 
tableSetUp(); // Initializes buttons for beds table only 
const column_id = decodeURI(window.location.search.substring(1));
const edited = loadData(column_id); // returns boolean 

// Set up event listeners 
document.getElementById("chem-add").addEventListener('click', function(){
    var chemtype = $("#chem-select").val()
    onNewChem(chemtype);
});

document.getElementById("save-col").addEventListener('click', saveColumn);

document.getElementById("add-lith").addEventListener('click', function(){
    const newLith = $("#lith-input").val().trim(); 
    addLith(newLith);
    // clear data entry
    $('#lith-input').val('');
}); 

$('#export').on('click', exportCsv);

// Set up button for adding row 
$('#chem-dats').on('click','.add-chem-row', addChemRow);

// All table rows with a remove button... 
$('.container-fluid').on('click', '.table-remove', function () {
    $(this).parents('tr').detach();
});

// Button to add chemical data should be dissabled until something is selected
$( "#chem-select" ).change(function() {
    $("#chem-add").removeAttr('disabled');
});