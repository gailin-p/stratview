// Modeled off https://bost.ocks.org/mike/bar/ (posts 1, 2, and 3)
// Tooltips modeled off http://bl.ocks.org/Caged/6476579 
function bars(column_id) {

    var margin = {top: 20, right: 30, bottom: 30, left: 30},
        width = 300 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var y = d3.scale.linear()
        .range([0, height]);

    var x = d3.scale.ordinal()
        .rangeRoundPoints([margin.left, width]); // This makes things with "0" size class show up

    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<h5>" + d.bed_start + "m to " + d.bed_end + "m \n</h5>" +
            "<span> Features: " + d.features + " " + d.grain_size + "</span>" ;
        })
        .direction('e')
        .offset([0, 7]);

    var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

    d3.select('svg').call(tip);

    get('/api/beds', { column_id: column_id }, function (data) {
    get('/api/grain', {}, function(grain){
        // Create discrete d3 scale for grain sizes 
        grain.sort(function (g1, g2) {return g1.size_class - g2.size_class}); 
        sorted_grains = grain.map(g => g.grain_size_id)
        x.domain(sorted_grains);

        y.domain([d3.max(data, function (d) { return d.bed_end; }), 0]);

        chart.append("g")
            .attr("class", "axis")
            .call(yAxis);

        chart.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        var bar = chart.selectAll("rect")
            .data(data)
            .enter().append("rect")
            .attr('y', function (d) { return y(d.bed_end); })
            .attr("width", function (d) {return x(d.grain_size); })
            .attr("height", function(d) {return y(d.bed_start) - y(d.bed_end)})
            .attr("class", function(d) {
                // TODO different styling for different features  
                if ($.inArray('non', d.features) >= 0) {
                    return "non"
                }
                return '';
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
    })});
}

// Given a bed d, return class name 
function featureStyling(d) {

}

const column_id = decodeURI(window.location.search.substring(1));
bars(column_id);