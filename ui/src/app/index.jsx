var ReactDOM = require('react-dom');
var React = require('react');
var App = require('./app.jsx');
var Chart = require('./chart');
console.log(App);
console.log(Chart);
window.app = ReactDOM.render(<App></App>, document.getElementById('chart'));
