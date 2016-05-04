var EventEmitter = require('events').EventEmitter;
var d3 = require('d3');
import _ from 'lodash';
require('./d3Chart.css');
import {getReactionImageUrl,getReactionsWithRatio} from './reaction.js';
var ANIMATION_DURATION = 400;
var TOOLTIP_WIDTH = 30;
var TOOLTIP_HEIGHT = 30;

var MAX_WIDTH=450;
var MAX_HEIGHT=400;

function isMobile() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

//TODO class
var ns = {};
ns.create = function(el, props, state) {
  state.width = props.width;
  state.height = props.height;
  var fill = d3.scale.category10();
  // link the other four so largest fall inside, or by setting init position
  // http://bl.ocks.org/sathomas/191a8a302a363ac6a4b0

  let svg = d3.select(el).append("svg")
  .attr("viewBox", "0 0 450 400")
  // .attr("preserveAspectRatio", "xMinYMax meet")
  .attr("width", props.width)
  .attr("height", props.height);

  svg.style("opacity", 1e-6)
  .transition()
  .duration(1000)
  .style("opacity", 1);

  var dispatcher = new EventEmitter();
  this.update(el, state, props, dispatcher);

  return dispatcher;
};



ns.k = function (length,width,height) {
  return Math.sqrt(length / (width * height));
}
ns.update = function(el, state, props, dispatcher) {
  if(_.isEmpty(state.reactions)){
    return;
  }

  //TODO 2nd update (componentDidUpdate) don't work
  var nodes = getReactionsWithRatio(state.reactions);
//   var nodes = [
//   {index: 1,type:'ANGRY',count:0.23},
// {index: 2,type:'HAHA',count:0.1},
// {index: 2,type:'HAHA',count:0.1},
// {index: 2,type:'HAHA',count:0.1},
// {index: 2,type:'HAHA',count:0.1}];

    var node = d3.select(el).select('svg').selectAll(".node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node");

    var sizeByCount=(d)=>(
      Math.sqrt(Math.max(d.ratio/d.ratio_total,0.05)) * 150
    )

    function tick(e) {
      // Push different nodes in different directions for clustering.

      images.attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; });

      labels.attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; });
    }

// TODO tune the charge
    // http://stackoverflow.com/questions/9901565/charge-based-on-size-d3-force-layout
    let k = this.k(nodes.length,props.width,props.height);
    console.log("k"+k);
    var force = d3.layout.force()
    .nodes(nodes)
    .gravity(0.4)
    .charge(-1700)
    .size([props.width,props.height])
    .on("tick", tick)
    .start();


    // labels before images for svg z-index
    let labels = node
    .append("text")
    .attr("dx", 1)
    .attr("dy", 1)
    .text(function(d) { return (d.ratio * 100).toFixed(0) +'%' });

    var images = node.append("image")
    .attr("xlink:href", (d)=>getReactionImageUrl(d.type))
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("width", sizeByCount)
    .attr("height", sizeByCount)

    // .style("fill", function(d, i) { return fill(i & 3); })
    // .style("stroke", function(d, i) { return d3.rgb(fill(i & 3)).darker(2); })
    .call(force.drag)
    .on("mousedown", function() { d3.event.stopPropagation(); });

    var like = d3.select(el).select('svg')
    .append("image")
    .attr("xlink:href", (d)=>getReactionImageUrl('LIKE'))
    .attr("x", 360)
    .attr("y", 370)
    .attr("width", 30)
    .attr("height", 30)
    .call(force.drag)
    .on("mousedown", function() { d3.event.stopPropagation(); });

    var likeRatio = (state.reactions['LIKE'] /  _.sum(_.values(state.reactions))*100).toFixed(0);
    d3.select(el).select('svg')
    .append("text")
    .attr("x", 400)
    .attr("y", 390)
    .text(likeRatio+'%')
// state.reactions['LIKE'] + ' - ' +




    // namespace otherwise as will replace as the only listener
    // http://stackoverflow.com/questions/14749182/how-to-register-multiple-external-listeners-to-the-same-selection-in-d3
    if(!isMobile()){
      d3.select(window).on('resize.'+props.id, ns._resize.bind(null, el, nodes,props,force));
    }

    d3.select(el)
    .on("mousedown", this._mousedown(nodes,force));
    // var scales = this._scales(el, state.domain);
    // var prevScales = this._scales(el, state.prevDomain);
    // this._drawPoints(el, scales, state.data, prevScales, dispatcher);
    // this._drawTooltips(el, scales, state.tooltips, prevScales);
  };

  ns._resize = function (el, nodes,props,force) {
    // let width = parseInt(d3.select(el).style('width'), 10);
    //   var renderWidth  = Math.min(props.width, Math.max(300,width) );
    //
    //   var k = Math.sqrt(nodes.length / (renderWidth * props.height));
    //   force.size([ renderWidth,props.height]);
    //   let svg = d3.select(el).select("svg")
    //   .attr("width", renderWidth);

      ns._mousedown(nodes,force);
  }

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
