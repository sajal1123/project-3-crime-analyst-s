margin = ({top: 10, right: 20, bottom: 50, left: 105});
visWidth = 250;
visHeight = 250;
color = d3.scaleOrdinal().domain('lighting_condition').range(d3.schemeCategory10);
highlight_color = "#66FF22";





function find_scale(col) {
    const data = Array.from(d3.flatGroup(crashData, d=>d[col]), ([key, value]) => ({key, value}))
    return d3.extent(data, d=>d.value)[1].length
    
}

function barchart1(data_original, col, y_scale, title, divelement) {
    // set up
    const data1 = Array.from(d3.flatGroup(data_original, d=>d[col]), ([key, value]) => ({key, value}))
    
    const svg = d3.select("#"+divelement)
        .append('svg')
        .attr('width', visWidth + margin.left + margin.right+100)
        .attr('height', visHeight + margin.top + margin.bottom+100);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top+100})`);

    const data = data1.sort(function(b, a){
    return d3.ascending(b.key, a.key);
    });

    var x = d3.scaleBand()
    .range([0, visWidth])
    .domain(data.map(d=>d.key)).padding(0.2);

    var y = d3.scaleLinear()
    .domain(d3.extent([0, y_scale]))
    .range([visHeight, 0]);
    g.append("g")
    .call(d3.axisLeft(y));

    g.append("g")
    .attr("transform", "translate(0,"+visHeight+")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-15)")
    .style("text-anchor","end");

    const t = svg.transition()
    .ease(d3.easeLinear)
    .duration(500)

    var box = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

    var u = g.selectAll('rect')
    .data(data)
    .join("rect")
    .attr("x", function(d) {return x(d.key)})
    .attr("y", function(d) {return y(d.value.length)})
    .attr("width", x.bandwidth())
    .attr('title', title);

    g
    .append('text')
    .text(title)
    .attr('x', visWidth/2)
    .attr('y', 0-margin.top-30) 
    .attr("font-family" , "sans-serif")
    .attr("font-size" , "14px")
    .attr("fill" , "black")
    .attr("text-anchor", "middle")
    .append('text')
    .text('Count')
    .attr('x', 10)
    .attr('y', visHeight/2)
    .attr("font-family" , "sans-serif")
    .attr("font-size" , "10px")
    .attr("fill" , "black")
    .attr("text-anchor", "middle")
    

    u
    .attr("height", function(d) {return visHeight - y(d.value.length)})
    .attr("fill", "#dd2266")
    .transition(t)
    .duration(500)    
    
    function update(dat) {
    
    var u = g.selectAll('rect')
    .data(dat)
    .join("rect")
        .attr("x", function(d) {return x(d.key)})
    .attr("y", function(d) {return y(d.value.length)})
    .attr("width", x.bandwidth())
        .attr('title', title);

    g
    .append('text')
    .text(title)
    .attr('x', visWidth/2)
    .attr('y', 0-margin.top-30) 
    .attr("font-family" , "sans-serif")
    .attr("font-size" , "14px")
    .attr("fill" , "black")
    .attr("text-anchor", "middle")
    
    g
    .append('text')
    .text('Count')
    .attr('x', -60)
    .attr('y', visHeight/2)
    .attr("font-family" , "sans-serif")
    .attr("font-size" , "10px")
    .attr("fill" , "black")
    .attr("text-anchor", "middle")
    

    u
        .transition(t)
        .duration(500)
    .attr("height", function(d) {return visHeight - y(d.value.length)})
    .attr("fill", "#dd2266");

    }

    function hoverOff() {
        d3.select(this).transition()
            .duration('50')
            .attr('opacity', '1.0')
        d3.select(status).text("");
    }
    update(data);
    return svg.node();
}