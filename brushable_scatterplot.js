margin = ({top: 10, right: 20, bottom: 50, left: 105});
visWidth = 500;
visHeight = 500;
color = d3.scaleOrdinal().domain('lighting_condition').range(d3.schemeCategory10);
highlight_color = "#66FF22";

function brushableScatterplot(data, divelement) {
    // set up
  
    // the value for when there is no brush
    const initialValue = data;
  
    const svg = d3.select("#"+divelement)
    .append('svg')
    .style("width", "100%")
    .style("height", "100%")
    .property("value", initialValue);

    // create('svg')
    //   .attr('width', visWidth + margin.left + margin.right)
    //   .attr('height', visHeight + margin.top + margin.bottom+100)
    //   .property('value', initialValue);
  
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top+100})`);
  
    // axes
    x = d3.scaleLinear()
      .domain(d3.extent(data, d=>d.CRASH_HOUR)).nice()
      .range([0, visHeight])

    y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.AGE)).nice()
      .range([visWidth, 0])

    g.append("g")
    .call(d3.axisLeft(y))

    g.append("g")
    .call(d3.axisBottom(x))

    // g.append("g").call(xAxis, x, 'Hour of Day');
    // g.append("g").call(yAxis, y, 'Age');
  
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
      .data(data)
      .join('circle')
      .attr('cx', d => x(d.TIME)/60)
      .attr('cy', d => y(d.AGE))
      .attr('fill', d =>  color(d.INJURY_CLASSIFICATION))
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
        const cx = x(d.TIME)/60;
        const cy = y(d.AGE)
        return cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2;
      } 
  
      // style the dots
      dots.attr('fill', d => isBrushed(d) ? color(d.INJURY_CLASSIFICATION) : 'gray');
      // update the data that appears in the cars variable
      svg.property('value', data.filter(isBrushed)).dispatch('input');
    }
  
    function onEnd(event) {
      // if the brush is cleared
      if (event.selection === null) {
        // reset the color of all of the dots
        dots.attr('fill', d => color(d.INJURY_CLASSIFICATION));
        svg.property('value', initialValue).dispatch('input');
      }
    }
  
    return svg.node();
  }

function init() { 
    brushableScatterplot(cc, "scatter");
 }

window.onload = init