import { connect } from 'react-redux';
import moment from 'moment';
moment.locale('zh-tw');
import {getReactionImageUrl,getReactionsWithRatio} from './reaction.js';

// moment().format('MMMM Do YYYY, h:mm:ss a')
import {IntlProvider,FormattedDate, addLocaleData} from 'react-intl';

const mapStateToProps = (state,props) => {
  let reactionsByDay = props.location ? state[[props.location,'reactionsByDay'].join('.')] : {};
  let topReactionsByDay = _.mapValues(_.omitBy(reactionsByDay, _.isEmpty), reactions=>{
    let withRatio = getReactionsWithRatio(reactions);
    let top = _.maxBy(_.filter(withRatio,r=>r.type!=='LIKE'),'count');
    //TODO filter nulls first
      return  top;
    }
  );

  _.droptopReactionsByDay

  return {
    topReactionsByDay
  }
}

const Report = (props) =>{
  let sortedDates = _.keys(props.topReactionsByDay).sort();
  let dates = sortedDates.map(d=>parseInt(d.split("_")[0])).map(date=>
    <FormattedDate value={date} day="numeric" month="narrow"></FormattedDate>)
      return (
        <table className="ui very basic collapsing celled table">
          <thead>
            <tr>
              {dates.map(d=><th>{d}</th>)}
              <th><FormattedDate value={Date.now()} day="numeric" month="narrow"></FormattedDate></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {
                sortedDates.map(d=>
                  {
                    let topReaction = props.topReactionsByDay[d];
                    let reactionImgUrl = getReactionImageUrl(topReaction.type);

                    return (<td>
                    <h4 className="ui image header">
                      <img src={reactionImgUrl} className="ui mini rounded image" />
                      <div className="content">
                        {topReaction.count}
                        <div className="sub header">10%
                        </div>
                      </div>
                    </h4>
                  </td>)
                  }
              )}
                </tr>
              </tbody>
            </table>
          )
        }
        export default connect(
          mapStateToProps,
          null
        )(Report);
