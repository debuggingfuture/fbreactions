var EventEmitter = require('events').EventEmitter;
var d3 = require('d3');
import _ from 'lodash';
require('./d3Chart.css');

var ANIMATION_DURATION = 400;
var TOOLTIP_WIDTH = 30;
var TOOLTIP_HEIGHT = 30;

//TODO class
var ns = {};
var svg;
ns.create = function(el, props, state) {

  var fill = d3.scale.category10();


  // link the other four so largest fall inside, or by setting init position
  // http://bl.ocks.org/sathomas/191a8a302a363ac6a4b0


  svg = d3.select(el).append("svg")
  .attr("viewBox", "100 0 500 500")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("width", props.width)
  .attr("height", props.height);

  svg.style("opacity", 1e-6)
  .transition()
  .duration(1000)
  .style("opacity", 1);

  var dispatcher = new EventEmitter();
  this.update(el, state, dispatcher);

  return dispatcher;
};

function createNodes(reactions) {
  // var total = _.values(reactions);
  if(_.isEmpty(reactions)){
    return [];
  }
  //cal w/ LIKE
  let total = _.sum(_.values(reactions));

  return _.map(_.omit(reactions, ['LIKE']),(v,k,o)=>(
    {
      'type': k,
      'ratio': v/total,
      'count':v
    }));
}

ns.update = function(el, state, dispatcher) {
  if(_.isEmpty(state.reactions)){
    return;
  }

  //TODO 2nd update (componentDidUpdate) don't work
  var nodes = createNodes(state.reactions);
//   var nodes = [
//   {index: 1,type:'ANGRY',count:0.23},
// {index: 2,type:'HAHA',count:0.1},
// {index: 2,type:'HAHA',count:0.1},
// {index: 2,type:'HAHA',count:0.1},
// {index: 2,type:'HAHA',count:0.1}];

    var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node");

    var sizeByCount=(d)=>(
      Math.max(d.ratio,0.02)* 750
    )

    function tick(e) {
      // Push different nodes in different directions for clustering.

      images.attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; });

      labels.attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; });
    }

    //TODO why link data?
    var force = d3.layout.force()
    .nodes(nodes)
    .gravity(0.1)
    .charge(-600)
    .size([500,500])
    .on("tick", tick)
    .start();


    var images = node.append("image")
    .attr("xlink:href", function(d) {
      return d.type.toLowerCase() + '.png';
    })
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("width", sizeByCount)
    .attr("height", sizeByCount)
    // .style("fill", function(d, i) { return fill(i & 3); })
    // .style("stroke", function(d, i) { return d3.rgb(fill(i & 3)).darker(2); })
    .call(force.drag)
    .on("mousedown", function() { d3.event.stopPropagation(); });

    var labels = node
    .append("text")
    .attr("dx", 1)
    .attr("dy", 1)
    .text(function(d) { return (d.ratio * 100).toFixed(0) +'%' })



    d3.select(el)
    .on("mousedown", this._mousedown(nodes,force));
    // var scales = this._scales(el, state.domain);
    // var prevScales = this._scales(el, state.prevDomain);
    // this._drawPoints(el, scales, state.data, prevScales, dispatcher);
    // this._drawTooltips(el, scales, state.tooltips, prevScales);
  };

  ns._mousedown = function(nodes, force) {
    nodes.forEach(function(o, i) {
      o.x += (Math.random() - .5) * 40;
      o.y += (Math.random() - .5) * 40;
    });
    force.resume();
  }

  ns.destroy = function(el) {

  };

  module.exports = ns;
