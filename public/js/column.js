// Modeled off https://bost.ocks.org/mike/bar/ (posts 1, 2, and 3)
// Tooltips modeled off http://bl.ocks.org/Caged/6476579 
function bars(column_id) {

    var margin = {top: 20, right: 30, bottom: 30, left: 60},
        width = 300 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var y = d3.scale.linear()
        .range([0, height]);

    var x = d3.scale.linear()
        .range([0, width]);

    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>Features:</strong> <span style='color:red'>" + d.features + "</span>";
        })
        .direction('e')
        .offset([0, 7]);

    var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

    d3.select('svg').call(tip);

    get('/api/beds', { column_id: column_id }, function (data) {
    get('/api/grain', {}, function(grain){
        // Map from grain name to size 
        var grainMap = new Map(); 
        grain.forEach(element => {
            grainMap.set(element.grain_size_id, +element.size_class);
        });

        y.domain([d3.max(data, function (d) { return d.bed_end; }), 0]);
        x.domain([0, d3.max(grain, function(g) { return g.size_class;})]);

        console.log(data);
        console.log(y(0));
        console.log(y(2)); 
        console.log(y(5));

        chart.append("g")
            .attr("class", "axis")
            .call(yAxis);

        var bar = chart.selectAll(".bar")
            .data(data)
            .enter().append("g")
            .attr("transform", function (d, i) { return "translate(0," + (y(d.bed_end)) + ")"; });

        bar.append("rect")
            .attr("width", function (d) {return x(grainMap.get(d.grain_size)); })
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

        bar.append("text")
            .attr("x", function (d) { return x(grainMap.get(d.grain_size)) - 3; })
            .attr("y",  function(d) {return (y(d.bed_start) - y(d.bed_end))/2})
            .attr("dy", ".35em")
            .text(function (d) { return d.bed_start; });
    })});
}

// Given a bed d, return class name 
function featureStyling(d) {

}

const column_id = decodeURI(window.location.search.substring(1));
bars(column_id);