var ReactDOM = require('react-dom');
var React = require('react');
var Dataviz = require('./dataviz.jsx');
var Chart = require('./chart');

require('lib/semantic/semantic.css');
console.log(Chart);
window.app = ReactDOM.render(<Dataviz>




</Dataviz>



, document.getElementById('hk-viz'));
window.app = ReactDOM.render(<Dataviz></Dataviz>, document.getElementById('tw-viz'));
