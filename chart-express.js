var express = require('express');
var jsdom = require('jsdom');
var fs = require('fs');
var gm = require('gm');
var juice = require('juice2');
var Readable = require('stream').Readable;
var EventEmitter = require('events').EventEmitter;

var svgPreamble = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

exports = module.exports = function() {
  var app = express();
  app.chart = function(path, cb) {
    this.get(path, htmlHandler(cb));
    this.get(path + '.svg', svgHandler(cb));
    this.get(path + '.png', pngHandler(cb));
  };
  return app;
};

function htmlHandler(chart) {
  return function(req, res) {
    chartStream(chart, req).on('data', function(svg) {
      res.send(svg);
    });
  };
}

function svgHandler(chart) {
  return function(req, res) {
    res.set('Content-Type', 'image/svg+xml');
    chartStream(chart, req).on('data', function(svg) {
      res.send(svg);
    });
  };
}

function pngHandler(chart) {
  return function(req, res) {
    res.set('Content-Type', 'image/png');
    chartStream(chart, req).on('data', function(svg) {
      var inStream = new Readable;
      inStream.push(svg);
      inStream.push(null);
      gm(inStream)
        .options({ imageMagick: true })
        .toBuffer('PNG', function (err, buffer) {
          if (err) { console.log(err); }
          res.send(buffer);
        });
    });
  }
}

function chartStream(chart, req) {
  var channel = new EventEmitter;

  jsdom.env({
    html: '<html><svg/></html>',
    done: function(err, window) {
      var el = window.document.getElementsByTagName('svg')[0];
      var css = chart(el, req, window) || '';

      var svgAttrs = Array.prototype.slice.call(el.attributes).map(function(attr) {
        return attr.nodeName + '="' + attr.nodeValue + '"';
      });
      svgAttrs.push('xmlns="http://www.w3.org/2000/svg"');
      svgAttrs.push('version="1.1"');

      var svg = [
        '<svg ' + svgAttrs.join(' ') + '>',
          el.innerHTML,
        '</svg>'
      ].join('\n');

      svg = svgPreamble + '\n' + juice.inlineContent(svg, css).replace(/<\/?(html|body)>/g, '');
      svg = svg.trim();

      channel.emit('data', svg);
    }
  });

  return channel;
}
