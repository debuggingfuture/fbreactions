import { SingleDatePicker } from 'react-dates'
import { VERTICAL_ORIENTATION } from 'react-dates/constants'
require('react-dates/lib/css/_datepicker.css')
import moment from 'moment'
import fetchReactions from './fetchReactions'
import { Provider, connect } from 'react-redux'
class SingleDatePickerWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      focused: false,
      date: moment()
    }

    this.onDateChange = this.onDateChange.bind(this)
    this.onFocusChange = this.onFocusChange.bind(this)
  }

  onDateChange (date) {
    this.setState({ date})
    var offset = moment().startOf('day').diff(moment(date).startOf('day'), 'days')

    // TODO refactor with
    // http://redux.js.org/docs/advanced/AsyncActions.html
    fetchReactions(this.props.dispatch)(offset)
  }

  isOutsideRange (day) {
    return day >= moment()
  }

  onFocusChange ({ focused }) {
    this.setState({ focused})
  }

  render () {
    const { focused, date } = this.state

    return (
      <SingleDatePicker
        {...this.props}
        id='date_input'
        date={date}
        focused={focused}
        isOutsideRange={this.isOutsideRange}
        orientation={VERTICAL_ORIENTATION}
        onDateChange={this.onDateChange}
        onFocusChange={this.onFocusChange} />
    )
  }
}

export default connect(
  null,
  null
)(SingleDatePickerWrapper)
