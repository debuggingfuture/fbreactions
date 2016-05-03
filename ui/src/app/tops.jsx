import Top from './top.jsx';
import { connect } from 'react-redux';
const mapStateToProps = (state,props) => {
  let tops = props.location ? state[[props.location, 'tops'].join('.')]  : [];
  return {
    tops: tops
  }
}

const Tops = (props) => {
  let items = [];
  if(props.tops){
    props.tops.forEach((top,i)=>{
      items.push(<Top info={top}></Top>);
      if(i+1 != props.tops.length){
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
