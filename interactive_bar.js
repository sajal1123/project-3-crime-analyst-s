highlight_color = "#ffd700";
function barchartI(crashData, divelement){

  const initialValue = crashData;
  
  console.log("barChartI() call made!!!!!!!!!!");  
  
  const data1 = Array.from(d3.flatGroup(crashData, d=>d.CRASH_MONTH), ([key, value]) => ({key, value}))
  console.log("crashdata: " + crashData )
  const svg = d3.select("#"+divelement)
  .append('svg')
  .style('width', '100%')
  .style('height', '100%')
  // .attr('transform', `translate(${margin.left}, ${margin.top})`)
  .property('value', initialValue);
  

  // d3.create('svg')
  //   .attr('width', visWidth + margin.left + margin.right+100)
  //   .attr('height', visHeight + margin.top + margin.bottom+100)
  //   .property('value', initialValue);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left+35}, ${margin.top+100})`);

  const data = data1.sort(function(b, a){
    return d3.ascending(b.key, a.key);
  });

  var x = d3.scaleBand()
    .range([0, visWidth])
    .domain(data.map(d=>d.key)).padding(0.2);

  var y = d3.scaleLinear()
    .domain(d3.extent([0, 300]))
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
    .attr('title', 'Number of Crashes per Month');


  u
    .attr("height", function(d) {return visHeight - y(d.value.length)})
    .attr("fill", color(d => d.month))
    .transition(t)
    .duration(500)

  function update(dat) {

    var u = g.selectAll('rect')
      .data(dat)
      .join("rect")
      .attr("x", function(d) {return x(d.key)})
      .attr("y", function(d) {return y(d.value.length)})
      .attr("width", x.bandwidth())
      .attr('title', 'Number of Crashes per Month');

    g
      .append('text')
      .text('Number of Crashes per Month')
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
      .attr("fill","#dd2266");
  }

  u
    .on('click', function(actual, i){
      d3.select(this)
        .transition()
        .attr("fill", highlight_color)
        .transition()
        .attr("fill", "#dd2266");
      function isMonth(d){
        return d.month == i.key;
      }
      // barChart(crashData.filter(isMonth), "DAMAGE", "NEW", "hbar1");
      console.log(i.key+' - value: '+i.value.length+" HAS BEEN CLICKED");
      // const size = crashData.filter(d=> d.month == i.key);
      // console.log(size);
      const newData = i.value;
      svg.property('value', newData).dispatch('input');
    });

  update(data);
  console.log("barChartI() call complete!!!!!!!!!!");
  return svg.node();
}

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
  console.log("barChart() call over!!!!!!");
  return Object.assign(svg.node(), { update });
}

function interactivePlot(data){
  // const scatter = brushableScatterplot();
  const bar = barchartI(data, "staticbar");
  const bar1 = barChart(data,'INJURY_CLASSIFICATION', 'Injury Severity', "hbar1");
  const bar2 = barChart(data, 'DAMAGE', 'Damage Cost', "hbar2");
  const bar3 = barChart(data, 'SEX','Gender', "hbar3");

  // update the bar chart when the scatterplot
  // selection changes
  d3.select(bar).on('click', () => {
    bar1.update(bar.value);
    bar2.update(bar.value);
    bar3.update(bar.value);
  });

  // intial state of bar chart
  bar1.update(bar.value);
  bar2.update(bar.value);
  bar3.update(bar.value);

  bar;
  bar1;
  bar2;
  bar3;
  // use HTML to place the two charts next to each other
  // return html`<div style="display: flex">${bar}<br>${bar1}</div><div><br></div><div style="display: flex">${bar2}${bar3}</div>`;
}


function init() { 
  var crd = cc.split(/\n/);
  var crd2 = "["+crd.join(",")+"]";
  // console.log("CRASH DATA = ",crd);
  // console.log("CRASH DATA PROCESSED =", crd2);

  var cro = JSON.parse(crd2);
  // console.log("CRASH DATA FINAL = ", cro);
  const data1 = Array.from(d3.flatGroup(cro, d=>d.CRASH_MONTH), ([key, value]) => ({key, value}))

  console.log("GROUPED DATAAAAAesgdsgdgA = ", data1);

  console.log("CRO: " + cro);

  // console.log(barchartI(data1));

  // barChart(cro, 'INJURY_CLASSIFICATION', "Injury Types");

  interactivePlot(cro);

 }

 window.onload = init;