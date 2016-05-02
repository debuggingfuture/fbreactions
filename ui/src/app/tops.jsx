import Top from './top.jsx';
import { connect } from 'react-redux';
let items = [];
let tops = [1,2,4];
var locationKey;
const mapStateToProps = (state) => {
  if(!locationKey) return {};
  var key = [locationKey, 'tops'].join('.');
  return {
    tops: state[key]
  }
}

const Tops = (props) => {
  locationKey = props.location;
  if(props.tops){
    props.tops.forEach((top,i)=>{
      items.push(<Top info={top}></Top>);
      if(i+1 != tops.length){
        items.push(<div className="ui divider"></div>)
      }
    });
  }

  return (
    <div className="ui feed">{items}</div>
  )
}


export default connect(
  mapStateToProps,
  null
)(Tops);
