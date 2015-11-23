var initCharts = function(data) {

  var data = _.map(data.reverse(), function(d) {return {value: [d.lng, d.lat]}});

  var margin = {top: 60, right: 60, bottom: 90, left: 60};
    width = 1440 - margin.right - margin.left,
    height = 650 - margin.top - margin.bottom;

  var svg = d3.select('.chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var y = d3.scale.linear()
      .range([height, 0])
      .domain([d3.min(data, function(d) { return d.value[1]; }),
               d3.max(data, function(d) { return d.value[1]; })]);

    var x = d3.scale.linear()
      .range([0, width])
      .domain([d3.min(data, function(d) { return d.value[0]; }),
               d3.max(data, function(d) { return d.value[0]; })]);

  // generate a line fn
  var line = d3.svg.line()
    .x(function(data) {return x(data.value[0])})
    .y(function(data) {return y(data.value[1])})
    .interpolate('cardinal');

  svg.append('path')
    .attr('d', line(data))
    .style('stroke', 'silver')
    .style('stroke-width', '1')
    .style('fill', 'none')

  svg.selectAll('circle.locations')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function(d){return x(d.value[0])})
    .attr('cy', function(d){return y(d.value[1])})
    .attr('r', 4)
    .style('fill', 'silver')
    .style('stroke', 'black')
    .style('stroke-width', '3')
    .on('click', function(d) {
      console.log(d.value.reverse())
    })

    // headphones
    /*
    var centre = [x(data[data.length-1].value[0]), y(data[data.length-1].value[1])]
    var pi = Math.PI;
    var arc = d3.svg.arc()
        .innerRadius(108)
        .outerRadius(110)
        .startAngle(-60 * (pi/180)) //converting from degs to radians
        .endAngle(140 * (pi/180)) //just radians
    svg.append('path')
      .attr('class', 'headphones')
      .attr('d', arc)
      .attr('fill', 'gray')
      .attr('transform', 'translate(' + x(data[data.length-1].value[0]) + ',' + y(data[data.length-1].value[1]) + ')');

    svg.append('rect')
      .attr('class', 'headphones')
      .attr('x', 498)
      .attr('y', 216)
      .attr('width', 15)
      .attr('height', 40)
      .attr('transform', 'rotate(38, 500, 218)')

    svg.append('rect')
      .attr('class', 'headphones')
      .attr('x', 670)
      .attr('y', 355)
      .attr('width', 15)
      .attr('height', 40)
      .attr('transform', 'rotate(38, 671, 356)')

      // headphones text

      var pi = Math.PI;
      var arc = d3.svg.arc()
          .innerRadius(110)
          .outerRadius(117)
          .startAngle(-60 * (pi/180)) //converting from degs to radians
          .endAngle(140 * (pi/180)) //just radians
      svg.append('path')
        .attr('id', 'headphone-text')
        .attr('d', arc)
        .attr('fill', 'none')
        .attr('transform', 'translate(' + x(data[data.length-1].value[0]) + ',' + y(data[data.length-1].value[1]) + ')');

      svg.append('text')
       .append('textPath') //append a textPath to the text element
       .attr('id', 'headphone-text')
    	 .attr('xlink:href', '#headphone-text') //place the ID of the path here
    	 //.style('text-anchor','middle') //place the text halfway on the arc
    	 .attr('startOffset', '6.5%')
       .attr('transform', 'translate(100, 100)')
    	 .text('Flying Lotus - Massage Situation');
       */

    // main circle
    /*
    var coreCircle = svg.append('circle')
      .attr('cx', x(data[data.length-1].value[0]))
      .attr('cy', y(data[data.length-1].value[1]))
      .attr('r', 100)
      .style('fill', 'white')
      .style('stroke', 'black')
      .style('stroke-width', '2');
      */

    var times = 5;

    var makePulseCircle = function() {
      // base circle
      var pulseCircle = svg.append('circle')
        .attr('cx', x(data[data.length-1].value[0]))
        .attr('cy', y(data[data.length-1].value[1]))
        .attr('r', 0)
        .style('fill', 'white')
        .style('fill-opacity', '0')
        .style('stroke', 'gray')
        .style('stroke-width', '2')
        .style('stroke-opacity', .7);

      pulseCircle.transition()
        .duration(1500)
        .attr('r', 200)
        .style('stroke-opacity', 0)
        .each('end', function() {
          var count = 1;
          var pC = d3.select(this);
          (function repeat() {
            count+=1;
            pC.attr('r', 0)
              .style('stroke-opacity', .7);
            pC.transition()
              .delay(600)
              .duration(1500)
              .attr('r', 200)
              .style('stroke-opacity', 0)
              .each('end', function() {
                (count < times) ? repeat() : null;
              });
          })();
        })
    }

    makePulseCircle();
    window.setTimeout(function() {
      makePulseCircle();
    }, 140)



      /*
      var pulseCircle2 = svg.append('circle')
        .attr('cx', x(data[data.length-1].value[0]))
        .attr('cy', y(data[data.length-1].value[1]))
        .attr('r', 0)
       .style('fill', 'white')
       .style('fill-opacity', '0')
        .style('stroke', 'gray')
        .style('stroke-width', '2')
        .style('stroke-opacity', .2);

      pulseCircle2.transition()
        .duration(1200)
        .delay(100)
        .attr('r', 98)
        .style('stroke', 'white')
        .each('end', function() {
          var pC = d3.select(this);
          (function repeat() {
            pC.attr('r', 0)
              .style('stroke', 'gray');
            pC.transition()
              .delay(500)
              .duration(1200)
              .attr('r', 98)
              .style('stroke', 'white')
              .each('end', repeat);
          })();
        })
        */




  /*
  svg.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('x', function(d){return x(d.value[0]) + 6})
    .attr('y', function(d){return y(d.value[1]) + 12})
    .text(function(d) {return d.name})
  */
};

var url = purl(),
  start = url.param('start'),
  dest = start ? "http://olimcc.com/location?start=" + start : "http://olimcc.com/location";
d3.json(dest, function(error, json) {
  initCharts(json);
})
