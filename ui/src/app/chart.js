import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import d3Chart from './d3Chart';
const Chart =  React.createClass({
  getDefaultProps: function() {
    return {
      width: '500',
      height: '400'
    };
  },

  dispatcher: null,

  componentDidMount: function() {
    var el = ReactDOM.findDOMNode(this);
    var dispatcher = d3Chart.create(el, {
      width: this.props.width,
      height: this.props.height
    }, this.getChartState());
    this.dispatcher = dispatcher;
  },

  componentDidUpdate: function(prevProps, prevState) {
    var el = ReactDOM.findDOMNode(this);
    d3Chart.update(el, this.getChartState(), this.dispatcher);
  },

  getChartState: function() {

    var appState = this.props.appState;
    let reactions = this.props.reactions;

    return _.assign({}, appState, { reactions});
  },

  render: function() {
    return (
      <div className="Chart"></div>
    );
  }

});
export default Chart;
