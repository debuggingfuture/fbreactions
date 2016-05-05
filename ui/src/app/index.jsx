var ReactDOM = require('react-dom');
import Dataviz from './dataviz.jsx';
//boilerplate..
//https://github.com/whatwg/fetch/issues/56
import { Provider, connect } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import _ from 'lodash';
require('./report-mobile.css');
// TODO pre load locale-data
import zh from 'react-intl/locale-data/zh';
addLocaleData([...zh])
import {IntlProvider,FormattedDate, addLocaleData} from 'react-intl';
import Tops from './tops';
import Report from './report';

const FETCH_AGG = 'FETCH_AGG';
function getEndpoint(location) {
  var url = 'https://8zbfsx31e0.execute-api.ap-northeast-1.amazonaws.com/prod/reactions';
  url += '?location='+location;
  return url;
}

// TODO
// first load set it
// cannot base on another state to reduce
function selectedDate(state='', action) {
  switch(action.type){
    case FETCH_AGG:
    return action.payload.selectedDate;
  }
  return state;
}
// https://github.com/acdlite/flux-standard-action
// Hacky to make use of meta to skip unrelated actions
function reactionsByDay(location, state = {}, action) {
  if(!action.payload){
    return {};
  }
  let reactionsByDay = _.mapValues(action.payload.byDay,v=>v ? v.reactions:{});
  switch(action.type){
    case FETCH_AGG:
      if(location === action.meta.location)  return reactionsByDay;
  }
  return state;
}
function tops(location, state =  [], action) {
  if(!action.payload){
    return [];
  }
  let tops = action.payload.byDay[action.payload.selectedDate].tops;
  switch(action.type){
    case FETCH_AGG:
      if(location === action.meta.location) return tops;
  }
  return state;
}
// TODO tops is topsofDay
let store = createStore(
  combineReducers({
    selectedDate,
    "tw.reactionsByDay":reactionsByDay.bind(null,'tw'),
    "tw.tops":tops.bind(null,'tw'),
    "hk.reactionsByDay":reactionsByDay.bind(null,'hk'),
    "hk.tops":tops.bind(null,'hk')
  })
);

['hk','tw'].map(location=>
  fetch(getEndpoint(location))
  .then(function (res) {
    return res.json();
  })
  .then(function (json) {
    store.dispatch(_.assign({ type: FETCH_AGG, meta:{"location":location}}, {payload:{
      byDay:json,
      selectedDate: Object.keys(json).sort().reverse()[0]
    }}));

  })
)


require('lib/semantic/semantic.css');
ReactDOM.render(
  <Provider store={store}>
    <Dataviz location='hk' ></Dataviz>
  </Provider>, document.getElementById('hk-viz')
);
ReactDOM.render(
  <Provider store={store}>
    <Dataviz location='tw' ></Dataviz>
  </Provider>, document.getElementById('tw-viz'));

  ReactDOM.render(
    <Provider store={store}>
      <Tops location="hk"></Tops>
    </Provider>, document.getElementById('hk-tops'));

    ReactDOM.render(
      <Provider store={store}>
        <Tops location="tw"></Tops>
      </Provider>, document.getElementById('tw-tops'));

  ReactDOM.render(
    <Provider store={store}>
        <IntlProvider locale="zh">
      <div className="hscrollable">
        <Report></Report>
      </div>
        </IntlProvider>
    </Provider>, document.getElementById('reports'));


      // var time
      ReactDOM.render(
        <IntlProvider locale="zh">
          <FormattedDate value={Date.now()} day="numeric" month="narrow" year="numeric"></FormattedDate>
          </IntlProvider>
        , document.getElementById('today'));
