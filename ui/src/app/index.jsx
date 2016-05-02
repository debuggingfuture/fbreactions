var ReactDOM = require('react-dom');
var Dataviz = require('./dataviz.jsx');
var Chart = require('./chart');
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

function reactionsByDay(state = {}, action) {
  switch(action.type){
    case FETCH_AGG:
    return action.reactions;
  }
  return state;
}
function tops(state =  [], action) {
  switch(action.type){
    case FETCH_AGG:
    return action.tops;
  }
  return state;
}
let store = createStore(
  combineReducers({
    "tw.reactionsByDay":reactionsByDay,
    "tw.tops":tops
  })
);

console.log(fetch);

//
fetch(getEndpoint('hk'))
.then(function (res) {
  return res.json();
})
.then(function (json) {
  let today = Object.keys(json).sort().reverse()[0];
  var data = _.pick(json[today],['tops','reactions']);
  store.dispatch(_.assign({ type: FETCH_AGG }, data));

})

require('lib/semantic/semantic.css');
console.log(Chart);
ReactDOM.render(
  <Provider store={store}>
    <Dataviz ></Dataviz>
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
