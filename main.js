
margin = ({top: 10, right: 20, bottom: 50, left: 105});
visWidth = 500;
visHeight = 500;
color = d3.scaleOrdinal().domain('lighting_condition').range(d3.schemeCategory10);
// y = d3.scaleLinear()
//       .domain(d3.extent(crashData, d => d.age)).nice()
//       .range([visWidth, 0]);
// x = d3.scaleLinear()
// .domain(d3.extent(crashData, d=>d.hour)).nice()
// .range([0, visHeight])

xAxis = (g, scale, label) =>
  g.attr('transform', `translate(0, ${visHeight})`)
      // add axis
      .call(d3.axisBottom(scale))
      // remove baseline
      .call(g => g.select('.domain').remove())
      // add grid lines
      // references https://observablehq.com/@d3/connected-scatterplot
      .call(g => g.selectAll('.tick line')
        .clone()
          .attr('stroke', '#d3d3d3')
          .attr('y1', -visHeight)
          .attr('y2', 0))
    // add label
    .append('text')
      .attr('x', visWidth / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .text(label)

      yAxis = (g, scale, label) => 
      // add axis
      g.call(d3.axisLeft(scale))
          // remove baseline
          .call(g => g.select('.domain').remove())
          // add grid lines
          // refernces https://observablehq.com/@d3/connected-scatterplot
          .call(g => g.selectAll('.tick line')
            .clone()
              .attr('stroke', '#d3d3d3')
              .attr('x1', 0)
              .attr('x2', visWidth))
        // add label
        .append('text')
          .attr('x', -40)
          .attr('y', visHeight / 2)
          .attr('fill', 'black')
          .attr('dominant-baseline', 'middle')
          .text(label)

  // const data = Array.from(d3.flatGroup(data_original, d=>d[col]), ([key, value]) => ({key, value}))

  function find_scale(col) {
    const data = Array.from(d3.flatGroup(crashData, d=>d[col]), ([key, value]) => ({key, value}))
    return d3.extent(data, d=>d.value)[1].length
    
  }


function createBarChart(obj, col, y_scale, titl, divelement) {

  const tooltip = d3.select("#tooltip");

    const data = obj.sort(function(b, a){
      return d3.ascending(b.index - a.index)
    })
    var barChart = d3.selectAll('#'+divelement).append('svg').style('width', '100%').style('height', '100%').attr('transform', `translate(${margin.left}, ${margin.top})`);
    // var width = 25;
    // var height = 15;
    console.log("DATA",data);
    console.log("INDEX", data[0]['index']);
    // console.log("YSCALE = ", y_scale);
    var g = barChart.selectAll('#'+divelement)
        .data(obj)
        .enter()
        .append('g')
        // .attr('class', 'bar')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    var y = d3.scaleLinear()
              .domain(d3.extent([0, y_scale]))
              .range([visHeight, 0]);
    // console.log(data[0], y(data[0]['CITY']));
    // console.log(data[1], y(data[1]['CITY']));
    // console.log(data[3], y(data[3]['CITY']));
    g.append("g")
    .call(d3.axisLeft(y));

    var x = d3.scaleBand().range([0, visWidth])
              .domain(data.map(d=>d['index']))
              .padding(0.2);

    // var y = d3.scaleLinear().domain([1,300]).range([0,300]);
    // console.log(y);

    g.append("g")
    .attr("transform", "translate(0,"+visHeight+")")
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('text-anchor', 'end')
    .attr("transform", "rotate(-45)");
// .attr("transform", "rotate(-45)");
    
    g.append('rect')
        .style('stroke-width', '1')
        .style('stroke', 'rgb(0,0,0)')
        .style('fill', 'rgb(0,200,100)')
        .attr('y', function (d) { return y(d.CITY); })
        .attr('x', (d,i) => {return 11+(visHeight-459)*i})
        .attr('height', (d,i) => {return 500 - y(d['CITY'])})
        .attr('width', x.bandwidth()-3)
        .attr('id', (d,i) => {return d['index']})
        // .attr("title", "Crashes per month");

    g.append('text')
        .attr('y', 0)
        .attr('x', visWidth/2-50)
        .text(titl);
      
    g.selectAll('.axes')
    .attr("transform", "rotate(-45)");

    d3.selectAll("rect")
    .on('mouseenter', hoverOn)
    .on('mouseleave', hoverOff);

    function hoverOn(d, i) {
      tooltip.style("opacity", 1)
      tooltip.select("#range")
      .text("HELLO",d, i);

    }

    function hoverOff(d) {
      tooltip.style("opacity", 0);
    }

    const t = barChart.transition()
    .ease(d3.easeLinear)
    .duration(500)
    d3.selectAll('rect')
    .on('mouseover', () => {
      d3.select(this).transition()
      .duration('50')
      .style('opacity', 0.7)
    })

    function update(d) { 
      var u = g.selectAll('rect')
      .data(d)
      .join("rect")
      .attr("x", function (d) { return x(d.index); })
      .attr("y", function (d) { return y(d.CITY); })
      .attr("width", x.bandwidth()-3)
      .attr("height", (d, i)=> {return 500 - y(d['CITY'])})

      g.append('text')
      .text(titl)
      .attr('x', visWidth/2-50)
      .attr('y', 0)

      u.transition(t)
      .duration('500')
      .attr('height', function(d){return 500 - y(d['CITY'])})
      .attr('fill', 'rgb(0,200,100)');

      d3.selectAll('rect')
      .on('mouseover', (d) => {
        d3.select('rect').transition()
        .duration(50)
        .attr('opacity', 0.70)
      })
     }
     update(data);


    // console.log(rawData['features'][0]['AGE']);
}

function createMap() {

    var map = L.map('map').setView([37.8, -96], 4);

    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    function style(feature) {
        var colorScale = d3.scaleQuantize()
            .range(colorbrewer.YlOrRd[9])
            .domain([0, 1000]);
        return {
            fillColor: colorScale(feature.properties.density),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }
    
    function highlightFeature(e) {
        var layer = e.target;
    
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        
        var selectedState = layer.feature.properties.name.substring(0, 9);
        d3.selectAll("#"+selectedState).style('fill', 'rgb(120,50,50)')
    
        layer.bringToFront();
    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        d3.selectAll("rect").style('fill', 'rgb(200,200,200)')
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
        
    }

    var geojson = L.geoJson(statesData, {style: style, onEachFeature: onEachFeature}).addTo(map);

}

function barchart1(data_original, col, y_scale, title) {
    // set up
    const data1 = Array.from(d3.flatGroup(data_original, d=>d[col]), ([key, value]) => ({key, value}))
    const data = data1.sort(function(b, a){
        return d3.ascending(b.key, a.key);
      });
    
    var barChart = d3.selectAll('#plot').append('svg').style('width', '100%').style('height', '100%');
    var g = barChart.selectAll('.bar')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'bar')
                .attr('transform', `translate(${margin.left}, ${margin.bottom})`);
    // const g = svg.append('g')
    //     .attr('transform', `translate(${margin.left}, ${margin.top+100})`);
    
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
  
    
    // g.selectAll('rect')
    // .data(data.filter(d=>d.MOST_SEVERE_INJURY))
    // .join("rect")
    // .attr("x", function(d) {return x(d.MOST_SEVERE_INJURY)})
    // .attr("y", data => y(data.COUNTS))
    // .attr("width", x.bandwidth())
    // .attr("height", data => visHeight - y(data.COUNTS))
    // .attr("fill", "#991111")
    // .attr("opacity", 1)
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
  
      //   u
      //   .on('mouseover', hoverOn)
      //   .on('mouseout', hoverOff);
  
      // function hoverOn(d) {
      //     d3.select(this).transition()
      //       .duration('50')
      //       .attr('opacity', '0.85');
      //     box.transition()
      //       .duration(100)
      //       .style('opacity', '1');
      //     box.html(d.value)
      //       .style("top", (visHeight/2) + "px")
      //       .style("left", (visWidth/2) + "px")
      //       .style("visibility", "visible")
      //       // box.color('black')}
      // }
  
      // function hoverOff() {
      //     d3.select(this).transition()
      //       .duration('50')
      //       .attr('opacity', '1.0')
      //       box.transition()
      //           .duration(100)
      //           .style('opacity', '0')}
      
    
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
  
      // function hoverOn(d) {
      //     d3.select(this).transition()
      //       .duration('50')
      //       .attr('opacity', '0.85')
        
  //           .append('text')
  //           .text("SKJSFNBKJFS")
  //                 .attr('x', visWidth-20)
  //       .attr('y', visHeight-20)
  // ;
          // box.transition()
          //   .duration(100)
          //   .style('opacity', '1');
      //     g.append('text')
      //   .text(d.value)
      //   .attr('x', visWidth-20)
      //   .attr('y', visHeight-20)
      // .attr("font-family" , "sans-serif")
      // .attr("font-size" , "10px")
      // .attr("fill" , "black")
      // .attr("text-anchor", "middle")
        
        // box.html(d.value)
        //     .style("top", (visHeight/2) + "px")
        //     .style("left", (visWidth/2) + "px")
        //     .style("visibility", "visible")
            // box.color('black')}
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

function barChart(data, col, title) {
// set up

data.sort(function(b, a){
    return b[col] - a[col];
});

const margin = {top: 10, right: 20, bottom: 50, left: 200};

const visWidth = 300;
const visHeight = 200;

const svg = d3.create('svg')
    .attr('width', visWidth + margin.left + margin.right)
    .attr('height', visHeight + margin.top + margin.bottom+100);

const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top+100})`);

// create scales

const x = d3.scaleLinear()
    .range([0, visWidth]);

const y = d3.scaleBand()
    .domain(d3.map(data, d=>d[col]))
    .range([0, visHeight])
    .padding(0.2);

// create and add axes

const xAxis = d3.axisBottom(x).tickSizeOuter(0);

const xAxisGroup = g.append("g")
    .attr("transform", `translate(0, ${visHeight})`);

xAxisGroup.append("text")
    .attr("x", visWidth / 2)
    .attr("y", 40)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Count");

const yAxis = d3.axisLeft(y);

const yAxisGroup = g.append("g")
    .call(yAxis)
    // remove baseline from the axis
    .call(g => g.select(".domain").remove());
        g
    .append('text')
    .text(title)
    .attr('x', visWidth/2)
    .attr('y', 0-margin.top-30) 
    .attr("fill" , "black")
    .attr("text-anchor", "middle")

    
let barsGroup = g.append("g");

function update(data) {
    
    // get the number of cars for each origin
    const originCounts = d3.rollup(
    data,
    group => group.length,
    d => d[col]
    );

    // update x scale
    x.domain([0, d3.max(originCounts.values())]).nice()

    // update x axis

    const t = svg.transition()
        .ease(d3.easeLinear)
        .duration(200);

    xAxisGroup
    .transition(t)
    .call(xAxis);

    // injury = Array.from(new Set(crashData.map(d=>d.injury_class)));
    // color = d3.scaleOrdinal().domain('injury').range(d3.schemeCategory10);
    
    const colDomain = Array.from(new Set(data.map(d=>d.col)))
    const colors = d3.scaleOrdinal().domain(colDomain).range(d3.schemeCategory10);
    
    // draw bars
    barsGroup.selectAll("rect")
    .data(originCounts)
    .join("rect")
        .attr("fill", ([col, count]) => colors(col))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("y", ([col, count]) => y(col))
    .transition(t)
        .attr("width", ([col, count]) => x(count))


}

return Object.assign(svg.node(), { update });;
}

function brushableScatterplot() {
    // set up
  
    // the value for when there is no brush
    const initialValue = rawData;
  
    const svg = d3.create('svg')
        .attr('width', visWidth + margin.left + margin.right)
        .attr('height', visHeight + margin.top + margin.bottom+100)
        .property('value', initialValue);
  
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top+100})`);
    
    // axes
    g.append("g").call(xAxis, x, 'Hour of Day');
    g.append("g").call(yAxis, y, 'Age');
  
        g
      .append('text')
      .text("Age v/s Time of Crash")
      .attr('x', visWidth/2)
      .attr('y', 0-margin.top-30) 
      .attr("font-family" , "sans-serif")
      .attr("font-size" , "14px")
      .attr("fill" , "black")
      .attr("text-anchor", "middle")
  
    
    // draw points
    
    const radius = 3;
    
    const dots = g.selectAll('circle')
      .data(rawData)
      .join('circle')
        .attr('cx', d => x(d.time)/60)
        .attr('cy', d => y(d.age))
        .attr('fill', d =>  color(d.injury_class))
        .attr('opacity', 1)
        .attr('r', radius);
    
    // ********** brushing here **********
    
    const brush = d3.brush()
        // set the space that the brush can take up
        .extent([[0, 0], [visWidth, visHeight]])
        // handle events
        .on('brush', onBrush)
        .on('end', onEnd);
    
    g.append('g')
        .call(brush);
  
    
    function onBrush(event) {
      // event.selection gives us the coordinates of the
      // top left and bottom right of the brush box
      const [[x1, y1], [x2, y2]] = event.selection;
      
      // return true if the dot is in the brush box, false otherwise
      function isBrushed(d) {
        const cx = x(d.time)/60;
        const cy = y(d.age)
        return cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2;
      } 
      
      // style the dots
      dots.attr('fill', d => isBrushed(d) ? color(d.injury_class) : 'gray');
      
      // update the data that appears in the cars variable
      svg.property('value', crashData.filter(isBrushed)).dispatch('input');
    }
    
    function onEnd(event) {
      // if the brush is cleared
      if (event.selection === null) {
        // reset the color of all of the dots
        dots.attr('fill', d => color(d.injury_class));
        svg.property('value', initialValue).dispatch('input');
      }
    }
  
    return svg.node();
  }

