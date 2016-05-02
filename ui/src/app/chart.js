import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
var d3Chart = require('./d3Chart');
import { Provider, connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    reactions: state['tw.reactionsByDay']
  }
}

const Chart = React.createClass({
  getDefaultProps: function() {
    return {
      width: '500',
      height: '500'
    };
  },

  dispatcher: null,

  componentDidMount: function() {
    var el = ReactDOM.findDOMNode(this);
    var dispatcher = d3Chart.create(el, {
      width: this.props.width,
      height: this.props.height
    }, this.getChartState());
    dispatcher.on('point:mouseover', this.showTooltip);
    dispatcher.on('point:mouseout', this.hideTooltip);
    this.dispatcher = dispatcher;
  },

  componentDidUpdate: function(prevProps, prevState) {
    var el = ReactDOM.findDOMNode(this);
    d3Chart.update(el, this.getChartState(), this.dispatcher);
  },

  getChartState: function() {
    var appState = this.props.appState;
    let reactions = this.props.reactions;
    var tooltips = [];
    if (appState.showingAllTooltips) {
      tooltips = appState.data;
    }
    else if (appState.tooltip) {
      tooltips = [appState.tooltip];
    }

    return _.assign({}, appState, {tooltips, reactions});
  },

  render: function() {
    return (
      <div className="Chart"></div>
    );
  },

  showTooltip: function(d) {
    if (this.props.appState.showingAllTooltips) {
      return;
    }

    this.props.setAppState({
      tooltip: d,
      // Disable animation
      prevDomain: null
    });
  },

  hideTooltip: function() {
    if (this.props.appState.showingAllTooltips) {
      return;
    }

    this.props.setAppState({
      tooltip: null,
      prevDomain: null
    });
  }
});

export default connect(
  mapStateToProps,
  null
)(Chart)
