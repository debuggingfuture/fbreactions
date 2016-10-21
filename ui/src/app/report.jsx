import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
moment.locale('zh-tw')
import { getReactionImageUrl, getReactionsWithRatio } from './reaction.js'
import ReportRow from './reportRow.jsx'
// moment().format('MMMM Do YYYY, h:mm:ss a')
import { IntlProvider, FormattedDate, addLocaleData } from 'react-intl'

function _getSortedDates (lastDate) {
  return {sortedDates: _.range(7).reverse().map(d => moment(lastDate).utc().startOf('day').subtract(d, 'days').valueOf())}
}

const mapStateToProps = (state, props) => {
  if (!state.selectedDate) {
    return _getSortedDates(moment())
  }else {
    return _getSortedDates(parseInt(state.selectedDate.split('_')[0]))
  }
}

const Report = (props) => {
  // let sortedDates = _.range(7).reverse().map(d => moment().utc().startOf('day').subtract(d, 'days').valueOf())

  let dates = props.sortedDates.map(date => <FormattedDate value={date} day='numeric' month='narrow'></FormattedDate>)

  return (
    <table className='ui very basic unstackable celled padded large table'>
      <thead>
        <tr>
          <th></th>
          {dates.map(d => <th className='date'>
                            {d}
                          </th>)}
        </tr>
      </thead>
      <tbody>
        <ReportRow location='hk' sortedDates={props.sortedDates}></ReportRow>
        <ReportRow location='tw' sortedDates={props.sortedDates}></ReportRow>
      </tbody>
    </table>
  )
}

export default connect(
  mapStateToProps,
  null
)(Report)