function scatterplot() {
// set up

const svg = d3.create('svg')
    .attr('width', visWidth + margin.left + margin.right)
    .attr('height', visHeight + margin.top + margin.bottom);

const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// axes
g.append("g").call(xAxis, x, 'Time');
g.append("g").call(yAxis, y, 'Age');

// draw points
g.selectAll('circle')
    // filter data to only contain selected car origins
    .data(crashData.filter(d => d.time))
    .join('circle')
    .attr('cx', d => x(d.time)/60)
    .attr('cy', d => y(d.age))
    .attr('fill', d =>  color(d.injury_class))
    .attr('opacity', 1)
    .attr('r', 3);

return svg.node();
}

  // const data = Array.from(d3.flatGroup(data_original, d=>d[col]), ([key, value]) => ({key, value}))

  function find_scale(col) {
    const data = Array.from(d3.flatGroup(crashData, d=>d[col]), ([key, value]) => ({key, value}))
    return d3.extent(data, d=>d.value)[1].length
    
  }


function init(){
    // createMap();
  //   var lines = x.split(/\n/);
  // var wrapped = "[" + lines.join(",") + "]";
  // var obj = JSON.parse(wrapped);

  // var groupby = function (a, k) {
  //   return a.reduce((acc, ob) => {
  //     const key = ob[k];
  //     if (!acc[k]){
  //       acc[k] = 1;
  //     }
  //     acc[k]+=1;
  //     return acc;
  //   }, {});
  //   }
  //   var by_month = JSON.parse(bym);

  var months = bym.split(/j/);
  var rapped = "[" + months.join(",") + "]";
  var month_obj = JSON.parse(rapped);
  // console.log("months obj",month_obj);
  // console.log("months",months);
    // by_month = groupby(obj, [0,1,2,3,4,5,6,7,8,9,10,11]);
  a = createBarChart(month_obj, 'month', 300, "Crashes per Month", 'staticbar');

  var wall = weather_all.split(/\n/);
  var wall2 = "[" + wall.join(",")+"]";
  console.log("WALL = ", wall);
  console.log("Wall2 = ", wall2);
  var wallobj = JSON.parse(wall2);

  b = createBarChart(wallobj, 'month', 2050, "Weather Conditions - All Year", 'plot');

  d3.selectAll('rect')
  .on('click', () => createBarChart(month_obj, 'month', 300, "Crashes Per Month", 'plot'));

  // createBarChart(obj);
  // scatterplot();
    // brushableScatterplot();
    // createBarChart();
}

window.onload = init;