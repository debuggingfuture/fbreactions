import { connect } from 'react-redux';
import moment from 'moment';
moment.locale('zh-tw');
import _ from 'lodash';
import {getReactionImageUrl,getReactionsWithRatio} from './reaction.js';

// moment().format('MMMM Do YYYY, h:mm:ss a')
import {IntlProvider,FormattedDate, addLocaleData} from 'react-intl';
// _.omitBy(reactionsByDay, _.isEmpty)
const mapStateToProps = (state,props) => {
  let reactionsByDay = props.location ? state[[props.location,'reactionsByDay'].join('.')] : {};
  let topReactionsByDay = _.mapValues(reactionsByDay, reactions=>{
    let withRatio = getReactionsWithRatio(reactions);
    let top = _.maxBy(_.filter(withRatio,r=>r.type!=='LIKE'),'count');
    //TODO filter nulls first
      return  top ? top : {};
    }
  );

  return {
    topReactionsByDay
  }
}

const ReportRow = (props) =>{
// TODO extract proper i18n
  let displayedName = props.location === 'hk' ? '香港': '台灣';
  return (
            <tr>
              <td>{displayedName}</td>
              {
                props.sortedDates.map(d=>
                  {
                    var start = moment(d).startOf('day').format('x');
                    var end =   moment(d).endOf('day').format('x');
                    let key = [start,end].join('_');
                    let topReaction = props.topReactionsByDay[key];
                    if(_.isEmpty(topReaction)){
                      return <td></td>
                    }
                    let reactionImgUrl = getReactionImageUrl(topReaction.type);

                    return (<td>
                      <h4 className="ui image header centered">
                        <img src={reactionImgUrl} className="ui mini rounded image" />
                        <div className="centered content">
                          {(topReaction.ratio*100).toFixed(0)}%
                          <div className="sub header">{topReaction.count}</div>
                        </div>
                      </h4>
                  </td>)
                  }
              )}
            </tr>
          )
        }
export default connect(
  mapStateToProps,
  null
)(ReportRow);
