import React from 'react';
import Chart from './chart';

// window.app = React.renderComponent(App(), document.body);
import _ from 'lodash';
var classNames = require('classnames');
import { Provider, connect } from 'react-redux';
require('./dataviz.css');

let locationKey;

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


const mapStateToProps = (state,props) => {
  let reactions = props.location ? state[[props.location,'reactionsByDay'].join('.')] : {};
  return {
    reactions:reactions
  }
}


const Dataviz = (props) => {
  return (
      <Chart
        reactions={props.reactions}
        appState={props.state}
        setAppState={props.setAppState} />
  );
}



// const Dataviz = React.createClass({
//   getInitialState: function() {
//     console.log(this.props.location);
//     var domain = [0, 30];
//     return {
//       locationKey: this.props.location,
//       data: this.getData(domain),
//       domain: {x: domain, y: [0, 100]},
//       tooltip: null,
//       prevDomain: null,
//       showingAllTooltips: false,
//       float:'left'
//     };
//   },
//
//   _allData:dataGenerator.generate(50),
//
//   getData: function(domain) {
//     return _.filter(this._allData, this.isInDomain.bind(null, domain));
//   },
//
//   addDatum: function(domain) {
//     this._allData.push(dataGenerator.generateDatum(domain));
//     return this.getData(domain);
//   },
//
//   removeDatum: function(domain) {
//     var match = _.find(this._allData, this.isInDomain.bind(null, domain));
//     if (match) {
//       this._allData = _.reject(this._allData, {id: match.id});
//     }
//     return this.getData(domain);
//   },
//
//   isInDomain: function(domain, d) {
//     return d.x >= domain[0] && d.x <= domain[1];
//   },
//
//   render: function() {
//     // TODO refactor
//   // semantic ui float only work at column level
//   // Do this manually first
//   // https://facebook.github.io/react/docs/multiple-components.html#dynamic-children
//     return (
//         <Chart
//           nodes={this.props.reactions}
//           appState={this.state}
//           setAppState={this.setAppState} />
//     );
//   },
//
//   setAppState: function(partialState, callback) {
//     return this.setState(partialState, callback);
//   }
// });
console.log(Dataviz);

export default connect(
  mapStateToProps,
  null
)(Dataviz)
