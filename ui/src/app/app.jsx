var React = require('react');

// window.app = React.renderComponent(App(), document.body);
var _ = require('lodash');

//
var X_MIN = 1;
var X_MAX = 100;
var Y_MIN = 10;
var Y_MAX = 90;
var Z_MIN = 1;
var Z_MAX = 10;

var ns = {};

ns.generate = function(n) {
  var res = [];
  for (var i = 0; i < n; i++) {
   res.push(this.generateDatum([X_MIN, X_MAX]));
  }
  return res;
};

ns.generateDatum = function(domain) {
  return {
    id: this._uid(),
    x: this._randomIntBetween(domain[0], domain[1]),
    y: this._randomIntBetween(Y_MIN, Y_MAX),
    z: this._randomIntBetween(Z_MIN, Z_MAX),
  };
};

ns._randomIntBetween = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

ns._uid = function() {
  return _.random();
};

var dataGenerator = ns;

//
var Chart = require('./chart');

var App = React.createClass({
  getInitialState: function() {
    var domain = [0, 30];
    return {
      data: this.getData(domain),
      domain: {x: domain, y: [0, 100]},
      tooltip: null,
      prevDomain: null,
      showingAllTooltips: false
    };
  },

  _allData:dataGenerator.generate(50),

  getData: function(domain) {
    return _.filter(this._allData, this.isInDomain.bind(null, domain));
  },

  addDatum: function(domain) {
    this._allData.push(dataGenerator.generateDatum(domain));
    return this.getData(domain);
  },

  removeDatum: function(domain) {
    var match = _.find(this._allData, this.isInDomain.bind(null, domain));
    if (match) {
      this._allData = _.reject(this._allData, {id: match.id});
    }
    return this.getData(domain);
  },

  isInDomain: function(domain, d) {
    return d.x >= domain[0] && d.x <= domain[1];
  },

  render: function() {
    return (
      <div className="App">
        <Chart
          appState={this.state}
          setAppState={this.setAppState} />
      </div>
    );
  },

  setAppState: function(partialState, callback) {
    return this.setState(partialState, callback);
  }
});
console.log(App);

module.exports = App;
