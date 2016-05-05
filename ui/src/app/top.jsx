import { connect } from 'react-redux';
import moment from 'moment';
import {getReactionImageUrl} from './reaction.js';
import pages from './pages.js'
moment.locale('zh-tw');
// moment().format('MMMM Do YYYY, h:mm:ss a')
const Top = (props) => {
  let emotionUrl = getReactionImageUrl(props.info.type)

  let url = 'https://www.facebook.com/'+props.info.id;
  let displayedTime = moment(props.info.created_time).format('MMM Do hh:mm');

  let title = props.info.name ? props.info.name : props.info.message.substring(0,100) +' ...';

  let pageName = pages[props.info.id.split("_")[0]];

  return (<div className="event">
    <div className="label centered">
      <img src={emotionUrl} />
      <div style={{"textAlign":"center"}}>{props.info.count}</div>
    </div>
    <div className="content">
      <div className="date">
        {displayedTime}
      </div>
      <div className="summary">
        <div className="header">
          <a target="_blank" href={url}>
            {title}
          </a>
        </div>
      </div>
      <div className="meta text">
        <div className="right floated">
          {pageName}
        </div>
      </div>
    </div>
  </div>
)}
export default connect(
  null,
  null
)(Top);
