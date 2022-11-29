margin = ({top: 10, right: 20, bottom: 50, left: 105});
visWidth = 300;
visHeight = 300;
color = d3.scaleOrdinal().domain('lighting_condition').range(d3.schemeCategory10);
highlight_color = "#66FF22";



function barChart(data, col, title, divelement) {
  // set up

  data.sort(function(b, a){
    return b[col] - a[col];
  });
  
  // const margin = {top: 10, right: 20, bottom: 50, left: 200};
  
  // const visWidth = 300;
  // const visHeight = 200;
  
  console.log("barChart() call made!!!!!!!!!!");  
  // const data1 = Array.from(d3.flatGroup(crashData, d=>d.month), ([key, value]) => ({key, value}))

  const svg = d3.select("#"+divelement)
  .append('svg')
  .style('width', '100%')
  .style('height', '100%')
  // .attr('transform', `translate(${margin.left}, ${margin.top})`)
  // .property('value', initialValue);

  const g = svg.append("g")
      .attr("transform", `translate(${margin.left+55}, ${margin.top+70})`);
  
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
      .attr("transform", `translate(0, ${visWidth})`);
  
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
      // .call(g => g.select(".domain").remove());
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
    // const colors = d3.scaleOrdinal().domain(colDomain).range(d3.schemeCategory10);
    
    // draw bars
    barsGroup.selectAll("rect")
      .data(originCounts)
      .join("rect")
        .attr("fill", ([col, count]) => color(col))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("y", ([col, count]) => y(col))
      .transition(t)
        .attr("width", ([col, count]) => x(count))


  }
  console.log("barChart() call over!!!!!!");
  return Object.assign(svg.node(), { update });
}

function interactivePlot(data){
  const scatter = brushableScatterplot(crashData,"staticbar");
  // const bar = barchartI(data, "staticbar");
  const bar1 = barChart(data,'INJURY_CLASSIFICATION', 'Injury Severity', "hbar1");
  const bar2 = barChart(data, 'DAMAGE', 'Damage Cost', "hbar2");
  const bar3 = barChart(data, 'SEX','Gender', "hbar3");

  // update the bar chart when the scatterplot
  // selection changes
  d3.select(scatter).on('click', () => {
    bar1.update(scatter.value);
    bar2.update(scatter.value);
    bar3.update(scatter.value);
  });

  // intial state of bar chart
  bar1.update(scatter.value);
  bar2.update(scatter.value);
  bar3.update(scatter.value);

  scatter;
  bar1;
  bar2;
  bar3;
  // use HTML to place the two charts next to each other
  // return html`<div style="display: flex">${bar}<br>${bar1}</div><div><br></div><div style="display: flex">${bar2}${bar3}</div>`;
}

function brushableScatterplot(crashData, divelement) {
  // set up

  // the value for when there is no brush
  x = d3.scaleLinear()
      .domain(d3.extent(crashData, crashData.CRASH_HOUR)).nice()
      .range([0, visHeight]);

  y = d3.scaleLinear()
        .domain(d3.extent(crashData, crashData.AGE)).nice()
        .range([visWidth, 0])

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

  const initialValue = crashData;

  const svg = d3.select("#"+divelement)
      .append('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom+100)
      .property('value', initialValue);

  const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top+100})`);
  
  // axes
  // g.append("g").call(xAxis, x, 'Hour of Day');
  // g.append("g").call(yAxis, y, 'Age');

  var x = d3.scaleLinear()
    .domain([0, 24])
    .range([ 0, 300 ]);
  // g.append("g")
  //   .attr("transform", "translate(0," + 400 + ")")
  //   .call(d3.axisBottom(x));

  var y = d3.scaleLinear()
    .domain(d3.extent([0, 100]))
    .range([ 300, 0]);
  g.append("g")
    .call(d3.axisLeft(y));

  // var x = d3.scaleBand()
  //   .range([0, 300])
  //   .domain([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);

  // var y = d3.scaleLinear()
  //   .domain(d3.extent([0, 100]))
  //   .range([300, 0]);

  // g.append("g")
  //   .call(d3.axisLeft(y));

  g.append("g")
    .attr("transform", "translate(0,"+visHeight+")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-15)")
    .style("text-anchor","end");

  g.append('text')
    .text("Age v/s Time of Crash")
    .attr('x', visWidth/2)
    .attr('y', 0-margin.top-30) 
    .attr("font-family" , "sans-serif")
    .attr("font-size" , "14px")
    .attr("fill" , "black")
    .attr("text-anchor", "middle")

  
  // draw points
  
  const radius = 3;
  
  const dots = g.selectAll('dot')
    .data(crashData)
    .enter()
    .append('circle')
      .attr('cx', x(crashData.TIME/60))
      .attr('cy', y(crashData.AGE))
      .attr('fill', color(crashData.MOST_SEVERE_INJURY))
      // .attr('opacity', 1)
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
      const cx = x(d.TIME)/60;
      const cy = y(d.AGE)
      return cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2;
    } 
    
    // style the dots
    dots.attr('fill', d => isBrushed(d) ? color(d.MOST_SEVERE_INJURY) : 'gray');
    
    // update the data that appears in the cars variable
    svg.property('value', crashData.filter(isBrushed)).dispatch('input');
  }
  
  function onEnd(event) {
    // if the brush is cleared
    if (event.selection === null) {
      // reset the color of all of the dots
      dots.attr('fill', d => color(d.MOST_SEVERE_INJURY));
      svg.property('value', initialValue).dispatch('input');
    }
  }

  return svg.node();
}

function init() {
  interactivePlot(crashData);
}
window.onload = init;