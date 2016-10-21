import _ from 'lodash'
import d3Chart from './d3Chart'

const Chart = React.createClass({
  getDefaultProps: function () {
    return {
      width: 450,
      height: 400
    }
  },

  dispatcher: null,

  _createDispatcher: function () {
    var el = ReactDOM.findDOMNode(this)
    return d3Chart.create(el, {
      width: this.props.width,
      height: this.props.height
    }, this.getChartState())
  },
  componentDidMount: function () {
    this.dispatcher = this._createDispatcher()
  },

  componentDidUpdate: function (prevProps, prevState) {
    var el = ReactDOM.findDOMNode(this)
    // Hack to completely redraw for now, if state
    d3Chart.destroy(el)
    this.dispatcher = this._createDispatcher()
  // d3Chart.update(el, this.getChartState(), this.props, this.dispatcher)
  },

  getChartState: function () {
    var appState = this.props.appState
    let reactions = this.props.reactions

    return _.assign({}, appState, { reactions})
  },

  render: function () {
    return (
      <div className='Chart'></div>
    )
  }

})
export default Chart
