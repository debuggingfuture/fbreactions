import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
moment.locale('zh-tw');
import {getReactionImageUrl,getReactionsWithRatio} from './reaction.js';
import ReportRow from './reportRow.jsx'
// moment().format('MMMM Do YYYY, h:mm:ss a')
import {IntlProvider,FormattedDate, addLocaleData} from 'react-intl';

export default (props) =>{
  let sortedDates = _.range(7).reverse().map(d=>moment().utc().startOf('day').subtract(d,'days').valueOf());

  let dates = sortedDates.map(date=>
    <FormattedDate value={date} day="numeric" month="narrow"></FormattedDate>);

      return (
        <table className="ui very basic unstackable celled padded large table">
          <thead>
            <tr>
              <th></th>
              {dates.map(d=><th className="date">{d}</th>)}
            </tr>
          </thead>
          <tbody>
              <ReportRow location='hk' sortedDates={sortedDates}></ReportRow>
              <ReportRow location='tw' sortedDates={sortedDates}></ReportRow>
          </tbody>
        </table>
      )
    }
