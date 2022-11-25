function createBarChart(crashData) {
    

    var barChart = d3.selectAll('#plot').append('svg').style('width', '100%').style('height', '100%');
    var width = 25;
    var height = 15;
    console.log(crashData);
    var g = barChart.selectAll('.bar')
        .data(crashData)
        .enter()
        .append('g')
        .attr('class', 'bar');
    
    var x = d3.scaleLinear().domain([1,100]).range([0,200]);
    // console.log(x(10));

    g.append('rect')
        .style('stroke-width', '1')
        .style('stroke', 'rgb(0,0,0)')
        .style('fill', 'rgb(200,200,200)')
        .attr('x', 100)
        .attr('y', (d,i) => {return 5+(height+5)*i})
        .attr('width', (d,i) => {return x(Math.abs(d.age))})
        .attr('height', height)
        .attr('id', (d,i) => {return d.id})

    g.append('text')
        .attr('x', 0)
        .attr('y', (d,i) => {return 15+(height+5)*i})
        .text((d,i) => {return d.id;})

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
            fillColor: colorScale(feature.sex),
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
        
        var selectedState = layer.id;
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



function init(){
    rawcrashData = d3.csv("Traffic_Crashes_Medium2.csv");
    var crashData = rawCrashData.map(d => ({
        id : d['PERSON_ID'],
        city : d['CITY'],
        state : d['STATE'],
        sex : d['SEX'],
        age : +d['AGE'],
        safety : d['SAFETY_EQUIPMENT'],
        airbag : d['AIRBAG_DEPLOYED'],
        injury_class : d['MOST_SEVERE_INJURY'],
        phy_condition : d['PHYSICAL_CONDITION'],
        speed_limit: d['POSTED_SPEED_LIMIT'],
        traffic_control_device : d['TRAFFIC_CONTROL_DEVICE'],
        device_condition : d['DEVICE_CONDITION'],
        weather_condition : d['WEATHER_CONDITION'],
        lighting_condition : d['LIGHTING_CONDITION'],
        road_condition : d['ROADWAY_SURFACE_COND'],
        road_defect : d['ROAD_DEFECT'],
        damage : d['DAMAGE'],
        injury_count : d['INJURIES_TOTAL'],
        hour : +d['CRASH_HOUR'],
        day : +d['CRASH_DAY_OF_WEEK'],
        month : +d['CRASH_MONTH'],
        time: +d['TIME']
      }));
    crashData.sort(function(a, b){
        return Math.abs(a.age - b.age)});
    createMap();
    createBarChart(crashData);
}

window.onload = init;

