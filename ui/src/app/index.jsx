var ReactDOM = require('react-dom');
import Dataviz from './dataviz.jsx';
//boilerplate..
//https://github.com/whatwg/fetch/issues/56
import { Provider, connect } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import _ from 'lodash';
// TODO pre load locale-data
import zh from 'react-intl/locale-data/zh';
addLocaleData([...zh])
import {IntlProvider,FormattedDate, addLocaleData} from 'react-intl';
import Tops from './tops';

const FETCH_AGG = 'FETCH_AGG';
function getEndpoint(location) {
  var url = 'https://8zbfsx31e0.execute-api.ap-northeast-1.amazonaws.com/prod/reactions';
  url += '?location='+location;
  return url;
}

// https://github.com/acdlite/flux-standard-action
// Hacky to make use of meta to skip unrelated actions
function reactionsByDay(location, state = {}, action) {
  switch(action.type){
    case FETCH_AGG:
      if(location === action.meta.location)  return action.reactions;
  }
  return state;
}
function tops(location, state =  [], action) {
  switch(action.type){
    case FETCH_AGG:
      if(location === action.meta.location) return action.tops;
  }
  return state;
}
let store = createStore(
  combineReducers({
    "tw.reactionsByDay":reactionsByDay.bind(null,'tw'),
    "tw.tops":tops.bind(null,'tw'),
    "hk.reactionsByDay":reactionsByDay.bind(null,'hk'),
    "hk.tops":tops.bind(null,'hk')
  })
);

console.log(fetch);

//

['hk','tw'].map(location=>
  fetch(getEndpoint('hk'))
  .then(function (res) {
    return res.json();
  })
  .then(function (json) {
    let today = Object.keys(json).sort().reverse()[0];
    var data = _.pick(json[today],['tops','reactions']);
    store.dispatch(_.assign({ type: FETCH_AGG, meta:{location}}, data));

  })
)


require('lib/semantic/semantic.css');
console.log(Dataviz);
ReactDOM.render(
  <Provider store={store}>
    <Dataviz location='hk' ></Dataviz>
  </Provider>, document.getElementById('hk-viz')
);
// ReactDOM.render(
//   <Provider store={store}>
//     <Dataviz ></Dataviz>
//   </Provider>, document.getElementById('tw-viz'));

  ReactDOM.render(
    <Provider store={store}>
      <Tops location="hk"></Tops>
    </Provider>, document.getElementById('hk-tops'));

    ReactDOM.render(
      <Provider store={store}>
        <Tops location="tw"></Tops>
      </Provider>, document.getElementById('hk-tops'));

      // var time
      ReactDOM.render(
        <IntlProvider locale="zh">
          <FormattedDate value={Date.now()} day="numeric" month="long" year="numeric"></FormattedDate>
          </IntlProvider>
        , document.getElementById('today'));
