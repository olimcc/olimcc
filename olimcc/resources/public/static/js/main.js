var ONE_HOUR_MS = 60 * 60 * 1000;

var getPointsOnPath = function(pathNode, segments) {
  var l = pathNode.getTotalLength(),
    segmentLength = l/segments;
  // segments + 1 to start at the 0th point, and finish at the last
  return _.map(_.range(segments + 1), function(_, i) {
    var distance = segmentLength * i,
      point = pathNode.getPointAtLength(distance);
    return {value: [point.x, point.y]};
  });
};

var rdm = function(min, max) {
    return Math.random() * (max - min) + min;
}

var getMail = function() {
  var t = ['o','l','hi','i','@','@','@', 'o','l','i','m','c',
           'yo','c','.','c','f','o','m'];
  var res = t.slice(0, 2).concat(t.slice(3,5))
                         .concat(t.slice(7,12))
                         .concat(t.slice(13,16))
                         .concat(t.slice(17,19));
  return res.join('');
};

/**
 * credit:
 * http://stackoverflow.com/questions/985272/selecting-text-in-an-element-akin-to-highlighting-with-your-mouse
 */
var selectText = function(element) {
    var doc = document,
        range, selection;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

var initCharts = function(data) {

  var data = _.map(data.reverse(), function(d) {return {value: [d.lng, d.lat]}});

  // general space setup
  var rect = d3.select('.splash-container').node().getBoundingClientRect();
  //var header = d3.select('#header').node().getBoundingClientRect();

  var margin = {top: 90, right: 60, bottom: 90, left: 60};
    width = rect.width - margin.right - margin.left,
    // height = rect.height - header.height - margin.top - margin.bottom;
    height = rect.height - margin.top - margin.bottom;

  var svg = d3.select('.svg-container')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('version', '1.1')
      .attr('viewBox', '0 0 ' + rect.width + ' ' + rect.height)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // setup line fn to translate geo coords
  var y = d3.scale.linear()
    .range([height, 0])
    .domain([d3.min(data, function(d) { return d.value[1]; }),
             d3.max(data, function(d) { return d.value[1]; })]);

  var x = d3.scale.linear()
    .range([0, width])
    .domain([d3.min(data, function(d) { return d.value[0]; }),
             d3.max(data, function(d) { return d.value[0]; })]);

  var line = d3.svg.line()
    .x(function(data) {return x(data.value[0])})
    .y(function(data) {return y(data.value[1])})
    .interpolate('cardinal');

  var path = svg.append('path')
              .attr('d', line(data));

  // generate slightly augmented shadow lines
  var segments = 50,
      points = getPointsOnPath(path.node(), segments),
      pixVariability = 12,
      lines = 5,
      fuzzyLine = d3.svg.line()
            .x(function(data, i) {
              return (i == 0 || i == segments) ?
                                data.value[0] :
                                data.value[0] + rdm(-pixVariability, pixVariability)})
            .y(function(data, i) {
              return (i == 0 || i == segments) ?
                                data.value[1] :
                                data.value[1] + rdm(-pixVariability, pixVariability)})
            .interpolate('cardinal');

  _.each(_.range(lines), function() {
    svg.append('path')
      .attr('d', fuzzyLine(points))
      .style('stroke', 'silver')
      .style('stroke-width', 4)
      .style('stroke-opacity', rdm(0.05,0.15))
      .style('fill', 'none');
  });

  // generate actual route line
  var lineSegmentsLine = d3.svg.line()
    .x(function(data) {return data[0]})
    .y(function(data) {return data[1]});

  var segments = 3000,
    points = getPointsOnPath(path.node(), segments),
    outX = _.compact(_.map(points, function(elem, index) {
    if (index+1 != points.length) {
      return [points[index].value, points[index+1].value];
    }}));

  svg.selectAll('path.mainRoute')
    .data(outX)
    .enter()
    .append('path')
    .attr('d', function(d) {return lineSegmentsLine(d)})
    .style('stroke', 'silver')
    .style('stroke-width', 2)
    .style('stroke-opacity', function(d, i) {return i/segments})
    .style('fill', 'none');

  // generate waypoint circles
  svg.selectAll('circle.locations')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function(d){return x(d.value[0])})
    .attr('cy', function(d){return y(d.value[1])})
    .attr('r', 4)
    .style('fill', 'silver')
    .style('stroke', 'black')
    .style('stroke-width', 2)
    .on('click', function(d) {
      console.log(d.value.reverse());
    });

  // generate pulsing location circle
  var makePulseCircle = function(data, times) {
    // base circle
    var pulseCircle = svg.append('circle')
      .attr('cx', x(data[data.length-1].value[0]))
      .attr('cy', y(data[data.length-1].value[1]))
      .attr('r', 0)
      .style('fill', 'white')
      .style('fill-opacity', 0)
      .style('stroke', 'gray')
      .style('stroke-width', 2)
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
          var radius = (count == times) ? 600 : 200,
              duration = (count == times) ? 1900 : 1500;
          pC.attr('r', 0)
            .style('stroke-opacity', .7);
          pC.transition()
            .delay(600)
            .duration(duration)
            .attr('r', radius)
            .style('stroke-opacity', 0)
            .each('end', function() {
              (count < times) ? repeat() : null;
            });
        })();
      })
  }

  var pulseTimes = 5;
  makePulseCircle(data, pulseTimes);
  _.delay(function() {
    makePulseCircle(data, pulseTimes);
  }, 140);
};

var el = document.getElementById('email');
el.innerHTML = getMail();
el.addEventListener('click', function(){
  selectText(el);
});

var exec = function(start, limit) {
  var dest = start ? "http://olimcc.com/location?start=" + start + '&' : "http://olimcc.com/location?",
    dest = limit ? dest + 'limit=' + limit : dest;
  d3.json(dest, function(error, json) {
    if (json.length > 1) {
      initCharts(json);
    } else {
      // look back two more hours
      var newStart = (start || (new Date()).getTime()) - (ONE_HOUR_MS * 2);
      exec(newStart, limit);
    }
  });
}

var url = purl(),
  start = url.param('start'),
  limit = url.param('limit');
exec(start, limit);
