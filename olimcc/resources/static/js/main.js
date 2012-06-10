/*
Copyright (c) 2011 oli mcc

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

getJsonLoc = function() {
  var base = "http://maps.google.com/maps/api/staticmap?zoom=8&size=380x380&sensor=false";
  $.getJSON("get.php",
            {},
            function success(data){
              var name = data["features"][0]["properties"]["reverseGeocode"];
              var icon = data["features"][0]["properties"]["photoUrl"];
              var coords = data["features"][0]["geometry"]["coordinates"];
              var coords = coords[1] + "," + coords[0];
              base += "&center=" + coords;
              base += "&markers=icon:" + "http://google-maps-icons.googlecode.com/files/blueO.png" + "|"+coords+"|";
              $('#latitudeImg').attr('src', base);
            });
}

var allColours = [
   ["#6F30A0","#5D3978","#421068","#A063D0","#AD80D0",
   "#B62E8A","#893C70","#760F55","#DB60B2","#DB81BD",
   "#4B39A5","#493F7C","#21126B","#7C6BD2","#9386D2"],
   ["#FF0000", "#BF3030", "#A60000", "#FF4040", "#FF7373",
    "#FF7400", "#BF7130", "#A64B00", "#FF9640", "#FFB273",
    "#CD0074", "#992667", "#85004B", "#E6399B", "#E667AF"],
   ["#2E16B1", "#3B2E84", "#180773", "#604BD8", "#8070D8",
    "#640CAB", "#582781", "#3F046F", "#9240D5", "#A468D5",
    "#FFCB00", "#BFA230", "#052F6D", "#284B7E", "#6A94D4"]]

getVal = function() {
  var t = ['o','l','hi','i','@','@','@', 'o','l','i','m','c',
           'yo','c','.','c','f','o','m'];
  var res = t.slice(0, 2).concat(t.slice(3,5))
                         .concat(t.slice(7,12))
                         .concat(t.slice(13,16))
                         .concat(t.slice(17,19));
  return res.join(' ');
}

function randomNum(max) {
    return Math.floor(Math.random() * max + 1);
}

// get our colour scheme
var cols = allColours[randomNum(2)];

// get a random colour from our colour schemes, and
// format it for raphael
function getRdmColor() {
   return cols[randomNum(15)];
  var red = Math.floor(Math.random() * 255);
  var green = Math.floor(Math.random() * 255);
  var blue = Math.floor(Math.random() * 255);
   return 'rgb('+red+','+green+','+blue+')';
}

// get a random opacity for a circle
function getRdmOpacity() {
  return Math.floor(Math.random() * 10 + 1)/10;
}

// everything that needs to happen when the page loads
window.onload = function () {
    // get our lat loc and render the image
    getJsonLoc();

    // draw our location arrow
    var locationArrow = document.getElementById('locationArrow');
    var ctx = locationArrow.getContext('2d');
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.bezierCurveTo(180,65,30,50,10,50);
    ctx.lineTo(20,40);
    ctx.moveTo(10,50);
    ctx.lineTo(20,60);
    ctx.stroke();

    // draw our about me arrow
    var aboutMeArrow = document.getElementById('aboutMeArrow');
    var ctx = aboutMeArrow.getContext('2d');
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 110);
    ctx.bezierCurveTo(100,33,160,25,200,81);
    ctx.lineTo(198,60);
    ctx.moveTo(200,81);
    ctx.lineTo(183,87);
    ctx.stroke();

    // draw our like arrow
    var likeArrow = document.getElementById('likeArrow');
    var ctx = likeArrow.getContext('2d');
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 20);
    ctx.lineTo(50, 0);
    ctx.lineTo(45, 10);
    ctx.moveTo(50,0);
    ctx.lineTo(55,10);
    ctx.stroke();

    // draw our tinkering arrow
    var tinkeringArrow = document.getElementById('tinkeringArrow');
    var ctx = tinkeringArrow.getContext('2d');
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 60);
    ctx.bezierCurveTo(50,100,10,100,0,85);
    ctx.lineTo(10,80);
    ctx.moveTo(0,85);
    ctx.lineTo(5,100);
    ctx.stroke();

    // start raphael
    var paper = Raphael("canvas", "100%", "100%");

    // draw our 150 circles
    var numCircles = 150;
    var maxCircleRadius = 15;
    var path = "M " + screen.width / 2 + " " + screen.height / 2; // start our line from the middle of the page
    for (i = 0; i < numCircles; i++) {
        rad = randomNum(maxCircleRadius);
        xPos = randomNum(screen.width);
        yPos = randomNum(screen.height);
        var mycirc = paper.circle(xPos, yPos, rad).attr({
                fill: getRdmColor(),
                "stroke-opacity": 0.5});
        mycirc.node.onmouseover = function () {
            var this_circ = mycirc;
            return function () {
                this_circ.animate({r: randomNum(maxCircleRadius)},
                                   500,
                                   "bounce");
            }
        }();
        path += "L " + xPos + " " + yPos + " ";
    }
    paper.path(path).attr({"stroke": "red",
                           "stroke-opacity": 0.2});

      // init center circle and center text
      clickme = paper.circle(603, 277, 70).attr({fill: getRdmColor(),
                                                 "opacity": .4,
                                                 "stroke-opacity": 1,
                                                 "stroke": getRdmColor()});
      initText = paper.text(603, 277, "Hi").attr({'fill': 'white',
                                                  'font-size': 40,
                                                  'font-weight': 'bold',
                                                  'font-family':'Waiting for the Sunrise'});
      // hover change opacity
      clickme.node.onmouseover = function() {
        clickme.animate({"opacity":.8, "stroke-width":10}, 300);
      }
      clickme.node.onmouseout = function() {
        clickme.animate({"opacity":.4, "stroke-width":0}, 300);
      }

      // click on the text or the circle to render content circles
      initText.node.onclick = function() {
        showCircles();
      }
      clickme.node.onclick = function() {
        showCircles();
      }

      // reduce the size of init circle, and
      // explode the size of our content circles
      // fade in our html
      function showCircles() {
        clickme.animate({r:23}, 500, "elastic");
        about.animate({r:130}, 1000, "elastic");
        map.animate({r:200}, 1000, "elastic");
        like.animate({r:130}, 1000, "elastic");
        friends.animate({r:170}, 1000, "elastic");
        $('#content').fadeIn(2000);
      }

      // add four content circles and a tooltip circle
      about = paper.circle(493, 170, 20).attr({fill: getRdmColor(),
                                               "stroke-opacity": 1});
      like = paper.circle(560, 424, 20).attr({fill: getRdmColor(),
                                              "stroke-opacity": 1});
      friends = paper.circle(264, 367, 20).attr({fill: getRdmColor(),
                                                 "stroke-opacity": 1});
      tooltipTopLeft =paper.circle(1000, 450, 0).attr({fill: getRdmColor(),
                                                       "stroke-opacity": .7,
                                                       "stroke":"white",
                                                       "stroke-width":4});
      map = paper.circle(820, 220, 20).attr({fill: getRdmColor(),
                                            "stroke-opacity": 1})
                                            .toFront();
      // explode our tooltip box
      showTooltip = function() {
        tooltipTopLeft.animate({r:130}, 900, "elastic");
      }
      // hide our tooltip box
      hideTooltip = function() {
        tooltipTopLeft.animate({r:0}, 1200, "elastic");
      }

      // parses an <a> tag to figure out if there's tooltip content
      // content can be determined by using:
      // ttfunc="aFunction" => calls the func in window scope
      // ttcontent="bla bla bla" => a string
      getAValue = function(a) {
        var f = $(a).attr("ttfunc");
        if (f!=undefined) {
          var fn = window[f];
          var val = fn();
        } else {
          var val = $(a).attr("ttcontent");
        }
        return val;
      }

      // handles hover on <a> tag, draws tooltip accordingly
      $('a').hover(
        function(){
          var val = getAValue(this);
          $('#tooltip').html(val);
          showTooltip();
          _gaq.push(['_trackEvent', 'Links', 'Hover', $(this).attr('href')]);
        });

      $('a').click(function() {
          _gaq.push(['_trackEvent', 'Links', 'Click', $(this).attr('href')]);
      });

};