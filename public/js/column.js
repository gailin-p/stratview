// TODO size svgs based on surrounding div, not absolute 

// constants for sizing SVG 
margin = {top: 20, right: 30, bottom: 80, left: 30},
        width = 300 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom,
        chemWidth = 600 - margin.left - margin.right;

// Strat column modeled off https://bost.ocks.org/mike/bar/ (posts 1, 2, and 3)
// Scatter plot modeled off https://beta.observablehq.com/@mbostock/d3-scatterplot 
// Tooltips modeled off http://bl.ocks.org/Caged/6476579 
function bars(column_id) {

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
    get('/api/chem', {column_id: column_id}, function(chemData){
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
            .attr("class", featureStyling)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        for (c =0; c<chemData.length; c++){
            chemDataPlot(chemData[c], y, chemWidth/chemData.length);
        }

    })})}); // close all those data gets 
}

// Plot a single chemical data 
// Params: one chemical data object, and the d3 scale for the y (bed depth) axis
function chemDataPlot(chemData, y, width){

    var chem = d3.select(".chem").append("svg") // TODO figure out what to select here  
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xChem = d3.scale.linear()
        .range([0, width])
        .domain([d3.min(chemData.data, function(c) {return c.value}),
            d3.max(chemData.data, function(c) {return c.value})]);

    var xAxis = d3.svg.axis()
        .scale(xChem)
        .orient("bottom")
        .ticks(3);

    chem.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
            .attr("transform", "translate("+ width/2 + "," + 15 + ")")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(chemData.data_type);;

    var dots = chem.selectAll("circle")
        .data(chemData.data)
        .enter().append("circle")
        .attr("cx", d => xChem(d.value))
        .attr("cy", d => y(d.depth))
        .attr("r", 2)
        .attr("class", "chem-data-pt");
}

// Given a bed d, return class name 
function featureStyling(d) {
    // TODO different styling for different features  
    if ($.inArray('siltstone', d.features) >= 0) {
        return "silt"
    }
    if ($.inArray('sandstone', d.features) >= 0) {
        return "sand"
    }
    if ($.inArray('dolomite', d.features) >= 0) {
        return "dolomite"
    }
    if ($.inArray('shale', d.features) >= 0) {
        return "shale"
    }
    return 'none';
}

// Add svg for one item in key. 
function color_key_item(chart, style, name, num){
    chart.append("rect")
        .attr("class",style)
        .attr("width", 10)
        .attr("height", 10)
        .attr("y", (num*13));
    chart.append("text")
        .attr("dy", ".71em")
        .text(name)
        .style("text-anchor", "start")
        .attr("x",13)
        .attr("y", (num*13));
}

// Below the stratigraphic column, add a key for the bar colors 
function color_key() {
    var chart = d3.select(".chart")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + (height + 50) + ")");
        
    color_key_item(chart, "sand", "Sandstone", 0);
    color_key_item(chart, "shale", "Shale", 1);
    color_key_item(chart, "silt", "Siltstone", 2);
    color_key_item(chart, "dolomite", "Dolomite", 3);
}

const column_id = decodeURI(window.location.search.substring(1));
document.getElementById("column_name").innerHTML = column_id;
bars(column_id);
color_key(); 