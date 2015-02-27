var chartServer = require('./chart-express');
var app = chartServer();

app.get('/', function(req, res) {
  res.send('Server is up');
});

app.chart('/bar', function(svg) {
  svg.innerHTML = '<rect x="10px" y="10px" width="100px" height="100px"/>';
  return 'svg { background:transparent; fill:transparent; } rect { fill: #F00; }';
});

app.chart('/mark', function(svg) {
  svg.setAttribute('width', '124');
  svg.setAttribute('height', '171');
  svg.innerHTML =
    '<defs id="defs6703"/>' +
    '<path d="M 34.272792,168.74752 L 104.92176,168.74752 L 121.12152,123.29818 L 121.12152,70.648951 C 121.12152,63.32795 97.271872,58.119526 97.271872,62.099076 L 97.271872,78.298839 L 97.271872,54.899181 C 97.271872,50.63179 73.549337,47.398034 73.549337,54.899181 L 73.549337,72.448924 L 73.549337,8.5498578 C 67.005561,-2.7842939 50.022562,2.6459339 50.022562,8.5498578 L 50.022562,73.798905 L 50.022562,54.449187 C 50.022562,48.609481 26.22282,48.735743 26.22282,54.449187 L 26.22282,104.39846 L 26.22282,78.72622 C 26.32241,71.969226 3.6180734,71.240435 3.2232454,78.72622 L 3.2232454,105.74844 L 34.272792,168.74752 z " style="fill:white;fill-opacity:1;fill-rule:evenodd;stroke:black;stroke-width:3.86915421;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path6709"/>'
});

app.listen(3000);
