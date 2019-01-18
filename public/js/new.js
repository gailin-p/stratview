// Modeled off https://mdbootstrap.com/docs/jquery/tables/editable/#! 
function tableSetUp() {
    var $TABLE = $('#table');
    var $BTN = $('#export-btn');
    var $EXPORT = $('#export');

    $('#add-row').click(function () {
        var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide d-none');
        $clone.find('select').selectpicker(); // turn a normal select into searchable, multiselect
        $clone.addClass("d-flex")
        $TABLE.find('table').append($clone);
    });

    $('.table-remove').click(function () {
        $(this).parents('tr').detach();
    });

    // A few jQuery helpers for exporting only
    jQuery.fn.pop = [].pop;
    jQuery.fn.shift = [].shift;

    $BTN.click(function () {
        var $rows = $TABLE.find('tr:not(:hidden)');
        var headers = [];
        var data = [];

        // Get the headers (add special header logic here)
        $($rows.shift()).find('th:not(:empty)').each(function () {
            headers.push($(this).text().toLowerCase());
        });

        // Turn all existing rows into a loopable array
        $rows.each(function () {
            var $td = $(this).find('td');
            var h = {};

            // Use the headers from earlier to name our hash keys
            headers.forEach(function (header, i) {
                h[header] = $td.eq(i).text();
            });

            data.push(h);
        });

        // Output the result
        $EXPORT.text(JSON.stringify(data));
    });
}

function getFeatureOptions() {
    // add features to dropdown 
    const fSelect = document.getElementsByClassName("feature-select")[0]
    
    get('/api/feature', {}, function (features) {
        for (let i = 0; i < features.length; i++) {
            const featureElt = document.createElement('option'); 
            featureElt.innerHTML = features[i].feature_id;
            fSelect.appendChild(featureElt);
        }
    });
}

getFeatureOptions();
tableSetUp();